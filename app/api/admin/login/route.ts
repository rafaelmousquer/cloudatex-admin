import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (
    email === "admin@cloudatex.com" &&
    password === "123456"
  ) {
    const response = NextResponse.json({ ok: true });

    response.cookies.set("admin_auth", "true", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return response;
  }

  return NextResponse.json(
    { error: "Credenciais inválidas" },
    { status: 401 }
  );
}