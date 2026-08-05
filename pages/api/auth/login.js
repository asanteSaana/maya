import { establishSession } from "../../../src/services/authHandler";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  await establishSession(res, "api/auth/login", { email, password });
}
