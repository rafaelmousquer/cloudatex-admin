import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await prisma.client.update({
    where: {
      email: "admin@cloudatex.com",
    },
    data: {
      role: "admin",
    },
  });

  return NextResponse.json({
    message: "Admin atualizado com sucesso",
    email: admin.email,
    role: admin.role,
  });
}