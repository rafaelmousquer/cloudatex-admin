import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // 🔥 CORREÇÃO DO BIGINT
    const safeClient = JSON.parse(
      JSON.stringify(client, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json(safeClient);
  } catch (error) {
    console.error("ERRO GET CLIENT:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cliente", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const client = await prisma.client.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email || null,
        plan: body.plan,
        monthlyValue: Number(body.monthlyValue),
        includedGb: Number(body.includedGb),
        extraPricePerGb: Number(body.extraPricePerGb),
        status: body.status,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("ERRO PUT CLIENT:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cliente", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ERRO DELETE CLIENT:", error);
    return NextResponse.json(
      { error: "Erro ao deletar cliente", details: String(error) },
      { status: 500 }
    );
  }
}