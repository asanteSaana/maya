import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createCart, getCart, updateCart } from "../services/cart";
import { SHIPPING_FEE, VAT_RATE } from "../services/constants";
import { normalizeProduct } from "../services/normalizers";
import { getProducts } from "../services/products";
import { useAuth } from "./AuthContext";

const CART_STORAGE_KEY = "maya.cart";
const LEGACY_CART_STORAGE_KEY = "munfirm";
const SYNC_DEBOUNCE_MS = 800;

const CartContext = createContext(null);

const readStoredItems = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed.items) ? parsed.items : [];
    }

    const legacy = window.localStorage.getItem(LEGACY_CART_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      return Array.isArray(parsed.cartData) ? parsed.cartData : [];
    }
  } catch {
    return [];
  }

  return [];
};

const storeItems = (items) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
};

const getItemKey = (item) =>
  `${item.productId || item.id}:${item.catalogueId || "default"}`;

const toCartItem = (product, quantity = 1, selectedCatalogue) => {
  const normalized = normalizeProduct(product);
  const catalogue = selectedCatalogue || normalized.catalogue[0] || {};

  return {
    id: normalized.id,
    productId: normalized.id,
    catalogueId: catalogue.id || catalogue._id || product.catalogueId || "",
    title: normalized.title,
    description: normalized.description,
    image: normalized.image,
    price: Number(catalogue.price || normalized.price || product.price || 0),
    quantity: Number(quantity || 1),
    size: catalogue.size || normalized.size || product.size || "",
  };
};

const normalizeRemoteCart = (payload) => {
  const cart = Array.isArray(payload) ? payload[0] : payload;
  return Array.isArray(cart?.products) ? cart.products : [];
};

/**
 * Remote cart rows carry only ids and quantities. The cart UI and totals need
 * title, image and price, so each row is matched back to its product.
 */
const hydrateRemoteItems = (rows, products) => {
  const byId = new Map(products.map((product) => [product.id, product]));

  return rows
    .map((row) => {
      const productId =
        typeof row.productId === "object"
          ? row.productId?._id || row.productId?.id
          : row.productId;
      const product = byId.get(productId);

      if (!product) {
        return null;
      }

      const catalogueId =
        typeof row.catalogueId === "object"
          ? row.catalogueId?._id || row.catalogueId?.id
          : row.catalogueId;
      const catalogue =
        product.catalogue.find((entry) => entry.id === catalogueId) ||
        product.catalogue[0] ||
        {};

      return {
        id: product.id,
        productId: product.id,
        catalogueId: catalogue.id || catalogueId || "",
        title: product.title,
        description: product.description,
        image: product.image,
        price: Number(catalogue.price || product.price || 0),
        quantity: Number(row.quantity || 1),
        size: catalogue.size || product.size || "",
      };
    })
    .filter(Boolean);
};

