import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageBanner from "../PageBanner";
import { LoadingState } from "../shop/StateMessage";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../layout/Layout";

const NAV = [
  { href: "/farmer/dashboard", label: "Dashboard" },
  { href: "/farmer/products", label: "My Listings" },
  { href: "/farmer/products/new", label: "Add Listing" },
  { href: "/farmer/orders", label: "Incoming Orders" },
];

/**
 * Shell for the seller area. Middleware already blocks signed-out visitors;
 * this additionally handles accounts that are signed in but not partners, which
 * the cookie check cannot tell apart.
 */
const FarmerLayout = ({ pageName, children }) => {
  const router = useRouter();
  const { isAuthenticated, isPartner, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(`/login?redirect=${router.pathname}`);
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return (
      <Layout title={pageName}>
        <PageBanner pageName={pageName} />
        <div className="container py-130 rpy-100">
          <LoadingState message="Checking your account…" />
        </div>
      </Layout>
    );
  }

  if (!isPartner) {
    return (
      <Layout title={pageName}>
        <PageBanner pageName={pageName} />
        <div className="container py-130 rpy-100 text-center">
          <h4>Farmer account required</h4>
          <p>
            This area is for accounts registered as farmers. If you signed up as
            a customer, register a farmer account to start selling.
          </p>
          <Link href="/register">
            <a className="theme-btn style-two">
              Register as a farmer <i className="fas fa-angle-double-right" />
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={pageName}>
      <PageBanner pageName={pageName} />
      <div className="account-area py-130 rpy-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="widget widget-menu wow fadeInUp delay-0-2s">
                <h4 className="widget-title">
                  <i className="flaticon-leaf-1" />
                  Farmer
                </h4>
                <ul>
                  {NAV.map((entry) => (
                    <li key={entry.href}>
                      <Link href={entry.href}>
                        <a
                          className={
                            router.pathname === entry.href ? "active" : ""
                          }
                        >
                          {entry.label}
                        </a>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/account">Account settings</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9">{children}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FarmerLayout;
