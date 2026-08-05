import { apiRequest, unwrapApiData } from "./api";
import { normalizeProduct, normalizeProducts } from "./normalizers";

export const getProducts = async ({ signal } = {}) => {
  const payload = await apiRequest("/api/products/", { signal });
  return normalizeProducts(unwrapApiData(payload));
};

export const getProduct = async (productId, { signal } = {}) => {
  const payload = await apiRequest(`/api/products/${productId}`, { signal });
  return normalizeProduct(unwrapApiData(payload));
};
