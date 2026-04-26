import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "./lib/auth";

function isProtectedPage(pathname: string) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/clients");
}

function isProtectedApi(pathname: string) {
  return pathname.startsWith("/api/clients");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isLoggedIn = Boolean(session);

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedPage(pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isProtectedApi(pathname) && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/clients/:path*", "/api/clients/:path*"],
};