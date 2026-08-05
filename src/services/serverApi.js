// Server-only. This module reads MAYA_API_KEY and must never be imported from
// client code — everything in the browser goes through /api/maya/* instead.

export const BACKEND_BASE_URL =
  process.env.MAYA_API_BASE_URL || "https://ecommerce-backend-9tly.onrender.com";

export const AUTH_COOKIE_NAME = "maya_token";
// The backend exposes no "current user" endpoint, so the profile returned at
// login is stashed alongside the token and replayed by /api/auth/session.
export const USER_COOKIE_NAME = "maya_user";

// The backend runs on Render's free tier, which sleeps after inactivity. The
// first request after a sleep returns 502/503 while the instance boots, which
// can take the better part of a minute.
const COLD_START_STATUSES = [502, 503, 504];
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 2000;
const REQUEST_TIMEOUT_MS = 60000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildUrl = (path) => {
  const base = BACKEND_BASE_URL.replace(/\/+$/g, "");
  const suffix = String(path || "").replace(/^\/+/, "");
  return `${base}/${suffix}`;
};

const parseBody = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/**
 * Calls the Maya backend from the server, injecting the API key and an optional
 * bearer token. Resolves with { status, data } rather than throwing on HTTP
 * errors, so callers can mirror the upstream status back to the browser.
 */
export const backendRequest = async (
  path,
  { method = "GET", body, token, headers = {}, query } = {}
) => {
  if (!process.env.MAYA_API_KEY) {
    return {
      status: 500,
      data: {
        message:
          "MAYA_API_KEY is not configured. Add it to .env.local (see .env.example).",
      },
    };
  }

  const requestHeaders = {
    Accept: "application/json",
    "x-apiKey": process.env.MAYA_API_KEY,
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined && body !== null) {
    requestHeaders["Content-Type"] = "application/json";
  }

  let url = buildUrl(path);
  const search = new URLSearchParams(query || {}).toString();
  if (search) {
    url += `?${search}`;
  }

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body:
          body === undefined || body === null ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });

      const data = await parseBody(response);

      if (COLD_START_STATUSES.includes(response.status) && attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_BASE_DELAY_MS * attempt);
        continue;
      }

      return { status: response.status, data };
    } catch (error) {
      lastError = error;

      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_BASE_DELAY_MS * attempt);
        continue;
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    status: 504,
    data: {
      message:
        lastError?.name === "AbortError"
          ? "The store backend took too long to respond. It may be waking up — please try again."
          : "Could not reach the store backend. Please try again in a moment.",
    },
  };
};

/** Reads the JWT out of the httpOnly cookie set by /api/auth/login. */
export const getTokenFromRequest = (req) =>
  (req?.cookies && req.cookies[AUTH_COOKIE_NAME]) || "";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const buildCookie = (name, value, maxAge) => {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
};

const encodeProfile = (user) =>
  encodeURIComponent(Buffer.from(JSON.stringify(user || {})).toString("base64"));

const decodeProfile = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(decodeURIComponent(value), "base64").toString("utf8")
    );
  } catch {
    return null;
  }
};

/** Set-Cookie pair written on login/register: the token plus the user profile. */
export const buildSessionCookies = (token, user) => [
  buildCookie(AUTH_COOKIE_NAME, token, COOKIE_MAX_AGE_SECONDS),
  buildCookie(USER_COOKIE_NAME, encodeProfile(user), COOKIE_MAX_AGE_SECONDS),
];

export const buildClearSessionCookies = () => [
  buildCookie(AUTH_COOKIE_NAME, "", 0),
  buildCookie(USER_COOKIE_NAME, "", 0),
];

export const getUserFromRequest = (req) =>
  decodeProfile(req?.cookies && req.cookies[USER_COOKIE_NAME]);
