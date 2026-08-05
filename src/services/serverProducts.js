// Server-only helpers for getServerSideProps. These call the backend directly
// rather than looping back through the proxy.
import { normalizeProduct, normalizeProducts } from "./normalizers";
import { backendRequest, getTokenFromRequest } from "./serverApi";

const unwrap = (data) =>
  data && typeof data === "object" && "data" in data ? data.data : data;

/**
 * Never throws. A cold backend must degrade into an empty page the client can
 * retry, not a 500.
 */
export const loadProducts = async (req) => {
  const { status, data } = await backendRequest("api/products/", {
    token: getTokenFromRequest(req),
  });

  if (status === 401 || status === 403) {
    return { products: [], error: "", requiresAuth: true };
  }

  if (status < 200 || status >= 300) {
    return {
      products: [],
      error:
        (data && typeof data === "object" && data.message) ||
        "Could not load products.",
      requiresAuth: false,
    };
  }

  return {
    products: normalizeProducts(unwrap(data)),
    error: "",
    requiresAuth: false,
  };
};

export const loadProduct = async (req, productId) => {
  const { status, data } = await backendRequest(`api/products/${productId}`, {
    token: getTokenFromRequest(req),
  });

  if (status === 401 || status === 403) {
    return { product: null, error: "", requiresAuth: true };
  }

  if (status === 404) {
    return { product: null, error: "", requiresAuth: false, notFound: true };
  }

  if (status < 200 || status >= 300) {
    return {
      product: null,
      error:
        (data && typeof data === "object" && data.message) ||
        "Could not load this product.",
      requiresAuth: false,
    };
  }

  const payload = unwrap(data);

  if (!payload) {
    return { product: null, error: "", requiresAuth: false, notFound: true };
  }

  return {
    product: normalizeProduct(payload),
    error: "",
    requiresAuth: false,
  };
};

/**
 * getServerSideProps cannot serialise undefined; normalized products carry a
 * `raw` object straight off the backend, so the whole tree is round-tripped
 * through JSON to drop any undefined values.
 */
export const serializable = (value) => JSON.parse(JSON.stringify(value ?? null));
