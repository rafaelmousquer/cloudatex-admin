import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url));

  res.cookies.set("admin_auth", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}