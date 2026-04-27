// /api/debug/list-admin
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.client.findMany();
  return NextResponse.json(users);
}