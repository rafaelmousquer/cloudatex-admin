import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const adminCookie = req.cookies.get("admin_auth");

  const isAdminRoute = req.nextUrl.pathname.startsWith("/dashboard");

  // 🔒 PROTEGE ROTAS DO ADMIN
  if (isAdminRoute) {
    if (!adminCookie || adminCookie.value !== "true") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

// 🎯 DEFINE ONDE APLICAR O MIDDLEWARE
export const config = {
  matcher: ["/dashboard/:path*"],
};