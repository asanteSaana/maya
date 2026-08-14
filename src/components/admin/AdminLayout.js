import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageBanner from "../PageBanner";
import { LoadingState } from "../shop/StateMessage";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../layout/Layout";

const NAV = [
  { href: "/admin", label: "Overview", icon: "flaticon-dashboard" },
  { href: "/admin/orders", label: "All Orders", icon: "flaticon-shopping-bag" },
  { href: "/admin/products", label: "Products", icon: "flaticon-leaf-1" },
  { href: "/admin/roles", label: "Roles", icon: "flaticon-user" },
];

/**
 * Shell for the administrator area.
 *
 * Middleware already turns away signed-out visitors on a cookie check, which is
 * all it can do at the edge. The role lives in the profile, so the "signed in
 * but not staff" case has to be handled here.
 */
const AdminLayout = ({ pageName, children }) => {
  const router = useRouter();
  const { isAdmin, isAuthenticated, isReady, user } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
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

  if (!isAdmin) {
    return (
      <Layout title={pageName}>
        <PageBanner pageName={pageName} />
        <div className="container py-130 rpy-100 text-center">
          <h4>Administrator access required</h4>
          <p>
            This area is limited to staff accounts. You are signed in as{" "}
            <strong>{user?.email}</strong>
            {user?.roleName ? ` (${user.roleName})` : ""}.
          </p>
          <Link href="/account">
            <a className="theme-btn style-two">
              Back to your account{" "}
              <i className="fas fa-angle-double-right" />
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
                  Administration
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
                    <Link href="/farmer/dashboard">Seller view</Link>
                  </li>
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

export default AdminLayout;
