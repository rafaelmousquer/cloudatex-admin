import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout realizado",
  });

  // 🔥 remove cookie
  response.cookies.set("client_id", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}