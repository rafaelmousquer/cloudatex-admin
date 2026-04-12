import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });

    const safeClients = JSON.parse(
      JSON.stringify(clients, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json(safeClients);
  } catch (error) {
    console.error("ERRO GET CLIENTS:", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar clientes",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await prisma.client.create({
      data: {
        name: String(body.name || "").trim(),
        email: body.email ? String(body.email).trim() : null,
        plan: body.plan ? String(body.plan) : "basic",
        monthlyValue: Number(body.monthlyValue) || 30,
        includedGb: Number(body.includedGb) || 5,
        extraPricePerGb: Number(body.extraPricePerGb) || 2,
        status: "unknown",
      },
    });

    const safeClient = JSON.parse(
      JSON.stringify(client, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json(safeClient);
  } catch (error) {
    console.error("ERRO POST CLIENT:", error);

    return NextResponse.json(
      {
        error: "Erro ao criar cliente",
        details: String(error),
      },
      { status: 500 }
    );
  }
}