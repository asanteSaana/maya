import { establishSession } from "../../../src/services/authHandler";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { username, email, password, roleId, partnerId } = req.body || {};

  if (!username || !email || !password) {
    res
      .status(400)
      .json({ message: "Username, email and password are required." });
    return;
  }

  await establishSession(res, "api/auth/register", {
    username,
    email,
    password,
    roleId: roleId || undefined,
    partnerId: partnerId || null,
  });
}
