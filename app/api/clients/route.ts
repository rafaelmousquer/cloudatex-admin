import { prisma } from "@/lib/prisma";

function serializeClient(client: any) {
  return {
    ...client,
    storageUsedBytes:
      typeof client.storageUsedBytes === "bigint"
        ? client.storageUsedBytes.toString()
        : client.storageUsedBytes ?? "0",
  };
}

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });

    const safeClients = clients.map(serializeClient);

    return Response.json(safeClients);
  } catch (error) {
    console.error("ERRO GET CLIENTS:", error);

    return Response.json(
      {
        error: "Erro ao buscar clientes",
        details: error instanceof Error ? error.message : String(error),
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
        storageUsedBytes: BigInt(0),
      },
    });

    return Response.json(serializeClient(client));
  } catch (error) {
    console.error("ERRO POST CLIENT:", error);

    return Response.json(
      {
        error: "Erro ao criar cliente",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}