/** Sums quantities for lines present in both carts rather than overwriting. */
const mergeItems = (localItems, remoteItems) => {
  const merged = new Map();

  remoteItems.forEach((item) => merged.set(getItemKey(item), { ...item }));

  localItems.forEach((item) => {
    const key = getItemKey(item);
    const existing = merged.get(key);

    if (existing) {
      existing.quantity =
        Number(existing.quantity || 0) + Number(item.quantity || 0);
      return;
    }

    merged.set(key, { ...item });
  });

  return Array.from(merged.values());
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isReady: authReady } = useAuth();
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState("");
  // Stays false until the guest/remote merge settles, so the debounced writer
  // cannot race the merge and push a half-formed cart.
  const [canSync, setCanSync] = useState(false);

  const itemsRef = useRef(items);
  const hasRemoteCartRef = useRef(false);
  const hasMergedRef = useRef(false);
  const syncTimerRef = useRef(null);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    setItems(readStoredItems());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      storeItems(items);
    }
  }, [isReady, items]);

  // PUT updates an existing cart; the backend needs POST /create the first time.
  const persistCart = useCallback(async (nextItems) => {
    if (hasRemoteCartRef.current) {
      try {
        return await updateCart(nextItems);
      } catch (updateError) {
        if (updateError.status !== 404) {
          throw updateError;
        }
      }
    }

    const created = await createCart(nextItems);
    hasRemoteCartRef.current = true;
    return created;
  }, []);

  const loadRemoteCart = useCallback(async () => {
    setIsSyncing(true);
    setError("");

    try {
      const [payload, products] = await Promise.all([getCart(), getProducts()]);
      const rows = normalizeRemoteCart(payload);
      hasRemoteCartRef.current = Boolean(payload);

      const remoteItems = hydrateRemoteItems(rows, products);
      setItems(remoteItems);
      return remoteItems;
    } catch (requestError) {
      setError(requestError.message);
      return [];
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // On sign-in, fold whatever was collected as a guest into the saved cart
  // instead of letting one silently replace the other.
  const mergeGuestCart = useCallback(async () => {
    setIsSyncing(true);
    setError("");

    try {
      const [payload, products] = await Promise.all([getCart(), getProducts()]);
      const rows = normalizeRemoteCart(payload);
      hasRemoteCartRef.current = rows.length > 0;

      const remoteItems = hydrateRemoteItems(rows, products);
      const merged = mergeItems(itemsRef.current, remoteItems);

      setItems(merged);

      if (merged.length) {
        await persistCart(merged);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSyncing(false);
      setCanSync(true);
    }
  }, [persistCart]);

  useEffect(() => {
    if (!authReady || !isReady) {
      return;
    }

    if (!isAuthenticated) {
      hasMergedRef.current = false;
      hasRemoteCartRef.current = false;
      setCanSync(false);
      return;
    }

    if (hasMergedRef.current) {
      return;
    }

    hasMergedRef.current = true;
    mergeGuestCart();
  }, [authReady, isAuthenticated, isReady, mergeGuestCart]);

  const syncCart = useCallback(
    async (nextItems = itemsRef.current) => {
      if (!isAuthenticated) {
        return null;
      }

      setIsSyncing(true);
      setError("");

      try {
        return await persistCart(nextItems);
      } catch (requestError) {
        setError(requestError.message);
        return null;
      } finally {
        setIsSyncing(false);
      }
    },
    [isAuthenticated, persistCart]
  );

  // Quantity steppers fire rapidly; coalesce them into one write.
  useEffect(() => {
    if (!isReady || !isAuthenticated || !canSync) {
      return undefined;
    }

    syncTimerRef.current = setTimeout(() => {
      syncCart(items);
    }, SYNC_DEBOUNCE_MS);

    return () => clearTimeout(syncTimerRef.current);
  }, [canSync, isAuthenticated, isReady, items, syncCart]);

  const addItem = useCallback((product, quantity = 1, selectedCatalogue) => {
    const nextItem = toCartItem(product, quantity, selectedCatalogue);

    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => getItemKey(item) === getItemKey(nextItem)
      );

      if (existingIndex === -1) {
        return [...currentItems, nextItem];
      }

      return currentItems.map((item, index) =>
        index === existingIndex
          ? {
              ...item,
              quantity: item.quantity + nextItem.quantity,
            }
          : item
      );
    });
  }, []);

  const removeItem = useCallback((itemToRemove) => {
    const itemKey =
      typeof itemToRemove === "string" ? itemToRemove : getItemKey(itemToRemove);

    setItems((currentItems) =>
      currentItems.filter((item) => getItemKey(item) !== itemKey)
    );
  }, []);

  const updateQuantity = useCallback((itemToUpdate, quantity) => {
    const itemKey =
      typeof itemToUpdate === "string" ? itemToUpdate : getItemKey(itemToUpdate);
    const nextQuantity = Math.max(1, Number(quantity || 1));

    setItems((currentItems) =>
      currentItems.map((item) =>
        getItemKey(item) === itemKey
          ? {
              ...item,
              quantity: nextQuantity,
            }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totals = useMemo(() => {
    const subTotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
    const shipping = items.length > 0 ? SHIPPING_FEE : 0;
    const vat = subTotal * VAT_RATE;

    return {
      itemCount: items.reduce(
        (sum, item) => sum + Number(item.quantity || 1),
        0
      ),
      shipping,
      subTotal,
      totalPrice: subTotal + shipping + vat,
      vat,
    };
  }, [items]);

  const value = useMemo(
    () => ({
      ...totals,
      addItem,
      clearCart,
      error,
      getItemKey,
      isReady,
      isSyncing,
      items,
      loadRemoteCart,
      removeItem,
      syncCart,
      updateQuantity,
    }),
    [
      addItem,
      clearCart,
      error,
      isReady,
      isSyncing,
      items,
      loadRemoteCart,
      removeItem,
      syncCart,
      totals,
      updateQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
