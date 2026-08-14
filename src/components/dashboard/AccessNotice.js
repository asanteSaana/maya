import Head from "next/head";

/**
 * Standalone screen for the two states where the shell must not be drawn:
 * while the session is still resolving, and when the account is signed in but
 * not entitled to this area. Showing the navigation in either case would imply
 * access the visitor does not have.
 */
const AccessNotice = ({ title, heading, message, action, loading = false }) => (
  <>
    <Head>
      <title>{`${title} | Maya`}</title>
      <meta name="robots" content="noindex" />
    </Head>
    <div className="dash-notice">
      <div className="dash-notice-card">
        <span className="dash-notice-mark">
          <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-lock"} />
        </span>
        <h1>{loading ? "Checking your account…" : heading}</h1>
        {!loading && message && <p>{message}</p>}
        {!loading && action && <div className="pt-10">{action}</div>}
      </div>
    </div>
  </>
);

export default AccessNotice;
