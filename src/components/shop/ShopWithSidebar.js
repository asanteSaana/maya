import { Fragment } from "react";
import useProductCatalog, { SORT_OPTIONS } from "../../hooks/useProductCatalog";
import useProducts from "../../hooks/useProducts";
import PageBanner from "../PageBanner";
import Layout from "../../layout/Layout";
import ProductGrid from "./ProductGrid";
import ShopPagination from "./ShopPagination";
import ShopSidebar from "./ShopSidebar";

/**
 * Shared body for the left- and right-sidebar shop pages. The two differ only
 * in which column renders first, so `sidebarPosition` flips the order.
 */
const ShopWithSidebar = ({
  pageName,
  sidebarPosition = "left",
  initialProducts,
  initialError,
  initialRequiresAuth,
}) => {
  const { products, isLoading, error, requiresAuth, refresh } = useProducts({
    initialProducts,
    initialError,
    initialRequiresAuth,
  });
  const catalog = useProductCatalog(products, { pageSize: 6 });

  const sidebar = (
    <div className="col-xl-3 col-lg-4 col-md-8">
      <ShopSidebar catalog={catalog} products={products} />
    </div>
  );

  const content = (
    <div className="col-xl-9 col-lg-8 mt-55">
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
        columnClass="col-xl-4 col-md-6 col-sm-10"
        emptyMessage="Nothing matches those filters yet."
      />
      <ShopPagination
        page={catalog.page}
        pageCount={catalog.pageCount}
        onChange={catalog.setPage}
      />
    </div>
  );

  return (
    <Layout
      title={pageName}
      description="Browse fresh produce listed by local farmers, filter by category and price, and order direct."
    >
      <PageBanner pageName={pageName} compact />
      <section className="shop-page rel z-1 pt-65 rpt-35 pb-130 rpb-100">
        <div className="container">
          <div className="row">
            {sidebarPosition === "left" ? (
              <Fragment>
                {sidebar}
                {content}
              </Fragment>
            ) : (
              <Fragment>
                {content}
                {sidebar}
              </Fragment>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ShopWithSidebar;
