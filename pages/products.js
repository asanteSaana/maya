import ShopWithSidebar from "../src/components/shop/ShopWithSidebar";
import { loadProducts, serializable } from "../src/services/serverProducts";

// The single marketplace listing page. The template's three shop layouts
// (grid / left-sidebar / right-sidebar) collapsed into this one; the old routes
// redirect here from next.config.js.
const Products = (props) => (
  <ShopWithSidebar pageName="Products" sidebarPosition="left" {...props} />
);

export const getServerSideProps = async ({ req }) => {
  const { products, error, requiresAuth } = await loadProducts(req);

  return {
    props: {
      initialProducts: serializable(products),
      initialError: error,
      initialRequiresAuth: requiresAuth,
    },
  };
};

export default Products;
