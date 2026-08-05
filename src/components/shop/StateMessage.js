import Link from "next/link";

// Shared placeholders for the three states every product surface can land in.
// They reuse the template's spacing utilities so they sit correctly inside the
// existing section padding.

export const LoadingState = ({ message = "Loading products…" }) => (
  <div className="text-center py-60">
    <i className="fas fa-spinner fa-spin fa-2x mb-15" aria-hidden="true" />
    <p className="mb-0">{message}</p>
  </div>
);

export const EmptyState = ({
  title = "Nothing here yet",
  message = "Please check back soon.",
  action,
}) => (
  <div className="text-center py-60">
    <h4>{title}</h4>
    <p>{message}</p>
    {action}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="text-center py-60">
    <h4>Something went wrong</h4>
    <p>{message || "We could not load this right now."}</p>
    {onRetry && (
      <button type="button" className="theme-btn style-two" onClick={onRetry}>
        Try again <i className="fas fa-angle-double-right" />
      </button>
    )}
  </div>
);

export const SignInPrompt = ({
  message = "Please sign in to browse the marketplace.",
}) => (
  <div className="text-center py-60">
    <h4>Sign in required</h4>
    <p>{message}</p>
    <Link href="/login">
      <a className="theme-btn style-two">
        Sign in <i className="fas fa-angle-double-right" />
      </a>
    </Link>
  </div>
);
