import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      clients.map((client) => ({
        ...client,
        storageUsedBytes: client.storageUsedBytes?.toString(),
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const password = String(body.password || "").trim();
    const backupName = String(body.backupName || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Senha é obrigatória" },
        { status: 400 }
      );
    }

    if (!backupName) {
      return NextResponse.json(
        { error: "Backup name é obrigatório" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "client",
        plan: body.plan || "basic",
        monthlyValue: Number(body.monthlyValue) || 30,
        includedGb: Number(body.includedGb) || 5,
        extraPricePerGb: Number(body.extraPricePerGb) || 2,
        status: "unknown",
        machineName: body.machineName || null,
        backupName,
        storageUsedBytes: BigInt(0),
      },
    });

    return NextResponse.json({
      ...client,
      storageUsedBytes: client.storageUsedBytes.toString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar cliente" },
      { status: 500 }
    );
  }
}