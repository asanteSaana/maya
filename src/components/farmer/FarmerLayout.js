import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AccessNotice from "../dashboard/AccessNotice";
import DashboardShell from "../dashboard/DashboardShell";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  {
    label: "Overview",
    items: [
      {
        href: "/farmer/dashboard",
        label: "Dashboard",
        icon: "fas fa-chart-line",
        exact: true,
      },
    ],
  },
  {
    label: "Produce",
    items: [
      { href: "/farmer/products", label: "My listings", icon: "fas fa-carrot", exact: true },
      { href: "/farmer/products/new", label: "Add listing", icon: "fas fa-plus-circle" },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/farmer/orders", label: "Incoming orders", icon: "fas fa-receipt" },
    ],
  },
];

/**
 * Seller area. Middleware already blocks signed-out visitors; this handles the
 * accounts that are signed in but not sellers, which a cookie check cannot
 * distinguish.
 */
const FarmerLayout = ({ pageName, subtitle, icon, actions, children }) => {
  const router = useRouter();
  const { isAuthenticated, isPartner, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return <AccessNotice title="Farmer" loading />;
  }

  if (!isPartner) {
    return (
      <AccessNotice
        title="Farmer"
        heading="Farmer account required"
        message="This area is for accounts registered as farmers. If you signed up as a customer, selling has to be enabled on your account before the dashboard opens."
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
      area="Farmer"
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

export default FarmerLayout;
