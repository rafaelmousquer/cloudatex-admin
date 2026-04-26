import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = "COLOCA_AQUI_O_EMAIL_REAL"; // 👈 MUITO IMPORTANTE
    const plainPassword = "123456";

    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      return NextResponse.json({
        error: "Cliente não encontrado",
      });
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await prisma.client.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Senha criada com sucesso",
      email,
      password: plainPassword,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      error: "Erro interno",
    });
  }
}