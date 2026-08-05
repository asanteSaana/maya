/**
 * Only same-origin paths may be used as a post-login destination.
 *
 * `?redirect=` is attacker-controllable, and the sign-in page is exactly where
 * a user is most likely to trust wherever they land next. Anything that could
 * leave the origin — an absolute URL, a protocol-relative "//host", or a
 * backslash variant some browsers normalise to "//" — falls back instead.
 */
export const safeRedirect = (value, fallback = "/account") => {
  if (typeof value !== "string") {
    return fallback;
  }

  const path = value.trim();

  if (!path.startsWith("/")) {
    return fallback;
  }

  // "//evil.com" and "/\evil.com" both resolve off-origin.
  if (/^[/\\]{2}/.test(path)) {
    return fallback;
  }

  // Control characters can be used to smuggle a payload past the checks above.
  // Tested by codepoint rather than a regex so the source stays free of
  // literal control bytes.
  for (let index = 0; index < path.length; index += 1) {
    const code = path.charCodeAt(index);

    if (code <= 0x1f || code === 0x7f) {
      return fallback;
    }
  }

  return path;
};

/** Builds a sign-in link that returns the user to where they started. */
export const loginHref = (redirectTo) =>
  redirectTo && redirectTo !== "/"
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : "/login";
