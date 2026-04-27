import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const clients = await prisma.client.findMany();

  return NextResponse.json(
    clients.map((c) => ({
      name: c.name,
      storageUsedBytes: c.storageUsedBytes?.toString(),
    }))
  );
}