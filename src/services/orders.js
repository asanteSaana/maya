import { apiRequest, unwrapApiData } from "./api";

/**
 * `products.size` is a validated enum on the backend and it is case-sensitive:
 * posting "l" fails with "`l` is not a valid enum value". Product records do
 * contain lowercase sizes, so normalising the case here is what keeps those
 * items orderable at all.
 */
export const toOrderSize = (value) => String(value || "").trim().toUpperCase();

export const toOrderProduct = (item) => ({
  productId: item.productId || item.id,
  size: toOrderSize(item.size || item.catalogue?.size),
  amount: Number(item.price || item.amount || 0) * Number(item.quantity || 1),
  quantity: Number(item.quantity || 1),
  productName: item.title || item.productName || "",
  productImageUrl: item.image || item.productImageUrl || "",
});

/**
 * The backend stores an order's `products` as a single embedded object rather
 * than an array, so a bare object has to be read as a one-line order. Arrays
 * are still accepted in case the schema is ever widened.
 */
const toOrderLines = (products) => {
  if (Array.isArray(products)) {
    return products;
  }

  return products && typeof products === "object" ? [products] : [];
};

export const normalizeOrder = (order = {}) => {
  const products = toOrderLines(order.products);

  return {
    id: order._id || order.id || "",
    status: order.status || "pending",
    address: order.address || null,
    createdAt: order.createdAt || order.created_at || "",
    products: products.map((product) => ({
      productId: product.productId || "",
      productName: product.productName || "",
      productImageUrl: product.productImageUrl || "",
      size: product.size || "",
      quantity: Number(product.quantity || 1),
      amount: Number(product.amount || 0),
    })),
    // The backend stores the per-line amount; the order total is the sum.
    amount: Number(
      order.amount ||
        products.reduce((sum, product) => sum + Number(product.amount || 0), 0)
    ),
    raw: order,
  };
};

export const normalizeOrders = (payload) => {
  const orders = Array.isArray(payload) ? payload : payload?.data || [];
  return Array.isArray(orders) ? orders.map(normalizeOrder) : [];
};

/**
 * Places an order.
 *
 * The backend turns each line into its own order document and answers with an
 * array of them, so a three-item basket becomes three orders. It also creates
 * them one at a time without a transaction: if a later line fails validation,
 * the earlier ones stay committed and the whole call still returns 500. The
 * thrown error therefore carries `partial: true` so checkout can warn that
 * some items may have gone through rather than claiming nothing happened.
 */
export const createOrder = async ({ items, address }) => {
  const products = items.map(toOrderProduct);

  try {
    const payload = await apiRequest("/api/orders/create", {
      method: "POST",
      body: { products, address },
    });

    const created = unwrapApiData(payload);
    const rows = Array.isArray(created) ? created : [created];

    return rows.filter(Boolean).map(normalizeOrder);
  } catch (error) {
    if (products.length > 1) {
      error.partial = true;
    }

    throw error;
  }
};

export const getOrders = async ({ signal } = {}) => {
  const payload = await apiRequest("/api/orders", { signal });
  return normalizeOrders(unwrapApiData(payload));
};

/**
 * The backend exposes no single-order endpoint, so the detail view picks its
 * order out of the customer's list.
 */
export const getOrder = async (orderId, { signal } = {}) => {
  const orders = await getOrders({ signal });
  return orders.find((order) => order.id === orderId) || null;
};
