import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import DashboardShell from "../dashboard/DashboardShell";
import AccessNotice from "../dashboard/AccessNotice";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: "fas fa-chart-pie", exact: true },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { href: "/admin/orders", label: "All orders", icon: "fas fa-receipt" },
      { href: "/admin/products", label: "Products", icon: "fas fa-carrot" },
    ],
  },
  {
    label: "Access",
    items: [{ href: "/admin/roles", label: "Roles", icon: "fas fa-user-shield" }],
  },
  {
    label: "Selling",
    items: [
      { href: "/farmer/dashboard", label: "Seller view", icon: "fas fa-tractor" },
    ],
  },
];

/**
 * Administrator area.
 *
 * Middleware turns away signed-out visitors on a cookie check, which is all it
 * can do at the edge. The role lives in the profile, so the "signed in but not
 * staff" case is handled here.
 */
const AdminLayout = ({ pageName, subtitle, icon, actions, children }) => {
  const router = useRouter();
  const { isAdmin, isAuthenticated, isReady, user } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return <AccessNotice title="Administration" loading />;
  }

  if (!isAdmin) {
    return (
      <AccessNotice
        title="Administration"
        heading="Administrator access required"
        message={
          <>
            This area is limited to staff accounts. You are signed in as{" "}
            <strong>{user?.email}</strong>
            {user?.roleName ? ` (${user.roleName})` : ""}.
          </>
        }
        action={
          <Link href="/account">
            <a className="theme-btn style-two">
              Back to your account <i className="fas fa-angle-double-right" />
            </a>
          </Link>
        }
      />
    );
  }

  return (
    <DashboardShell
      area="Administration"
      title={pageName}
      subtitle={subtitle}
      icon={icon}
      actions={actions}
      nav={NAV}
    >
      {children}
    </DashboardShell>
  );
};

export default AdminLayout;
