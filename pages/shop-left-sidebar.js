import ShopWithSidebar from "../src/components/shop/ShopWithSidebar";
import { loadProducts, serializable } from "../src/services/serverProducts";

const ShopLeftSidebar = (props) => (
  <ShopWithSidebar
    pageName="Shop Left Sidebar"
    sidebarPosition="left"
    {...props}
  />
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

export default ShopLeftSidebar;
