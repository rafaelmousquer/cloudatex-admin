import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar clientes", details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const client = await prisma.client.create({
      data: {
        name: body.name,
        email: body.email || null,
        plan: body.plan || "basic",
        monthlyValue: Number(body.monthlyValue ?? 30),
        includedGb: Number(body.includedGb ?? 5),
        extraPricePerGb: Number(body.extraPricePerGb ?? 2),
        status: body.status || "unknown",
        machineName: body.machineName || null,
        backupName: body.backupName || null,
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar cliente", details: String(error) },
      { status: 500 }
    )
  }
}