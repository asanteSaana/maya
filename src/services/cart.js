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
  const payload = await apiRequest("/api/carts");
  return unwrapApiData(payload);
};

export const createCart = (items) =>
  apiRequest("/api/carts/create", {
    method: "POST",
    body: toCartPayload(items),
  });

export const deleteCart = () => apiRequest("/api/carts", { method: "DELETE" });

/**
 * Replaces the saved cart.
 *
 * The documented `PUT /api/carts` is not implemented — every variant answers
 * "Cannot PUT /api/carts" — and a second `POST /api/carts/create` is rejected
 * by a unique index on userId. Delete-then-create is the only path the backend
 * actually supports.
 */
export const replaceCart = async (items) => {
  try {
    await deleteCart();
  } catch (error) {
    // No cart to remove yet is the expected state on a first save.
    if (error.status !== 404 && error.status !== 400) {
      throw error;
    }
  }

  return createCart(items);
};
