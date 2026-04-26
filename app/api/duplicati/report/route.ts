import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function pickFirstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }

  return null;
}

function pickFirstNumber(...values: unknown[]): number {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
}

function getStorageUsedBytes(body: any): bigint {
  const bytes = pickFirstNumber(
    body?.Data?.BackendStatistics?.KnownFileSize,
    body?.data?.BackendStatistics?.KnownFileSize,
    body?.BackendStatistics?.KnownFileSize,
    body?.backendStatistics?.KnownFileSize,
    body?.Data?.SizeOfExaminedFiles,
    body?.data?.SizeOfExaminedFiles,
    body?.SizeOfExaminedFiles,
    body?.sizeOfExaminedFiles
  );

  return BigInt(Math.max(0, Math.floor(bytes)));
}

function safeClient(client: any) {
  return {
    ...client,
    storageUsedBytes:
      typeof client?.storageUsedBytes === "bigint"
        ? client.storageUsedBytes.toString()
        : client?.storageUsedBytes,
  };
}

function extractErrorMessage(body: any, rawText: string): string | null {
  const logLines = Array.isArray(body?.Extra?.LogLines)
    ? body.Extra.LogLines
    : Array.isArray(body?.extra?.LogLines)
    ? body.extra.LogLines
    : [];

  if (logLines.length > 0) {
    const joined = logLines.join("\n");

    if (joined.toLowerCase().includes("error")) {
      return joined;
    }
  }

  const resultText = pickFirstString(
    body?.Result,
    body?.result,
    body?.Message,
    body?.message,
    body?.Error,
    body?.error
  );

  if (resultText) return resultText;

  if (rawText.toLowerCase().includes("error")) {
    return rawText;
  }

  return null;
}

function detectStatus(
  body: any,
  rawText: string
): "ok" | "warning" | "error" | "unknown" {
  const parsedResult = pickFirstString(
    body?.ParsedResult,
    body?.parsedResult,
    body?.PARSEDRESULT,
    body?.MainOperation,
    body?.mainOperation,
    body?.Data?.ParsedResult,
    body?.data?.ParsedResult
  );

  const errorsActualLength =
    body?.ErrorsActualLength ??
    body?.errorsActualLength ??
    body?.BackendStatistics?.ErrorsActualLength ??
    body?.Data?.ErrorsActualLength ??
    body?.Data?.BackendStatistics?.ErrorsActualLength ??
    0;

  const warningsActualLength =
    body?.WarningsActualLength ??
    body?.warningsActualLength ??
    body?.BackendStatistics?.WarningsActualLength ??
    body?.Data?.WarningsActualLength ??
    body?.Data?.BackendStatistics?.WarningsActualLength ??
    0;

  const logLines = Array.isArray(body?.Extra?.LogLines)
    ? body.Extra.LogLines.join("\n").toLowerCase()
    : Array.isArray(body?.extra?.LogLines)
    ? body.extra.LogLines.join("\n").toLowerCase()
    : "";

  const lowerParsed = (parsedResult || "").toLowerCase();
  const lowerRaw = rawText.toLowerCase();

  if (
    Number(errorsActualLength) > 0 ||
    lowerParsed.includes("error") ||
    lowerParsed.includes("fatal") ||
    logLines.includes("error") ||
    logLines.includes("bad_auth_token") ||
    logLines.includes("failed") ||
    lowerRaw.includes("bad_auth_token") ||
    lowerRaw.includes("errorresponse: 401") ||
    lowerRaw.includes("failed")
  ) {
    return "error";
  }

  if (
    Number(warningsActualLength) > 0 ||
    lowerParsed.includes("warning") ||
    logLines.includes("warning")
  ) {
    return "warning";
  }

  if (lowerParsed.includes("success") || lowerParsed.includes("completed")) {
    return "ok";
  }

  return "unknown";
}

export async function POST(req: Request) {
  try {
    const rawText = await req.text();

    let body: any = null;

    try {
      body = rawText ? JSON.parse(rawText) : {};
    } catch {
      body = {};
    }

    console.log("DUPLICATI RAW BODY:", JSON.stringify(body, null, 2));

    const extra = (body?.Extra ?? body?.extra ?? {}) as Record<string, unknown>;

    const backupName = pickFirstString(
      extra["backup-name"],
      extra["backupName"],
      body?.backupName,
      body?.["backup-name"],
      body?.BackupName,
      body?.Name,
      body?.name
    );

    const machineName = pickFirstString(
      extra["machine-name"],
      extra["machineName"],
      body?.machineName,
      body?.["machine-name"],
      body?.MachineName
    );

    const timestampRaw = pickFirstString(
      body?.EndTime,
      body?.endTime,
      body?.EventTime,
      body?.eventTime,
      body?.Time,
      body?.time,
      body?.timestamp,
      body?.Timestamp,
      body?.Data?.EndTime,
      body?.data?.EndTime
    );

    const normalizedStatus = detectStatus(body, rawText);
    const cleanErrorMessage = extractErrorMessage(body, rawText);
    const storageUsedBytes = getStorageUsedBytes(body);

    const clientName =
      backupName ||
      (machineName ? `backup-${machineName}` : "cliente-sem-nome");

    let client = await prisma.client.findFirst({
      where: { name: clientName },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: clientName,
          email: null,
          plan: "basic",
          monthlyValue: 30,
          includedGb: 5,
          extraPricePerGb: 2,
          status: normalizedStatus,
          machineName: machineName || null,
          backupName: backupName || null,
          storageUsedBytes,
          lastBackupAt: timestampRaw ? new Date(timestampRaw) : new Date(),
          lastBackupError:
            normalizedStatus === "error" ? cleanErrorMessage : null,
        },
      });
    } else {
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          status: normalizedStatus,
          machineName: machineName || null,
          backupName: backupName || null,
          storageUsedBytes,
          lastBackupAt: timestampRaw ? new Date(timestampRaw) : new Date(),
          lastBackupError:
            normalizedStatus === "error" ? cleanErrorMessage : null,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      clientName,
      normalizedStatus,
      cleanErrorMessage,
      storageUsedBytes: storageUsedBytes.toString(),
      storageUsedGb: Number(storageUsedBytes) / 1024 / 1024 / 1024,
      client: safeClient(client),
    });
  } catch (error) {
    console.error("ERRO DUPLICATI:", error);

    return NextResponse.json(
      {
        error: "Erro interno",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}