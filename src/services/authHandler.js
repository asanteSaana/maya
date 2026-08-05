// Server-only. Shared by /api/auth/login and /api/auth/register: both call the
// backend, capture the accessToken into an httpOnly cookie, and return only the
// user profile to the browser.
import { backendRequest, buildSessionCookies } from "./serverApi";
import { toPublicUser } from "./userProfile";

export const establishSession = async (res, path, body) => {
  const { status, data } = await backendRequest(path, {
    method: "POST",
    body,
  });

  if (status < 200 || status >= 300) {
    res.status(status).json(
      typeof data === "object" && data
        ? data
        : { message: data || "Authentication failed." }
    );
    return;
  }

  // The backend returns the user inline, though some responses arrive wrapped
  // in { data: ... }.
  const payload = (data && typeof data === "object" && data.data) || data || {};
  const { accessToken } = payload;

  if (!accessToken) {
    res.status(502).json({
      message: "The store backend did not return an access token.",
    });
    return;
  }

  const user = toPublicUser(payload);

  res.setHeader("Set-Cookie", buildSessionCookies(accessToken, user));
  res.status(200).json({ user });
};
