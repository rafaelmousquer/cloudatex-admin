import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

function getStatus(client: any) {
  if (client.status === "error") return "error";
  if (client.status === "warning") return "warning";
  if (!client.lastBackupAt) return "offline";

  const diff =
    (new Date().getTime() - new Date(client.lastBackupAt).getTime()) /
    (1000 * 60 * 60);

  if (diff > 24) return "offline";

  return "ok";
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

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-xl rounded-2xl bg-slate-900 p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Seu Backup</h1>

        <p className="mb-2">
          <strong>Status:</strong>{" "}
          <span className="capitalize">{getStatus(client)}</span>
        </p>

        <p className="mb-4">
          <strong>Último backup:</strong>{" "}
          {client.lastBackupAt
            ? new Date(client.lastBackupAt).toLocaleString("pt-BR")
            : "Sem backup"}
        </p>

        <form action="/api/client/logout" method="POST">
          <button className="mt-4 w-full rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700">
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}