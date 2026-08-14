import { useCallback, useEffect, useState } from "react";
import FarmerLayout from "../../src/components/farmer/FarmerLayout";
import OrderStatusBadge from "../../src/components/shop/OrderStatusBadge";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../src/components/shop/StateMessage";
import { formatPrice } from "../../src/services/constants";
import {
  deleteOrder,
  getPartnerOrders,
  updateOrderStatus,
} from "../../src/services/partner";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  // Tracks which order is mid-request so only that row's buttons disable.
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setOrders(await getPartnerOrders());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatus = async (orderId, status) => {
    setActionError("");
    setBusyId(orderId);

    try {
      await updateOrderStatus(orderId, status);
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (orderId) => {
    setActionError("");
    setBusyId(orderId);

    try {
      await deleteOrder(orderId);
      setOrders((current) => current.filter((order) => order.id !== orderId));
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <FarmerLayout pageName="Incoming Orders">
      {isLoading && <LoadingState message="Loading incoming orders…" />}

      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && orders.length === 0 && (
        <EmptyState
          title="No orders yet"
          message="When a customer buys your produce, the order lands here."
        />
      )}

      {!isLoading && !error && orders.length > 0 && (
        <>
          {actionError && (
            <div className="alert alert-danger" role="alert">
              {actionError}
            </div>
          )}

          <div className="cart-item-wrap wow fadeInUp delay-0-2s">
            {orders.map((order) => (
              <div className="cart-single-item d-block" key={order.id}>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <h5 className="product-name mb-0">
                    Order #{order.id.slice(-8)}
                    <small className="d-block">
                      {formatDate(order.createdAt)}
                      {order.address?.city ? ` · ${order.address.city}` : ""}
                    </small>
                  </h5>
                  <span className="product-price">
                    {formatPrice(order.amount)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>

                <ul className="order-lines pt-15">
                  {order.products.map((product, index) => (
                    <li key={`${product.productId}:${product.size}:${index}`}>
                      <span className="line-name">
                        {product.productName}
                        {product.size ? ` (${product.size})` : ""}
                      </span>
                      <span className="line-meta">
                        × {product.quantity} — {formatPrice(product.amount)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Ranked by consequence: accepting is the expected action, so
                    it carries the weight; deleting is irreversible, so it is
                    set apart from the pair it must not be confused with. */}
                <div className="order-actions pt-10">
                  <button
                    type="button"
                    className="theme-btn"
                    disabled={busyId === order.id || order.status === "accepted"}
                    onClick={() => handleStatus(order.id, "accepted")}
                  >
                    {order.status === "accepted" ? "Accepted" : "Accept"}
                  </button>
                  <button
                    type="button"
                    className="btn-quiet"
                    disabled={busyId === order.id || order.status === "rejected"}
                    onClick={() => handleStatus(order.id, "rejected")}
                  >
                    {order.status === "rejected" ? "Rejected" : "Reject"}
                  </button>
                  <button
                    type="button"
                    className="btn-destructive"
                    disabled={busyId === order.id}
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </FarmerLayout>
  );
};

export default FarmerOrders;
