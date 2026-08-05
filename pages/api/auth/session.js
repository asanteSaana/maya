import {
  getTokenFromRequest,
  getUserFromRequest,
} from "../../../src/services/serverApi";

export default function handler(req, res) {
  const token = getTokenFromRequest(req);
  const user = getUserFromRequest(req);

  // Both cookies are written together, so a token without a profile means the
  // session is half-formed and should be treated as signed out.
  if (!token || !user) {
    res.status(200).json({ user: null });
    return;
  }

  res.status(200).json({ user });
}
