/**
 * Single figure with a label. Kept deliberately dumb — every admin screen
 * derives its own numbers, because the backend exposes no statistics endpoint.
 */
const StatCard = ({ label, value, hint, icon = "flaticon-leaf-1" }) => (
  <div className="col-md-6 col-lg-3">
    <div className="widget admin-stat wow fadeInUp delay-0-2s">
      <span className="admin-stat-icon">
        <i className={icon} />
      </span>
      <h3 className="mb-0">{value}</h3>
      <p className="mb-0">{label}</p>
      {hint && <small>{hint}</small>}
    </div>
  </div>
);

export default StatCard;
