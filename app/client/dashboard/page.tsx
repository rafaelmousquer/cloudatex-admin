import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "Sem backup";

  return new Date(date).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
}

function bytesToGb(bytes: bigint | number | null | undefined) {
  if (!bytes) return 0;
  return Number(bytes) / 1024 / 1024 / 1024;
}

function getStatus(client: any) {
  if (client.status === "error") return "error";
  if (client.status === "warning") return "warning";
  if (!client.lastBackupAt) return "offline";

  const diff =
    (Date.now() - new Date(client.lastBackupAt).getTime()) /
    (1000 * 60 * 60);

  if (diff > 24) return "offline";

  return "ok";
}

function statusLabel(status: string) {
  if (status === "ok") return "Ativo";
  if (status === "error") return "Erro";
  if (status === "warning") return "Atenção";
  if (status === "offline") return "Offline";
  return "Desconhecido";
}

function statusClass(status: string) {
  if (status === "ok")
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";

  if (status === "error")
    return "bg-red-500/10 text-red-300 border-red-500/30";

  if (status === "warning")
    return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";

  return "bg-zinc-500/10 text-zinc-300 border-zinc-500/30";
}

export default async function ClientDashboardPage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("client_id")?.value;

  if (!clientId) {
    redirect("/client/login");
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    redirect("/client/login");
  }

  const status = getStatus(client);

  const usedGb = bytesToGb(client.storageUsedBytes);
  const includedGb = Number(client.includedGb || 0);
  const usagePercent =
    includedGb > 0 ? Math.min((usedGb / includedGb) * 100, 100) : 0;

  const extraGb = Math.max(usedGb - includedGb, 0);
  const estimatedExtraCost =
    extraGb * Number(client.extraPricePerGb || 0);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        
        {/* HEADER */}
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h1 className="text-2xl font-bold">Olá, {client.name}</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Aqui está o status do seu backup
          </p>
        </header>

        {/* STATUS */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Status</span>

            <span
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusClass(
                status
              )}`}
            >
              {statusLabel(status)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Plano</span>
            <span>{client.plan}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Valor mensal</span>
            <span>R$ {Number(client.monthlyValue).toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Último backup</span>

            <span>{formatDate(client.lastBackupAt)}</span>
          </div>
        </div>

        {/* STORAGE */}
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-200">
                Uso de armazenamento
              </h3>
              <p className="mt-1 text-sm text-blue-200/60">
                Espaço usado no backup em nuvem
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-blue-200">
                {usedGb.toFixed(2)} GB
              </p>
              <p className="text-sm text-blue-200/60">
                de {includedGb.toFixed(2)} GB incluídos
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-blue-400"
              style={{ width: `${usagePercent}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-blue-100/70">
            <span>{usagePercent.toFixed(0)}% utilizado</span>

            {extraGb > 0 ? (
              <span>
                Extra: {extraGb.toFixed(2)} GB · R${" "}
                {estimatedExtraCost.toFixed(2)}
              </span>
            ) : (
              <span>Dentro do plano</span>
            )}
          </div>
        </div>

        {/* ERROR */}
        {client.lastBackupError && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
            <h3 className="font-semibold text-red-300">
              Último erro detectado
            </h3>

            <p className="mt-2 text-sm text-red-200/80 break-words">
              Problema ao conectar ao backup. Nossa equipe já pode estar
              verificando.
            </p>
          </div>
        )}

        {/* LOGOUT */}
        <a
          href="/api/client/logout"
          className="block w-full rounded-xl bg-red-600 py-3 text-center font-semibold text-white hover:bg-red-700"
        >
          Sair
        </a>

      </div>
    </div>
  );
}