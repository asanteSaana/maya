// Browser-side API client. Every call goes to this app's own /api/maya/* proxy,
// which attaches the backend API key and bearer token server-side. Nothing
// secret is available here by design.

export const PROXY_PREFIX = "/api/maya";

export const UNAUTHORIZED_EVENT = "maya:unauthorized";

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = details.status || 0;
    this.data = details.data;
  }
}

// Trailing slashes must be stripped here: Next answers /api/maya/api/products/
// with a 308 to the slashless form before the proxy handler ever runs, so
// keeping them would add a redirect hop to every single call. Express matches
// the router mount point with or without one, so the backend sees no difference.
const trimSlashes = (value) => String(value || "").replace(/^\/+|\/+$/g, "");

const buildUrl = (path, query) => {
  const base = /^https?:\/\//i.test(path)
    ? path
    : `${PROXY_PREFIX}/${trimSlashes(path)}`;

  const search = new URLSearchParams(
    Object.entries(query || {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  ).toString();

  return search ? `${base}?${search}` : base;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export const unwrapApiData = (payload) => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload;
};

const notifyUnauthorized = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
};

// Mongo's duplicate-key errors are forwarded verbatim by the backend and are
// meaningless to a shopper.
const isInternalDatabaseError = (message) =>
  /E11000|duplicate key|MongoError|ValidationError:|Cast to ObjectId/i.test(message);

// Express serves its failures as HTML error pages, which must never be shown
// to a user as-is.
const looksLikeHtml = (text) => /^\s*(<!doctype|<html|<pre)/i.test(text);

/**
 * Reduces any error body to a single readable string.
 *
 * The backend answers in at least four shapes: a JSON object with a message, a
 * bare string from the rate limiter, an HTML error page from Express, and an
 * object whose own message is another object. That last one is why a failure
 * once reached the screen as "[object Object]" — the value was passed to Error
 * unchanged and stringified. Everything is coerced to text here instead.
 */
const asText = (value, depth = 0) => {
  if (value === null || value === undefined || depth > 3) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    const nested = value.message ?? value.error ?? value.msg;
    return nested === undefined ? "" : asText(nested, depth + 1);
  }

  return String(value);
};

const errorMessage = (data, status) => {
  const raw = asText(data);

  if (status === 429 || /exceeded your .* limit/i.test(raw)) {
    return "Too many requests just now. Please wait a moment and try again.";
  }

  if (!raw) {
    return `Request failed with status ${status}.`;
  }

  // The full body stays on the error for debugging; the user sees something
  // they can act on rather than a stack of markup.
  if (looksLikeHtml(raw)) {
    return `The store backend returned an unexpected response (status ${status}). Please try again.`;
  }

  if (isInternalDatabaseError(raw)) {
    return "We could not complete that. Please refresh and try again.";
  }

  return raw.length > 200 ? `${raw.slice(0, 200)}…` : raw;
};

const request = async (
  url,
  { method = "GET", body, headers = {}, signal, notifyOn401 = true } = {}
) => {
  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  if (body && !isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    credentials: "same-origin",
    signal,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401 && notifyOn401) {
      notifyUnauthorized();
    }

    throw new ApiError(errorMessage(data, response.status), {
      status: response.status,
      data,
    });
  }

  return data;
};

/** Calls the Maya backend through this app's proxy. */
export const apiRequest = (path, { query, ...options } = {}) =>
  request(buildUrl(path, query), options);

/**
 * Calls one of this app's own routes (/api/auth/*) directly, skipping the
 * proxy. A 401 here is a failed sign-in, not an expired session, so it must not
 * trigger the global logout.
 */
export const appRequest = (path, options = {}) =>
  request(path, { ...options, notifyOn401: false });
