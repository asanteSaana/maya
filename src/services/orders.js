import { apiRequest, unwrapApiData } from "./api";

export const toOrderProduct = (item) => ({
  productId: item.productId || item.id,
  size: item.size || item.catalogue?.size || "",
  amount: Number(item.price || item.amount || 0) * Number(item.quantity || 1),
  quantity: Number(item.quantity || 1),
  productName: item.title || item.productName || "",
  productImageUrl: item.image || item.productImageUrl || "",
});

export const normalizeOrder = (order = {}) => {
  const products = Array.isArray(order.products) ? order.products : [];

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

export const createOrder = async ({ items, address }) => {
  const payload = await apiRequest("/api/orders/create", {
    method: "POST",
    body: {
      products: items.map(toOrderProduct),
      address,
    },
  });

  return normalizeOrder(unwrapApiData(payload) || {});
};

export const getOrders = async ({ signal } = {}) => {
  const payload = await apiRequest("/api/orders/", { signal });
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
