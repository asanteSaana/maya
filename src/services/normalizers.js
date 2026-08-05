const FALLBACK_PRODUCT_IMAGE = "assets/images/products/product1.png";

export const getProductId = (product) =>
  product?._id || product?.id || product?.productId || "";

export const normalizeCatalogue = (catalogue = []) => {
  if (!Array.isArray(catalogue)) {
    return [];
  }

  return catalogue.map((item) => ({
    id: item._id || item.id || "",
    size: item.size || "",
    price: Number(item.price || 0),
    stock: Number(item.stock || 0),
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
    categories: product.categories || product.category || [],
    catalogue,
    price,
    size: product.size || primaryCatalogue?.size || "",
    color: product.color || "",
    stock: Number(product.stock || primaryCatalogue?.stock || 0),
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
