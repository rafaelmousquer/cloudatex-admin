import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function serializeClient(client: any) {
  return {
    ...client,
    storageUsedBytes:
      typeof client.storageUsedBytes === "bigint"
        ? client.storageUsedBytes.toString()
        : client.storageUsedBytes ?? "0",
  };
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      return Response.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return Response.json(serializeClient(client));
  } catch (error) {
    console.error("ERRO GET CLIENT:", error);

    return Response.json(
      {
        error: "Erro ao buscar cliente",
        details: error instanceof Error ? error.message : String(error),
      },
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

    return Response.json(serializeClient(client));
  } catch (error) {
    console.error("ERRO PUT CLIENT:", error);

    return Response.json(
      {
        error: "Erro ao atualizar cliente",
        details: error instanceof Error ? error.message : String(error),
      },
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

    return Response.json({ ok: true });
  } catch (error) {
    console.error("ERRO DELETE CLIENT:", error);

    return Response.json(
      {
        error: "Erro ao deletar cliente",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}