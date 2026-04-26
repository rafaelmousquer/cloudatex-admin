import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = "rafael@teste.com";
    const plainPassword = "123456";

    // 🔍 busca cliente
    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    // 🔐 hash da senha
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 💾 salva no banco
    await prisma.client.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Senha criada com sucesso",
      email,
      password: plainPassword, // só pra teste, depois REMOVE ISSO
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar senha" },
      { status: 500 }
    );
  }
}