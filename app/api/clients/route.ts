import { prisma } from "@/lib/prisma";

function jsonSafe(data: unknown) {
  return JSON.stringify(data, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });

    return new Response(jsonSafe(clients), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ERRO GET CLIENTS:", error);

    return new Response(
      JSON.stringify({
        error: "Erro ao buscar clientes",
        details: String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY CREATE CLIENT:", body);

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

    return new Response(jsonSafe(client), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ERRO POST CLIENT:", error);

    return new Response(
      JSON.stringify({
        error: "Erro ao criar cliente",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}