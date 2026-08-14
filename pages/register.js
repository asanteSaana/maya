import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FormAlert from "../src/components/FormAlert";
import PageBanner from "../src/components/PageBanner";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/layout/Layout";
import { ROLE_IDS } from "../src/services/constants";
import { safeRedirect } from "../src/services/navigation";

const Register = () => {
  const router = useRouter();
  const { isAuthenticated, isReady, register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "customer",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = safeRedirect(router.query.redirect, "/account");

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, isReady, redirect, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const user = await register({
        username: form.username,
        email: form.email,
        password: form.password,
        // Omitted when unknown so the backend applies its own default role.
        roleId: ROLE_IDS[form.accountType] || undefined,
      });

      if (form.accountType !== "farmer") {
        router.push(redirect);
        return;
      }

      if (user?.isPartner) {
        router.push("/farmer/dashboard");
        return;
      }

      // Self-registration currently always returns the Customer role, so say
      // so plainly instead of dropping the user on /account unexplained.
      router.push("/account?notice=farmer-pending");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Create account"
      description="Create a Maya account to buy fresh produce, or to start selling your own harvest."
    >
      <PageBanner pageName={"Create Account"} compact />
      <div className="contact-page-form-area py-130 rpy-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="contact-page-form wow fadeInUp delay-0-2s">
                <h3 className="mb-15">Join Maya</h3>
                <p className="mb-25">
                  Buy straight from local farmers, or sell your own harvest.
                </p>
                <FormAlert error={error} />
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      autoComplete="username"
                      placeholder="Your name"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control"
                          autoComplete="new-password"
                          placeholder="Create a password"
                          value={form.password}
                          onChange={handleChange}
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className="form-control"
                          autoComplete="new-password"
                          placeholder="Repeat your password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="accountType">I want to</label>
                    <select
                      id="accountType"
                      name="accountType"
                      className="form-control"
                      value={form.accountType}
                      onChange={handleChange}
                    >
                      <option value="customer">Buy fresh produce</option>
                      <option value="farmer">Sell my produce</option>
                    </select>
                    {form.accountType === "farmer" && (
                      <small>
                        Seller accounts need to be enabled by Maya after signup.
                        You can create your account now and we will confirm once
                        selling is switched on.
                      </small>
                    )}
                  </div>
                  <div className="form-group mb-0">
                    <button
                      type="submit"
                      className="theme-btn style-two w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating account…" : "Create Account"}
                      <i className="fas fa-angle-double-right" />
                    </button>
                  </div>
                </form>
                <p className="pt-25 mb-0">
                  Already have an account?{" "}
                  <Link
                    href={
                      redirect === "/account"
                        ? "/login"
                        : `/login?redirect=${encodeURIComponent(redirect)}`
                    }
                  >
                    <a>Sign in</a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
