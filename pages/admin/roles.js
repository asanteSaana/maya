import { useState } from "react";
import AdminLayout from "../../src/components/admin/AdminLayout";
import FormAlert from "../../src/components/FormAlert";
import { createRoleAndReadId } from "../../src/services/admin";
import { CUSTOMER_ROLE_ID, ROLE_IDS } from "../../src/services/constants";

const AdminRoles = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [created, setCreated] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const role = await createRoleAndReadId(form);
      setCreated((current) => [role, ...current]);
      setForm({ name: "", description: "" });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      pageName="Roles"
      subtitle="Create the roles accounts can be assigned"
      icon="fas fa-user-shield"
    >

      <div className="alert alert-warning" role="note">
        <strong>Seller signup is blocked on a missing role id.</strong> Creating
        an account always returns the <em>Customer</em> role, whatever role id is
        sent, so nobody can register as a farmer. Creating a seller role here
        returns its id — set that id as <code>NEXT_PUBLIC_MAYA_ROLE_FARMER</code>{" "}
        in Vercel and the &ldquo;Sell my produce&rdquo; option starts working
        without a code change.
      </div>

      <div className="dash-card">
        <h4 className="dash-card-title">
          <i className="flaticon-leaf-1" />
          Known role ids
        </h4>
        <ul>
          <li>
            Customer <code>{CUSTOMER_ROLE_ID}</code>{" "}
            <small>(confirmed from a live signup)</small>
          </li>
          <li>
            Farmer{" "}
            {ROLE_IDS.farmer ? (
              <code>{ROLE_IDS.farmer}</code>
            ) : (
              <em>not configured</em>
            )}
          </li>
        </ul>
        <p className="mb-0">
          <small>
            The backend exposes no endpoint that lists roles, so this list
            cannot be loaded — it only reflects what has been discovered.
          </small>
        </p>
      </div>

      <div className="dash-card">
        <h4 className="mb-20">Create a role</h4>
        <FormAlert error={error} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Role name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Farmer"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-control"
              placeholder="Sells produce on the marketplace"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-0">
            <button
              type="submit"
              className="theme-btn style-two"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating…" : "Create role"}
              <i className="fas fa-angle-double-right" />
            </button>
          </div>
        </form>
      </div>

      {created.length > 0 && (
        <div className="dash-card">
          <h4 className="dash-card-title">
            <i className="flaticon-leaf-1" />
            Created this session
          </h4>
          <p>
            Copy the id you need now — nothing can list these again once you
            leave the page.
          </p>
          <ul>
            {created.map((role) => (
              <li key={role.id || role.name}>
                <strong>{role.name}</strong>{" "}
                {role.id ? (
                  <code>{role.id}</code>
                ) : (
                  <em>(the backend returned no id)</em>
                )}
                {role.description ? ` — ${role.description}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminRoles;
