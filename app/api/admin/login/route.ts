import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.client.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
    }

    // 🔥 COMPARAÇÃO SIMPLES (SEM HASH)
    if (user.password !== password) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Não é admin" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set("admin_auth", "true", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return res;

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}