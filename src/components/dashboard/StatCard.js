import Link from "next/link";

/**
 * A single figure with its label. Every number on these dashboards is derived
 * in the browser from data already fetched, because the API exposes no
 * statistics endpoint.
 */
const StatCard = ({ label, value, hint, icon = "fas fa-leaf", href }) => {
  const body = (
    <>
      <span className="dash-stat-icon">
        <i className={icon} aria-hidden="true" />
      </span>
      <span className="dash-stat-body">
        <strong>{value}</strong>
        <span className="dash-stat-label">{label}</span>
        {hint && <small>{hint}</small>}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <a className="dash-stat is-link">{body}</a>
      </Link>
    );
  }

  return <div className="dash-stat">{body}</div>;
};

export const StatGrid = ({ children }) => (
  <div className="dash-stats">{children}</div>
);

export default StatCard;
