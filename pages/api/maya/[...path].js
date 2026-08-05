import { backendRequest, getTokenFromRequest } from "../../../src/services/serverApi";

// Auth lives behind /api/auth/* so the accessToken can be captured into an
// httpOnly cookie. Proxying it here would hand the raw token back to the
// browser and defeat that, so it is blocked outright.
const BLOCKED_PREFIXES = ["api/auth"];

export default async function handler(req, res) {
  const { path = [], ...query } = req.query;
  const segments = Array.isArray(path) ? path : [path];
  const targetPath = segments.join("/");

  if (BLOCKED_PREFIXES.some((prefix) => targetPath.startsWith(prefix))) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  const { status, data } = await backendRequest(targetPath, {
    method: req.method,
    body: ["GET", "HEAD", "DELETE"].includes(req.method) ? undefined : req.body,
    token: getTokenFromRequest(req),
    query,
  });

  res.status(status).json(data ?? {});
}
