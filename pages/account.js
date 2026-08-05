import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FormAlert from "../src/components/FormAlert";
import PageBanner from "../src/components/PageBanner";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/layout/Layout";
import { updateUser } from "../src/services/users";

const Account = () => {
  const router = useRouter();
  const { isAuthenticated, isPartner, isReady, logout, user } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isAuthenticated, isReady, router]);

  useEffect(() => {
    if (user) {
      setForm((current) => ({ ...current, username: user.username || "" }));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await updateUser({
        username: form.username,
        // Only send a password when the user actually typed a new one.
        ...(form.password ? { password: form.password } : {}),
      });
      setForm((current) => ({ ...current, password: "" }));
      setSuccess("Your details have been updated.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!isReady || !user) {
    return (
      <Layout>
        <PageBanner pageName={"My Account"} />
        <div className="py-130 rpy-100 text-center">
          <i className="fas fa-spinner fa-spin fa-2x" aria-hidden="true" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageBanner pageName={"My Account"} />
      <div className="account-area py-130 rpy-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="widget widget-menu wow fadeInUp delay-0-2s">
                <h4 className="widget-title">
                  <i className="flaticon-leaf-1" />
                  {user.username || "My Account"}
                </h4>
                <p className="mb-15">{user.email}</p>
                <ul>
                  <li>
                    <Link href="/orders">My Orders</Link>
                  </li>
                  <li>
                    <Link href="/wishlist">Wishlist</Link>
                  </li>
                  <li>
                    <Link href="/cart">Cart</Link>
                  </li>
                  {isPartner && (
                    <li>
                      <Link href="/farmer/dashboard">Farmer Dashboard</Link>
                    </li>
                  )}
                </ul>
                <button
                  type="button"
                  className="theme-btn style-two mt-20"
                  onClick={handleLogout}
                >
                  Sign Out <i className="fas fa-angle-double-right" />
                </button>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="contact-page-form wow fadeInUp delay-0-4s">
                <h4 className="mb-25">Account details</h4>
                {router.query.notice === "farmer-pending" && !isPartner && (
                  <div className="alert alert-warning mb-20" role="status">
                    <strong>Your account was created as a customer.</strong> You
                    can shop straight away, but selling has to be enabled by
                    Maya before your farmer dashboard opens. Quote your account
                    id <code>{user.id}</code> when you get in touch.
                  </div>
                )}
                <FormAlert error={error} success={success} />
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email-display">Email Address</label>
                    <input
                      type="email"
                      id="email-display"
                      className="form-control"
                      value={user.email || ""}
                      disabled
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Leave blank to keep your current password"
                      value={form.password}
                      onChange={handleChange}
                      minLength={6}
                    />
                  </div>
                  <div className="form-group mb-0">
                    <button
                      type="submit"
                      className="theme-btn style-two"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving…" : "Save Changes"}
                      <i className="fas fa-angle-double-right" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
