import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import FarmerLayout from "../../../src/components/farmer/FarmerLayout";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../src/components/shop/StateMessage";
import { formatPrice } from "../../../src/services/constants";
import { getPrivateProducts } from "../../../src/services/partner";

const FarmerProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setProducts(await getPrivateProducts());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <FarmerLayout pageName="My Listings">
      {isLoading && <LoadingState message="Loading your listings…" />}

      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && products.length === 0 && (
        <EmptyState
          title="No listings yet"
          message="Add your first product and it will show up in the marketplace."
          action={
            <Link href="/farmer/products/new">
              <a className="theme-btn style-two">
                Add a listing <i className="fas fa-angle-double-right" />
              </a>
            </Link>
          }
        />
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          <div className="text-right mb-25">
            <Link href="/farmer/products/new">
              <a className="theme-btn style-two">
                Add a listing <i className="fas fa-angle-double-right" />
              </a>
            </Link>
          </div>
          <div className="cart-item-wrap wow fadeInUp delay-0-2s">
            {products.map((product) => {
              // A listing with no catalogue carries no stock figure at all, so
              // it reads as "not tracked" rather than as zero.
              const tracked = product.catalogue.filter(
                (entry) => entry.stock !== null
              );
              const totalStock = tracked.length
                ? tracked.reduce((sum, entry) => sum + Number(entry.stock), 0)
                : null;

              return (
                <div className="cart-single-item" key={product.id}>
                  <div className="cart-img">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <h5 className="product-name">
                    <Link href={`/product/${product.id}`}>{product.title}</Link>
                    <small className="d-block">
                      {product.catalogue.length} size
                      {product.catalogue.length === 1 ? "" : "s"}
                    </small>
                  </h5>
                  <span className="product-price">
                    {formatPrice(
                      product.catalogue[0]?.price ?? product.price ?? 0
                    )}
                  </span>
                  <strong
                    className={`stock ${
                      totalStock === 0 ? "text-danger" : "text-success"
                    }`}
                  >
                    {totalStock === null
                      ? "Stock not tracked"
                      : totalStock === 0
                      ? "Out of stock"
                      : `${totalStock} in stock`}
                  </strong>
                  <Link href={`/farmer/products/${product.id}/edit`}>
                    <a className="theme-btn style-two">Edit</a>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </FarmerLayout>
  );
};

export default FarmerProducts;
