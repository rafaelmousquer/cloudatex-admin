import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/login", "http://localhost:3000"));

  // 🔥 remove cookies
  response.cookies.set("user_id", "", {
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("user_role", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}