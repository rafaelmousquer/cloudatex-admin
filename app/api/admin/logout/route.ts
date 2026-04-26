import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect("http://localhost:3000/admin/login");

  response.cookies.set("admin_auth", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}