import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FormAlert from "../src/components/FormAlert";
import PageBanner from "../src/components/PageBanner";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/layout/Layout";
import { safeRedirect } from "../src/services/navigation";

const Login = () => {
  const router = useRouter();
  const { isAuthenticated, isReady, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Never navigate to an attacker-supplied origin after sign-in.
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
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      router.push(redirect);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageBanner pageName={"Login"} />
      <div className="contact-page-form-area py-130 rpy-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="contact-page-form wow fadeInUp delay-0-2s">
                <h3 className="mb-15">Welcome back</h3>
                <p className="mb-25">
                  Sign in to track your orders and pick up where you left off.
                </p>
                <FormAlert error={error} />
                <form onSubmit={handleSubmit}>
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
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      autoComplete="current-password"
                      placeholder="Your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-0">
                    <button
                      type="submit"
                      className="theme-btn style-two w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in…" : "Sign In"}
                      <i className="fas fa-angle-double-right" />
                    </button>
                  </div>
                </form>
                <p className="pt-25 mb-0">
                  New to Maya?{" "}
                  <Link
                    href={
                      redirect === "/account"
                        ? "/register"
                        : `/register?redirect=${encodeURIComponent(redirect)}`
                    }
                  >
                    <a>Create an account</a>
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

export default Login;
