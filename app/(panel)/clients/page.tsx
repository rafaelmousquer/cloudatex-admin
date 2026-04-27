import { prisma } from "@/lib/prisma";

export const revalidate = 0;

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "-";

  return new Date(date).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
}

function formatStatus(status: string) {
  if (status === "ok") return "Ativo";
  if (status === "error") return "Erro";
  if (status === "warning") return "Atenção";
  if (status === "offline") return "Offline";
  return "Sem backup";
}

function bytesToGb(bytes: bigint | number | null | undefined) {
  if (!bytes) return 0;
  return Number(bytes) / 1024 / 1024 / 1024;
}

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Lista de clientes cadastrados na Cloudatex.
          </p>
        </div>

        <a
          href="/clients/new"
          className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
        >
          + Novo Cliente
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="px-4 py-4">Nome</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Plano</th>
              <th className="px-4 py-4">Mensalidade</th>
              <th className="px-4 py-4">Uso</th>
              <th className="px-4 py-4">Pagamento</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Último backup</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {clients.map((client) => {
              const usedGb = bytesToGb(client.storageUsedBytes);

              return (
                <tr key={client.id} className="hover:bg-zinc-800/60">
                  <td className="px-4 py-4 font-medium text-white">
                    {client.name}
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {client.email || "-"}
                  </td>

                  <td className="px-4 py-4 capitalize text-blue-300">
                    {client.plan}
                  </td>

                  <td className="px-4 py-4 text-zinc-300">
                    R$ {Number(client.monthlyValue).toFixed(2)}
                  </td>

                  <td className="px-4 py-4 text-zinc-300">
                    {usedGb.toFixed(2)} GB
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                      {client.paymentStatus || "pending"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                      {formatStatus(client.status)}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {formatDate(client.lastBackupAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {clients.length === 0 && (
          <div className="p-8 text-center text-zinc-400">
            Nenhum cliente cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}