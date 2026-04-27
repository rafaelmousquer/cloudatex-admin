import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const updated = await prisma.client.updateMany({
    where: {
      email: "admin@cloudatex.com",
    },
    data: {
      role: "admin",
    },
  });

  return NextResponse.json(updated);
}