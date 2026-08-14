import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import FarmerLayout from "../../src/components/farmer/FarmerLayout";
import {
  ErrorState,
  LoadingState,
} from "../../src/components/shop/StateMessage";
import { formatPrice } from "../../src/services/constants";
import { isSoldOut } from "../../src/services/normalizers";
import { getPartnerOrders, getPrivateProducts } from "../../src/services/partner";

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [listings, incoming] = await Promise.all([
        getPrivateProducts(),
        getPartnerOrders(),
      ]);
      setProducts(listings);
      setOrders(incoming);
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
  const revenue = accepted.reduce((sum, order) => sum + order.amount, 0);
  // Only listings that actually declare a zero count; untracked stock is not
  // "out of stock", and a listing with no catalogue has nothing to restock.
  const outOfStock = products.filter(
    (product) =>
      product.catalogue.length > 0 &&
      product.catalogue.every((entry) => isSoldOut(entry.stock))
  );

  const stats = [
    { label: "Active listings", value: products.length, href: "/farmer/products" },
    { label: "Pending orders", value: pending.length, href: "/farmer/orders" },
    { label: "Accepted orders", value: accepted.length, href: "/farmer/orders" },
    { label: "Accepted revenue", value: formatPrice(revenue) },
  ];

  return (
    <FarmerLayout pageName="Farmer Dashboard">
      {isLoading && <LoadingState message="Loading your dashboard…" />}

      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && (
        <>
          <div className="row">
            {stats.map((stat) => (
              <div className="col-md-6 col-lg-3" key={stat.label}>
                <div className="widget wow fadeInUp delay-0-2s text-center">
                  <h2 className="mb-5">{stat.value}</h2>
                  <p className="mb-0">
                    {stat.href ? (
                      <Link href={stat.href}>{stat.label}</Link>
                    ) : (
                      stat.label
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {outOfStock.length > 0 && (
            <div className="alert alert-warning mt-25" role="alert">
              {outOfStock.length} listing
              {outOfStock.length === 1 ? " is" : "s are"} out of stock.{" "}
              <Link href="/farmer/products">
                <a>Restock them</a>
              </Link>
              .
            </div>
          )}

          <div className="widget mt-30 wow fadeInUp delay-0-4s">
            <h4 className="widget-title">
              <i className="flaticon-leaf-1" />
              Latest orders
            </h4>
            {orders.length === 0 ? (
              <p className="mb-0">
                No orders yet. Once customers buy your produce they will appear
                here.
              </p>
            ) : (
              <ul>
                {orders.slice(0, 5).map((order) => (
                  <li key={order.id}>
                    <Link href="/farmer/orders">
                      <a>Order #{order.id.slice(-8)}</a>
                    </Link>{" "}
                    <span>
                      {formatPrice(order.amount)} · {order.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-25">
            <Link href="/farmer/products/new">
              <a className="theme-btn style-two">
                Add a new listing <i className="fas fa-angle-double-right" />
              </a>
            </Link>
          </div>
        </>
      )}
    </FarmerLayout>
  );
};

export default FarmerDashboard;
