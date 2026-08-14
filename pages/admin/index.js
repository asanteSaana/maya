import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../src/components/admin/AdminLayout";
import PageHeader from "../../src/components/admin/PageHeader";
import StatCard from "../../src/components/admin/StatCard";
import OrderStatusBadge from "../../src/components/shop/OrderStatusBadge";
import {
  ErrorState,
  LoadingState,
} from "../../src/components/shop/StateMessage";
import { formatPrice } from "../../src/services/constants";
import { getAllOrders } from "../../src/services/admin";
import { getProducts } from "../../src/services/products";

const AdminOverview = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      // Two calls rather than four: the backend allows only 10 requests per
      // minute, and every figure below is derived from these.
      const [allOrders, allProducts] = await Promise.all([
        getAllOrders(),
        getProducts(),
      ]);
      setOrders(allOrders);
      setProducts(allProducts);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pending = orders.filter((order) => order.status === "pending");
  const accepted = orders.filter((order) => order.status === "accepted");
  const rejected = orders.filter((order) => order.status === "rejected");
  const revenue = accepted.reduce((sum, order) => sum + order.amount, 0);

  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 8);

  return (
    <AdminLayout pageName="Admin Overview">
      <PageHeader
        title="Overview"
        subtitle="Orders placed against your listings, across every customer"
        actions={
          <button
            type="button"
            className="theme-btn style-two"
            onClick={load}
            disabled={isLoading}
          >
            Refresh <i className="fas fa-sync-alt" />
          </button>
        }
      />

      {isLoading && <LoadingState message="Loading marketplace activity…" />}

      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && (
        <>
          <div className="row">
            <StatCard
              label="Orders received"
              value={orders.length}
              icon="flaticon-shopping-bag"
            />
            <StatCard
              label="Awaiting action"
              value={pending.length}
              hint="Pending farmer response"
              icon="flaticon-clock"
            />
            <StatCard
              label="Accepted revenue"
              value={formatPrice(revenue)}
              hint={`${accepted.length} accepted · ${rejected.length} rejected`}
              icon="flaticon-money"
            />
            <StatCard
              label="Live listings"
              value={products.length}
              icon="flaticon-leaf-1"
            />
          </div>

          <div className="widget mt-30 wow fadeInUp delay-0-4s">
            <h4 className="widget-title">
              <i className="flaticon-leaf-1" />
              Latest orders
            </h4>

            {recent.length === 0 ? (
              <p className="mb-0">No orders have been placed yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table admin-table">
                  <thead>
                    <tr>
                      <th scope="col">Order</th>
                      <th scope="col">Items</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((order) => (
                      <tr key={order.id}>
                        <td data-label="Order">#{order.id.slice(-8)}</td>
                        <td data-label="Items">
                          {order.products
                            .map((line) => line.productName)
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </td>
                        <td data-label="Total">{formatPrice(order.amount)}</td>
                        <td data-label="Status">
                          <OrderStatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="pt-15">
              <Link href="/admin/orders">
                <a className="theme-btn style-two">
                  View all orders <i className="fas fa-angle-double-right" />
                </a>
              </Link>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminOverview;
