import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const email = "admin@cloudatex.com";
  const password = "123456";

  const hashed = await bcrypt.hash(password, 10);

  await prisma.client.upsert({
    where: { email },
    update: {
      password: hashed,
    },
    create: {
      name: "Admin",
      email,
      password: hashed,
      plan: "admin",
      monthlyValue: 0,
      includedGb: 0,
      extraPricePerGb: 0,
      status: "ok",
    },
  });

  return NextResponse.json({
    message: "Admin resetado",
    email,
    password,
  });
}