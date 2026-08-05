import { buildClearSessionCookies } from "../../../src/services/serverApi";

export default function handler(req, res) {
  res.setHeader("Set-Cookie", buildClearSessionCookies());
  res.status(200).json({ user: null });
}
