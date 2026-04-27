import { NextResponse } from "next/server";

function logout(req: Request) {
  const url = new URL("/client/login", req.url);

  const response = NextResponse.redirect(url);

  response.cookies.set("client_id", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}

export async function POST(req: Request) {
  return logout(req);
}

export async function GET(req: Request) {
  return logout(req);
}