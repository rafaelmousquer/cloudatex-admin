import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const client = await prisma.client.update({
      where: {
        email: "rafael@teste.com",
      },
      data: {
        storageUsedBytes: BigInt(3 * 1024 * 1024 * 1024),
      },
    });

    return NextResponse.json({
      message: "Uso atualizado",
      email: client.email,
      storageUsedGb: 3,
      storageUsedBytes: client.storageUsedBytes.toString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro ao atualizar uso",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}