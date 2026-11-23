import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

export async function requireAuth(req, res, next) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  req.user = session.user;
  next();
}

export const requireRole =
  (...roles) =>
  (req, res, next) =>
    roles.includes(req.user?.role)
      ? next()
      : res.status(403).json({ message: "Forbidden" });