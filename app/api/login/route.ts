import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.client.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // 🔥 DEFINE TIPO
    const role = email === "admin@cloudatex.com" ? "admin" : "client";

    const response = NextResponse.json({
      role,
    });

    // 🔐 cookie
    response.cookies.set("user_id", user.id, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    response.cookies.set("user_role", role, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Erro no login" },
      { status: 500 }
    );
  }
}