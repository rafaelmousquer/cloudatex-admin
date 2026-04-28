import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

type ClientRow = {
  id: string;
  name: string;
  email: string | null;
  plan: string;
  monthlyValue: number;
  includedGb: number;
  extraPricePerGb: number;
  status: string;
  machineName: string | null;
  backupName: string | null;
  lastBackupAt: Date | null;
  lastBackupError: string | null;
  createdAt: Date;
};

function getStatus(client: ClientRow) {
  if (client.status === "error") return "error";
  if (client.status === "warning") return "warning";
  if (client.status === "unknown") return "unknown";
  if (!client.lastBackupAt) return "offline";

  const diffHours =
    (Date.now() - new Date(client.lastBackupAt).getTime()) / (1000 * 60 * 60);

  if (diffHours > 24) return "offline";

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
  if (status === "ok") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "error") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  if (status === "warning") {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  if (status === "offline") {
    return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
  }

  return "border-slate-500/30 bg-slate-500/10 text-slate-300";
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value;

  if (isAdmin !== "true") {
    redirect("/admin/login");
  }

  const clients = (await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  })) as ClientRow[];

  const total = clients.length;
  const active = clients.filter((c) => getStatus(c) === "ok").length;
  const offline = clients.filter((c) => getStatus(c) === "offline").length;
  const error = clients.filter((c) => getStatus(c) === "error").length;

  const mrr = clients.reduce((acc, client) => {
    return acc + Number(client.monthlyValue || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">Cloudatex Admin</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Painel de Backups
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Monitore clientes, receita mensal e status dos backups em tempo real.
            </p>
          </div>

          {/* 🔥 LOGOUT CORRIGIDO */}
          <a
            href="/api/admin/logout"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
          >
            Sair
          </a>
        </header>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10">
            <p className="text-sm text-zinc-400">Clientes</p>
            <h2 className="mt-3 text-4xl font-bold">{total}</h2>
            <p className="mt-2 text-xs text-zinc-500">Total cadastrado</p>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-xl shadow-black/10">
            <p className="text-sm text-emerald-300">Ativos</p>
            <h2 className="mt-3 text-4xl font-bold text-emerald-300">
              {active}
            </h2>
            <p className="mt-2 text-xs text-emerald-200/60">Backup recente</p>
          </div>

          <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6 shadow-xl shadow-black/10">
            <p className="text-sm text-yellow-300">Offline</p>
            <h2 className="mt-3 text-4xl font-bold text-yellow-300">
              {offline}
            </h2>
            <p className="mt-2 text-xs text-yellow-200/60">Sem backup recente</p>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 shadow-xl shadow-black/10">
            <p className="text-sm text-red-300">Com erro</p>
            <h2 className="mt-3 text-4xl font-bold text-red-300">{error}</h2>
            <p className="mt-2 text-xs text-red-200/60">Ação necessária</p>
          </div>

          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6 shadow-xl shadow-black/10">
            <p className="text-sm text-blue-300">MRR</p>
            <h2 className="mt-3 text-3xl font-bold text-blue-300">
              R$ {mrr.toFixed(2)}
            </h2>
            <p className="mt-2 text-xs text-blue-200/60">Receita mensal</p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Clientes monitorados</h3>
              <p className="text-sm text-zinc-400">
                Últimos clientes cadastrados e situação atual do backup.
              </p>
            </div>

            <a
              href="/clients/new"
              className="rounded-xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Novo cliente
            </a>
          </div>

          {clients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-zinc-400">Nenhum cliente cadastrado ainda.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase text-zinc-400">
                  <tr>
                    <th className="px-4 py-4">Cliente</th>
                    <th className="px-4 py-4">Plano</th>
                    <th className="px-4 py-4">Valor</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Último backup</th>
                    <th className="px-4 py-4">Máquina</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {clients.map((client) => {
                    const status = getStatus(client);

                    return (
                      <tr
                        key={client.id}
                        className="bg-black/10 transition hover:bg-white/[0.03]"
                      >
                        <td className="px-4 py-4">
                          <a
                            href={`/clients/${client.id}`}
                            className="font-medium text-white hover:text-blue-300"
                          >
                            {client.name}
                          </a>
                          <p className="mt-1 text-xs text-zinc-500">
                            {client.email || "Sem email"}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-zinc-300">
                          {client.plan}
                        </td>

                        <td className="px-4 py-4 text-zinc-300">
                          R$ {Number(client.monthlyValue).toFixed(2)}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                              status
                            )}`}
                          >
                            {statusLabel(status)}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-zinc-300">
                          {client.lastBackupAt
                            ? new Date(client.lastBackupAt).toLocaleString(
                                "pt-BR"
                              )
                            : "Sem backup"}
                        </td>

                        <td className="px-4 py-4 text-zinc-400">
                          {client.machineName || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}