const FALLBACK_PRODUCT_IMAGE = "/assets/images/products/product1.png";

export const getProductId = (product) =>
  product?._id || product?.id || product?.productId || "";

/**
 * Stock is tri-state. Most products in the live catalogue carry no catalogue
 * entry and no `stock` field at all, so coercing absent to 0 would mark them
 * sold out and block every purchase. `null` means "not tracked"; only an
 * explicit number is a real count.
 */
export const toStock = (value) =>
  value === undefined || value === null || value === "" ? null : Number(value);

/** Sold out only when the backend actually says zero. */
export const isSoldOut = (stock) => stock !== null && Number(stock) <= 0;

export const isPurchasable = (stock) => !isSoldOut(stock);

/** Categories arrive with inconsistent casing ("Breakfast" vs "BreaKfast"). */
export const categoryKey = (value) => String(value || "").trim().toLowerCase();

export const normalizeCatalogue = (catalogue = []) => {
  if (!Array.isArray(catalogue)) {
    return [];
  }

  return catalogue.map((item) => ({
    id: item._id || item.id || "",
    size: item.size || "",
    price: Number(item.price || 0),
    stock: toStock(item.stock),
    raw: item,
  }));
};

export const normalizeProduct = (product = {}) => {
  const catalogue = normalizeCatalogue(product.catalogue);
  const primaryCatalogue = catalogue[0];
  const price = Number(product.price || primaryCatalogue?.price || 0);

  return {
    id: getProductId(product),
    title:
      product.title ||
      product.name ||
      product.productName ||
      "Untitled product",
    description: product.desc || product.description || "",
    image:
      product.img ||
      product.image ||
      product.productImageUrl ||
      FALLBACK_PRODUCT_IMAGE,
    categories: (product.categories || product.category || []).filter(Boolean),
    catalogue,
    price,
    size: product.size || primaryCatalogue?.size || "",
    color: product.color || "",
    stock: toStock(product.stock ?? primaryCatalogue?.stock),
    raw: product,
  };
};

export const normalizeProducts = (payload) => {
  const products = Array.isArray(payload) ? payload : payload?.data || [];

  if (!Array.isArray(products)) {
    return [];
  }

  return products.map(normalizeProduct);
};
