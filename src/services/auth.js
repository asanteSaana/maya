import { appRequest } from "./api";

// These hit this app's own routes, not the proxy — they are the only place the
// backend's accessToken is handled, and it never leaves the server.

export const loginUser = (credentials) =>
  appRequest("/api/auth/login", {
    method: "POST",
    body: credentials,
  });

export const registerUser = (payload) =>
  appRequest("/api/auth/register", {
    method: "POST",
    body: payload,
  });

export const logoutUser = () =>
  appRequest("/api/auth/logout", { method: "POST" });

export const fetchSession = () => appRequest("/api/auth/session");
