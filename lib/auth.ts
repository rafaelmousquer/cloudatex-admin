import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE_NAME = "cloudatex_admin_session";

function getJwtSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET não definido no .env");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(email: string) {
  const secret = getJwtSecret();

  return await new SignJWT({
    email,
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export function isValidAdminLogin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL ou ADMIN_PASSWORD não definidos no .env");
  }

  return email === adminEmail && password === adminPassword;
}