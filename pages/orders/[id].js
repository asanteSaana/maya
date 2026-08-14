import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import PageBanner from "../../src/components/PageBanner";
import OrderStatusBadge from "../../src/components/shop/OrderStatusBadge";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../src/components/shop/StateMessage";
import Layout from "../../src/layout/Layout";
import { formatPrice } from "../../src/services/constants";
import { getOrder } from "../../src/services/orders";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString() : "—";

const OrderDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      setOrder(await getOrder(id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const address = order?.address || {};
  const addressLines = [
    address.recipient,
    address.street,
    address.apartment,
    [address.city, address.state].filter(Boolean).join(", "),
    [address.zip, address.country].filter(Boolean).join(" "),
    address.phone,
  ].filter(Boolean);

  return (
    <Layout title="Order details">
      <PageBanner pageName={"Order Details"} compact />
      <div className="cart-area py-130 rpy-100">
        <div className="container">
          {isLoading && <LoadingState message="Loading your order…" />}

          {!isLoading && error && <ErrorState message={error} onRetry={load} />}

          {!isLoading && !error && !order && (
            <EmptyState
              title="Order not found"
              message="We could not find that order on your account."
              action={
                <Link href="/orders">
                  <a className="theme-btn style-two">
                    Back to orders <i className="fas fa-angle-double-right" />
                  </a>
                </Link>
              }
            />
          )}

          {!isLoading && !error && order && (
            <div className="row">
              <div className="col-lg-8">
                <div className="cart-item-wrap wow fadeInUp delay-0-2s">
                  {order.products.map((product, index) => (
                    <div
                      className="cart-single-item"
                      key={`${product.productId}:${product.size}:${index}`}
                    >
                      <div className="cart-img">
                        <img
                          src={
                            product.productImageUrl ||
                            "/assets/images/products/product1.png"
                          }
                          alt={product.productName}
                        />
                      </div>
                      <h5 className="product-name">
                        <Link href={`/product/${product.productId}`}>
                          {product.productName}
                        </Link>
                        {product.size && (
                          <small className="d-block">{product.size}</small>
                        )}
                      </h5>
                      <span className="product-price">
                        × {product.quantity}
                      </span>
                      <span className="product-total-price">
                        {formatPrice(product.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="shoping-cart-total mt-0 wow fadeInUp delay-0-4s">
                  <h4 className="form-title mb-25">
                    Order #{order.id.slice(-8)}
                  </h4>
                  <table>
                    <tbody>
                      <tr>
                        <td>Status</td>
                        <td>
                          <OrderStatusBadge status={order.status} />
                        </td>
                      </tr>
                      <tr>
                        <td>Placed</td>
                        <td>{formatDate(order.createdAt)}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total</strong>
                        </td>
                        <td>
                          <strong className="total-price">
                            {formatPrice(order.amount)}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {addressLines.length > 0 && (
                    <div className="pt-25">
                      <h6>Delivery address</h6>
                      <p className="mb-0">
                        {addressLines.map((line) => (
                          <span className="d-block" key={line}>
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  )}

                  <Link href="/orders">
                    <a className="theme-btn style-two mt-25 w-100">
                      Back to orders
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
