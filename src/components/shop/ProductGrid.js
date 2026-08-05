import ProductCard from "./ProductCard";
import { EmptyState, ErrorState, LoadingState, SignInPrompt } from "./StateMessage";

/**
 * Renders whichever of the four product-list states applies. `requiresAuth` is
 * set when the backend answered 401 — the shop is then gated rather than broken.
 */
const ProductGrid = ({
  products = [],
  isLoading,
  error,
  requiresAuth,
  onRetry,
  columnClass = "col-xl-3 col-lg-4 col-sm-6",
  rowClass = "row show-grid-row",
  emptyTitle,
  emptyMessage,
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (requiresAuth) {
    return <SignInPrompt message="Sign in to browse products from our farmers." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!products.length) {
    return (
      <EmptyState
        title={emptyTitle || "No products found"}
        message={emptyMessage || "Try adjusting your filters or search terms."}
      />
    );
  }

  return (
    <div className={rowClass}>
      {products.map((product, index) => (
        <div className={columnClass} key={product.id}>
          <ProductCard product={product} index={index} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
