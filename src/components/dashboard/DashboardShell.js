import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const COLLAPSE_KEY = "maya.dash.collapsed";

/**
 * Application shell for the privileged areas.
 *
 * The seller and administrator screens previously sat inside the storefront's
 * marketing chrome — top bar, mega menu, newsletter footer — with their
 * navigation as a widget in the page body. That is furniture for shoppers, not
 * for someone working through orders. This is a dedicated shell instead: a
 * fixed sidebar that collapses to an icon rail, a working top bar, and a
 * content area that owns the full height.
 *
 * `nav` is a list of groups so related destinations sit together, matching the
 * grouped navigation used by the reference console.
 */
const DashboardShell = ({
  area,
  title,
  subtitle,
  icon = "fas fa-leaf",
  actions,
  nav,
  children,
}) => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // Private browsing can deny storage; the default is fine.
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // Ignore — see above.
      }
      return next;
    });
  }, []);

  // A route change means the drawer has served its purpose.
  useEffect(() => {
    const close = () => {
      setMobileOpen(false);
      setUserMenuOpen(false);
    };
    router.events.on("routeChangeComplete", close);
    return () => router.events.off("routeChangeComplete", close);
  }, [router.events]);

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (href, exact) =>
    exact ? router.pathname === href : router.pathname.startsWith(href);

  return (
    <>
      <Head>
        <title>{`${title} | ${area} | Maya`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={`dash ${collapsed ? "is-collapsed" : ""}`}>
        {/* Backdrop only exists while the drawer is open on small screens. */}
        {mobileOpen && (
          <div
            className="dash-backdrop"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside className={`dash-sidebar ${mobileOpen ? "is-open" : ""}`}>
          <div className="dash-brand">
            <Link href="/">
              <a className="dash-brand-link" title="Back to the storefront">
                <span className="dash-brand-mark">
                  <i className="fas fa-seedling" />
                </span>
                <span className="dash-brand-text">
                  <strong>Maya</strong>
                  <small>{area}</small>
                </span>
              </a>
            </Link>
          </div>

          <nav className="dash-nav" aria-label={`${area} navigation`}>
            {nav.map((group) => (
              <div className="dash-nav-group" key={group.label}>
                <p className="dash-nav-label">{group.label}</p>
                <ul>
                  {group.items.map((item) => {
                    const active = isActive(item.href, item.exact);
                    return (
                      <li key={item.href}>
                        <Link href={item.href}>
                          <a
                            className={active ? "is-active" : ""}
                            aria-current={active ? "page" : undefined}
                            title={item.label}
                          >
                            <i className={item.icon} aria-hidden="true" />
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="dash-sidebar-foot">
            <Link href="/">
              <a title="Back to the storefront">
                <i className="fas fa-store" aria-hidden="true" />
                <span>Back to shop</span>
              </a>
            </Link>
          </div>
        </aside>

        <div className="dash-main">
          <header className="dash-topbar">
            <button
              type="button"
              className="dash-trigger"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <i className="fas fa-bars" />
            </button>
            <button
              type="button"
              className="dash-trigger dash-trigger-mobile"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <i className="fas fa-bars" />
            </button>

            <div className="dash-topbar-title">
              <span className="dash-crumb">{area}</span>
              <strong>{title}</strong>
            </div>

            <div className="dash-user">
              <button
                type="button"
                className="dash-user-btn"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
              >
                <span className="dash-avatar" aria-hidden="true">
                  {(user?.username || user?.email || "?").charAt(0).toUpperCase()}
                </span>
                <span className="dash-user-meta">
                  <strong>{user?.username || "Account"}</strong>
                  <small>{user?.roleName || ""}</small>
                </span>
                <i className="fas fa-chevron-down" aria-hidden="true" />
              </button>

              {userMenuOpen && (
                <div className="dash-user-menu" role="menu">
                  <span className="dash-user-email">{user?.email}</span>
                  <Link href="/account">
                    <a role="menuitem">Account settings</a>
                  </Link>
                  <Link href="/orders">
                    <a role="menuitem">My orders</a>
                  </Link>
                  <button type="button" role="menuitem" onClick={handleSignOut}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </header>

          <main className="dash-content">
            <div className="dash-page-head">
              <span className="dash-page-icon">
                <i className={icon} aria-hidden="true" />
              </span>
              <div>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
              </div>
              {actions && <div className="dash-page-actions">{actions}</div>}
            </div>

            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardShell;
