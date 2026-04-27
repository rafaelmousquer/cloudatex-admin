import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await prisma.client.update({
    where: {
      email: "rafael@teste.com",
    },
    data: {
      paymentStatus: "pending",
      paymentDueDate: new Date(),
      paymentUrl: "https://sandbox.asaas.com/i/123456",
      pixCopyPaste: "00020126580014BR.GOV.BCB.PIX...",
    },
  });

  return NextResponse.json({
    ok: true,
    email: client.email,
  });
}