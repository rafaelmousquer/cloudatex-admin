import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const id = cookieStore.get("user_id")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!id || role !== "client") {
    return NextResponse.json({}, { status: 401 });
  }

  const client = await prisma.client.findUnique({
    where: { id },
  });

  return NextResponse.json(client);
}