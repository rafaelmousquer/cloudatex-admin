import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createSessionToken, isValidAdminLogin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (!isValidAdminLogin(email, password)) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const token = await createSessionToken(email);

    const response = NextResponse.json({ ok: true });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("ERRO LOGIN:", error);

    return NextResponse.json(
      { error: "Erro interno no login" },
      { status: 500 }
    );
  }
}