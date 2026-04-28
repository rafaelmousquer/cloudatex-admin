import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 🔥 LIBERA TODAS AS ROTAS API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const adminCookie = req.cookies.get("admin_auth");
  const clientCookie = req.cookies.get("client_id");

  // 🔒 ADMIN
  if (pathname.startsWith("/dashboard")) {
    if (!adminCookie || adminCookie.value !== "true") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // 🔒 CLIENTE
  if (pathname.startsWith("/client/dashboard")) {
    if (!clientCookie) {
      return NextResponse.redirect(new URL("/client/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/client/dashboard/:path*",
    "/api/:path*" // 👈 importante
  ],
};