import Link from "next/link";
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
import { getOrders } from "../../src/services/orders";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setOrders(await getOrders());
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
    <Layout>
      <PageBanner pageName={"My Orders"} />
      <div className="cart-area py-130 rpy-100">
        <div className="container">
          {isLoading && <LoadingState message="Loading your orders…" />}

          {!isLoading && error && <ErrorState message={error} onRetry={load} />}

          {!isLoading && !error && orders.length === 0 && (
            <EmptyState
              title="No orders yet"
              message="Once you place an order it will show up here."
              action={
                <Link href="/products">
                  <a className="theme-btn style-two">
                    Start shopping <i className="fas fa-angle-double-right" />
                  </a>
                </Link>
              }
            />
          )}

          {!isLoading && !error && orders.length > 0 && (
            <div className="cart-item-wrap wow fadeInUp delay-0-2s">
              {orders.map((order) => (
                <div className="cart-single-item" key={order.id}>
                  <div className="cart-img">
                    <img
                      src={
                        order.products[0]?.productImageUrl ||
                        "assets/images/products/product1.png"
                      }
                      alt={order.products[0]?.productName || "Order"}
                    />
                  </div>
                  <h5 className="product-name">
                    <Link href={`/orders/${order.id}`}>
                      Order #{order.id.slice(-8)}
                    </Link>
                    <small className="d-block">
                      {formatDate(order.createdAt)} ·{" "}
                      {order.products.length} item
                      {order.products.length === 1 ? "" : "s"}
                    </small>
                  </h5>
                  <span className="product-price">
                    {formatPrice(order.amount)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                  <Link href={`/orders/${order.id}`}>
                    <a className="theme-btn style-two">View</a>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
