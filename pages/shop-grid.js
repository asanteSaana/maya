import PageBanner from "../src/components/PageBanner";
import ProductGrid from "../src/components/shop/ProductGrid";
import ShopPagination from "../src/components/shop/ShopPagination";
import useProductCatalog, {
  SORT_OPTIONS,
} from "../src/hooks/useProductCatalog";
import useProducts from "../src/hooks/useProducts";
import Layout from "../src/layout/Layout";
import { loadProducts, serializable } from "../src/services/serverProducts";

const ShopGrid = ({ initialProducts, initialError, initialRequiresAuth }) => {
  const { products, isLoading, error, requiresAuth, refresh } = useProducts({
    initialProducts,
    initialError,
    initialRequiresAuth,
  });
  const catalog = useProductCatalog(products, { pageSize: 8 });

  return (
    <Layout>
      <PageBanner pageName={"Shop Grid"} />
      <section className="shop-page rel z-1 pt-120 rpt-90 pb-130 rpb-100">
        <div className="container">
          <div className="shop-shorter rel z-3 pt-10 mb-40 wow fadeInUp delay-0-2s">
            <div className="products-dropdown">
              <select
                value={catalog.sort}
                onChange={(event) => catalog.setSort(event.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="mb-0">
              {catalog.total} product{catalog.total === 1 ? "" : "s"}
            </p>
          </div>
          <ProductGrid
            products={catalog.paged}
            isLoading={isLoading}
            error={error}
            requiresAuth={requiresAuth}
            onRetry={refresh}
          />
          <ShopPagination
            page={catalog.page}
            pageCount={catalog.pageCount}
            onChange={catalog.setPage}
          />
        </div>
      </section>
    </Layout>
  );
};

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

export default ShopGrid;
