import { NextResponse } from "next/server";

function handle(req: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url));

  res.cookies.set("admin_auth", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}

// aceita GET
export async function GET(req: Request) {
  return handle(req);
}

// aceita POST (resolve 405)
export async function POST(req: Request) {
  return handle(req);
}