import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getAsaasConfig() {
  const apiKey = process.env.ASAAS_API_KEY;
  const baseUrl = process.env.ASAAS_BASE_URL || "https://sandbox.asaas.com/api";

  if (!apiKey) {
    throw new Error("ASAAS_API_KEY não configurada");
  }

  return { apiKey, baseUrl };
}

async function asaasFetch(path: string, options: RequestInit) {
  const { apiKey, baseUrl } = getAsaasConfig();

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "access_token": apiKey,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("ASAAS ERROR:", data);
    throw new Error(data?.errors?.[0]?.description || "Erro Asaas");
  }

  return data;
}

export async function POST(req: Request) {
  try {
    const { clientId } = await req.json();

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    if (!client.email) {
      return NextResponse.json(
        { error: "Cliente sem email" },
        { status: 400 }
      );
    }

    let asaasCustomerId = client.asaasCustomerId;

    if (!asaasCustomerId) {
      const customer = await asaasFetch("/v3/customers", {
        method: "POST",
        body: JSON.stringify({
          name: client.name,
          email: client.email,
        }),
      });

      asaasCustomerId = customer.id;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const dueDateString = dueDate.toISOString().split("T")[0];

    const payment = await asaasFetch("/v3/payments", {
      method: "POST",
      body: JSON.stringify({
        customer: asaasCustomerId,
        billingType: "PIX",
        value: Number(client.monthlyValue || 30),
        dueDate: dueDateString,
        description: `Mensalidade Cloudatex - ${client.name}`,
      }),
    });

    const pix = await asaasFetch(`/v3/payments/${payment.id}/pixQrCode`, {
      method: "GET",
    });

    const updated = await prisma.client.update({
      where: { id: client.id },
      data: {
        asaasCustomerId,
        asaasPaymentId: payment.id,
        paymentStatus: "pending",
        paymentDueDate: dueDate,
        paymentUrl: payment.invoiceUrl || payment.bankSlipUrl || null,
        pixQrCode: pix.encodedImage || null,
        pixCopyPaste: pix.payload || null,
      },
    });

    return NextResponse.json({
      ok: true,
      client: {
        id: updated.id,
        name: updated.name,
        paymentStatus: updated.paymentStatus,
        paymentUrl: updated.paymentUrl,
        pixCopyPaste: updated.pixCopyPaste,
      },
    });
  } catch (error) {
    console.error("ERRO CREATE ASAAS PAYMENT:", error);

    return NextResponse.json(
      {
        error: "Erro ao gerar cobrança",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}