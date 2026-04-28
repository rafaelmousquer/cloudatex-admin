export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;
    const password = body.password;

    const user = await prisma.client.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Não é admin" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password || "");

    if (!isValid) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set("admin_auth", "true", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return response;

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}