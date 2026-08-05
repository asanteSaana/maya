import { apiRequest, unwrapApiData } from "./api";
import { normalizeProduct, normalizeProducts } from "./normalizers";
import { normalizeOrders } from "./orders";

// Seller-side operations. Every one of these requires a partner account; the
// backend rejects customer tokens.

export const getPrivateProducts = async ({ signal } = {}) => {
  const payload = await apiRequest("/api/products/private", { signal });
  return normalizeProducts(unwrapApiData(payload));
};

export const createProduct = async (product) => {
  const payload = await apiRequest("/api/products/create", {
    method: "POST",
    body: product,
  });

  return normalizeProduct(unwrapApiData(payload) || {});
};

export const updateProduct = async (productId, product) => {
  const payload = await apiRequest(`/api/products/${productId}`, {
    method: "PUT",
    body: product,
  });

  return normalizeProduct(unwrapApiData(payload) || {});
};

export const getPartnerOrders = async ({ signal } = {}) => {
  const payload = await apiRequest("/api/partner/orders/", { signal });
  return normalizeOrders(unwrapApiData(payload));
};

export const updateOrderStatus = (orderId, status) =>
  apiRequest(`/api/orders/${orderId}`, {
    method: "PUT",
    body: { status },
  });

export const deleteOrder = (orderId) =>
  apiRequest(`/api/orders/${orderId}`, { method: "DELETE" });

export const createRole = (role) =>
  apiRequest("/api/partner/roles/create", {
    method: "POST",
    body: role,
  });
