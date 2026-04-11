import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Client } from "@prisma/client";

type StatusType = {
  label: string;
  class: string;
};

function getStatus(client: Client): StatusType {
  if (client.status === "error") {
    return {
      label: "Erro",
      class: "bg-red-500/20 text-red-400",
    };
  }

  if (client.status === "warning") {
    return {
      label: "Warning",
      class: "bg-yellow-500/20 text-yellow-400",
    };
  }

  if (client.status === "unknown") {
    return {
      label: "Desconhecido",
      class: "bg-gray-500/20 text-gray-400",
    };
  }

  if (!client.lastBackupAt) {
    return {
      label: "Sem backup",
      class: "bg-gray-500/20 text-gray-400",
    };
  }

  const lastBackup = new Date(client.lastBackupAt);
  const now = new Date();
  const diffHours = (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60);

  if (diffHours > 24) {
    return {
      label: "Offline",
      class: "bg-orange-500/20 text-orange-400",
    };
  }

  return {
    label: "OK",
    class: "bg-green-500/20 text-green-400",
  };
}

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Clientes</h1>

        <Link
          href="/clients/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Novo Cliente
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-6 text-gray-400">Nenhum cliente cadastrado.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-zinc-800 text-gray-400 text-sm">
              <tr>
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">Plano</th>
                <th className="p-4 text-left">Mensalidade</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Último backup</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => {
                const status = getStatus(client);

                return (
                  <tr
                    key={client.id}
                    className="border-t border-zinc-800 hover:bg-zinc-800/50"
                  >
                    <td className="p-4 text-white">
                      <Link
                        href={`/clients/${client.id}`}
                        className="hover:underline"
                      >
                        {client.name}
                      </Link>
                    </td>

                    <td className="p-4 text-blue-400 capitalize">
                      {client.plan}
                    </td>

                    <td className="p-4 text-zinc-300">
                      R$ {client.monthlyValue.toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${status.class}`}>
                        {status.label}
                      </span>
                    </td>

                    <td className="p-4 text-gray-300">
                      {client.lastBackupAt
                        ? new Date(client.lastBackupAt).toLocaleString("pt-BR")
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}