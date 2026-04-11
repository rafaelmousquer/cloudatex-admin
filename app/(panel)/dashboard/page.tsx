import { prisma } from "@/lib/prisma";
import { Client } from "@prisma/client";

function getStatus(client: Client) {
  if (client.status === "error") return "error";

  if (!client.lastBackupAt) return "offline";

  const last = new Date(client.lastBackupAt);
  const now = new Date();

  const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

  if (diff > 24) return "offline";

  return "ok";
}

export default async function DashboardPage() {
  const clients = await prisma.client.findMany();

  const total = clients.length;
  const active = clients.filter((c) => getStatus(c) === "ok").length;
  const offline = clients.filter((c) => getStatus(c) === "offline").length;
  const error = clients.filter((c) => getStatus(c) === "error").length;

  const mrr = clients.reduce((acc, client) => {
    return acc + client.monthlyValue;
  }, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Clientes</p>
          <h2 className="text-3xl text-white font-bold">{total}</h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Ativos</p>
          <h2 className="text-3xl text-green-400 font-bold">{active}</h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Offline</p>
          <h2 className="text-3xl text-yellow-400 font-bold">{offline}</h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Erro</p>
          <h2 className="text-3xl text-red-400 font-bold">{error}</h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">MRR</p>
          <h2 className="text-3xl text-blue-400 font-bold">
            R$ {mrr.toFixed(2)}
          </h2>
        </div>
      </div>
    </div>
  );
}