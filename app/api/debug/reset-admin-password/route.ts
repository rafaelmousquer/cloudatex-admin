// /api/debug/reset-admin-password
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const newPassword = await bcrypt.hash("123456", 10);

  await prisma.client.updateMany({
    where: {
      email: "admin@cloudatex.com",
    },
    data: {
      password: newPassword,
    },
  });

  return NextResponse.json({ ok: true });
}