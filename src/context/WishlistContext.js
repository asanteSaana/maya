import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { normalizeProduct } from "../services/normalizers";

// The backend has no wishlist endpoint, so this is device-local only. It
// deliberately mirrors the CartContext shape so the two are interchangeable if
// a server-side wishlist ever lands.
const WISHLIST_STORAGE_KEY = "maya.wishlist";

const WishlistContext = createContext(null);

const readStoredItems = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed?.items) ? parsed.items : [];
  } catch {
    return [];
  }
};

const storeItems = (items) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify({ items })
  );
};

const toWishlistItem = (product) => {
  const normalized = normalizeProduct(product);
  const catalogue = normalized.catalogue[0] || {};

  return {
    id: normalized.id,
    productId: normalized.id,
    catalogueId: catalogue.id || "",
    title: normalized.title,
    image: normalized.image,
    price: Number(catalogue.price || normalized.price || 0),
    size: catalogue.size || normalized.size || "",
    stock: Number(catalogue.stock || normalized.stock || 0),
  };
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      storeItems(items);
    }
  }, [isReady, items]);

  const addItem = useCallback((product) => {
    const nextItem = toWishlistItem(product);

    setItems((currentItems) =>
      currentItems.some((item) => item.productId === nextItem.productId)
        ? currentItems
        : [...currentItems, nextItem]
    );
  }, []);

  const removeItem = useCallback((productId) => {
    const id = typeof productId === "string" ? productId : productId?.productId;
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== id)
    );
  }, []);

  const has = useCallback(
    (productId) => items.some((item) => item.productId === productId),
    [items]
  );

  const toggleItem = useCallback(
    (product) => {
      const normalized = normalizeProduct(product);
      if (items.some((item) => item.productId === normalized.id)) {
        removeItem(normalized.id);
        return false;
      }

      addItem(product);
      return true;
    },
    [addItem, items, removeItem]
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      addItem,
      clearWishlist,
      has,
      isReady,
      items,
      itemCount: items.length,
      removeItem,
      toggleItem,
    }),
    [addItem, clearWishlist, has, isReady, items, removeItem, toggleItem]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
};
