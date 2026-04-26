import { prisma } from "@/lib/prisma";

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

  const last = new Date(client.lastBackupAt);
  const now = new Date();
  const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

  if (diffHours > 24) return "offline";

  return "ok";
}

export default async function DashboardPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  });

  const total = clients.length;
  const active = clients.filter((c) => getStatus(c as ClientRow) === "ok").length;
  const offline = clients.filter((c) => getStatus(c as ClientRow) === "offline").length;
  const error = clients.filter((c) => getStatus(c as ClientRow) === "error").length;

  const mrr = clients.reduce((acc, client) => {
    return acc + Number(client.monthlyValue || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Clientes</p>
          <h2 className="mt-2 text-4xl font-bold text-white">{total}</h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Ativos</p>
          <h2 className="mt-2 text-4xl font-bold text-green-400">{active}</h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Offline</p>
          <h2 className="mt-2 text-4xl font-bold text-yellow-400">{offline}</h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Erro</p>
          <h2 className="mt-2 text-4xl font-bold text-red-400">{error}</h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">MRR</p>
          <h2 className="mt-2 text-4xl font-bold text-blue-400">
            R$ {mrr.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="text-lg font-semibold text-white">Clientes recentes</h3>

        {clients.length === 0 ? (
          <p className="mt-4 text-zinc-400">Nenhum cliente cadastrado.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {clients.slice(0, 5).map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{client.name}</p>
                  <p className="text-sm text-zinc-400">
                    {client.plan} • R$ {Number(client.monthlyValue).toFixed(2)}
                  </p>
                </div>

                <div className="text-sm text-zinc-400">
                  {client.lastBackupAt
                    ? new Date(client.lastBackupAt).toLocaleString("pt-BR")
                    : "Sem backup"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}