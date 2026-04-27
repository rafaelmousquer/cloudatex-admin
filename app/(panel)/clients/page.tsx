import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 0;

function bytesToGb(bytes: bigint | number | null | undefined) {
  if (!bytes) return 0;
  return Number(bytes) / 1024 / 1024 / 1024;
}

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-sm text-zinc-400">
            Lista de clientes cadastrados na Cloudatex.
          </p>
        </div>

        <Link
          href="/clients/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Novo Cliente
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Plano</th>
              <th className="px-4 py-3 text-left">Mensalidade</th>
              <th className="px-4 py-3 text-left">Uso</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Último backup</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => {
              const usedGb = bytesToGb(client.storageUsedBytes);

              return (
                <tr
                  key={client.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900 transition"
                >
                  {/* 🔥 AQUI ESTÁ O MAIS IMPORTANTE */}
                  <td className="px-4 py-3 text-blue-400 font-medium">
                    <Link href={`/clients/${client.id}`}>
                      {client.name}
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-zinc-300">
                    {client.email || "-"}
                  </td>

                  <td className="px-4 py-3 text-zinc-300">
                    {client.plan}
                  </td>

                  <td className="px-4 py-3 text-zinc-300">
                    R$ {Number(client.monthlyValue).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-zinc-300">
                    {usedGb.toFixed(2)} GB
                  </td>

                  <td className="px-4 py-3 text-zinc-300">
                    {client.status}
                  </td>

                  <td className="px-4 py-3 text-zinc-300">
                    {client.lastBackupAt
                      ? new Date(client.lastBackupAt).toLocaleString("pt-BR")
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}