// /api/debug/reset-admin
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const hash = await bcrypt.hash("123456", 10);

  await prisma.client.updateMany({
    where: { email: "admin@cloudatex.com" },
    data: { password: hash },
  });

  return NextResponse.json({ ok: true });
}