/**
 * Page chrome for admin screens: icon, title, supporting line and optional
 * actions. Mirrors the PageWrapper convention from the GhanaCard console so
 * every admin page opens the same way, rebuilt on the storefront's Bootstrap
 * classes rather than Tailwind.
 */
const PageHeader = ({ title, subtitle, icon = "flaticon-leaf-1", actions }) => (
  <div className="d-flex align-items-center justify-content-between flex-wrap mb-25">
    <div className="d-flex align-items-center">
      <span className="admin-page-icon mr-15">
        <i className={icon} />
      </span>
      <div>
        <h4 className="mb-0">{title}</h4>
        {subtitle && <p className="mb-0">{subtitle}</p>}
      </div>
    </div>
    {actions && <div className="mt-10 mt-sm-0">{actions}</div>}
  </div>
);

export default PageHeader;
