import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FormAlert from "../src/components/FormAlert";
import PageBanner from "../src/components/PageBanner";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/layout/Layout";
import { ROLE_IDS } from "../src/services/constants";

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

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/account");
    }
  }, [isAuthenticated, isReady, router]);

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

      router.push(
        form.accountType === "farmer" && user?.isPartner
          ? "/farmer/dashboard"
          : "/account"
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageBanner pageName={"Create Account"} />
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
                  <Link href="/login">
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
