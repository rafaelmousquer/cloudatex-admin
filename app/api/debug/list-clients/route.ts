import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });

    return NextResponse.json(clients);
  } catch (error: any) {
    console.error("ERRO PRISMA:", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar clientes",
        message: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}