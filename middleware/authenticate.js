
import { createRemoteJWKSet, jwtVerify } from "jose";

const authBaseURL = process.env.BETTER_AUTH_URL;

const JWKS = createRemoteJWKSet(
  new URL("/api/auth/jwks", authBaseURL)
);

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: authBaseURL,
      audience: authBaseURL,
    });

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}
