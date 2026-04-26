import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Sem ID" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    status: client.status,
    lastBackupAt: client.lastBackupAt,
    lastBackupError: client.lastBackupError,
    machineName: client.machineName,
  });
}