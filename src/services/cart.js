import { apiRequest, unwrapApiData } from "./api";

export const toCartPayload = (items = []) => ({
  products: items
    .map((item) => ({
      productId: item.productId || item.id,
      catalogueId: item.catalogueId || item.catalogue?.id || item.catalogue?._id,
      quantity: Number(item.quantity || 1),
    }))
    .filter((item) => item.productId && item.catalogueId),
});

export const getCart = async () => {
  const payload = await apiRequest("/api/carts/");
  return unwrapApiData(payload);
};

export const createCart = (items) =>
  apiRequest("/api/carts/create", {
    method: "POST",
    body: toCartPayload(items),
  });

export const updateCart = (items) =>
  apiRequest("/api/carts/", {
    method: "PUT",
    body: toCartPayload(items),
  });

export const deleteCart = () => apiRequest("/api/carts/", { method: "DELETE" });
