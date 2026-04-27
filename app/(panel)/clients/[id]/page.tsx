"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Client = {
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
  lastBackupAt: string | null;
  lastBackupError: string | null;
  createdAt: string;
};

function formatBackupError(raw: string | null) {
  if (!raw) return "-";

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed?.LogLines) && parsed.LogLines.length > 0) {
      return parsed.LogLines.join("\n\n");
    }

    if (typeof parsed?.Exception === "string" && parsed.Exception.trim() !== "") {
      return parsed.Exception;
    }

    if (typeof parsed?.Message === "string" && parsed.Message.trim() !== "") {
      return parsed.Message;
    }

    return raw;
  } catch {
    return raw;
  }
}

export default function ClientPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("basic");
  const [monthlyValue, setMonthlyValue] = useState("30");
  const [includedGb, setIncludedGb] = useState("5");
  const [extraPricePerGb, setExtraPricePerGb] = useState("2");
  const [status, setStatus] = useState("unknown");
  // PIX
const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null);
const [loadingPix, setLoadingPix] = useState(false);

  useEffect(() => {
    async function loadClient() {
      try {
        const res = await fetch(`/api/clients/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("ERRO AO CARREGAR CLIENTE:", data);
          setClient(null);
          setLoading(false);
          return;
        }

        setClient(data);
        setName(data.name);
        setEmail(data.email || "");
        setPlan(data.plan);
        setMonthlyValue(String(data.monthlyValue));
        setIncludedGb(String(data.includedGb));
        setExtraPricePerGb(String(data.extraPricePerGb));
        setStatus(data.status);
      } catch (error) {
        console.error("ERRO FETCH CLIENT:", error);
        setClient(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadClient();
    }
  }, [id]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          plan,
          monthlyValue,
          includedGb,
          extraPricePerGb,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("ERRO SALVAR:", data);
        alert("Erro ao salvar cliente");
        return;
      }

      router.push("/clients");
      router.refresh();
    } catch (error) {
      console.error("ERRO SAVE FETCH:", error);
      alert("Erro ao salvar cliente");
    }
  }

  async function handleDelete() {
    const ok = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("ERRO DELETE:", data);
        alert("Erro ao excluir cliente");
        return;
      }

      router.push("/clients");
      router.refresh();
    } catch (error) {
      console.error("ERRO DELETE FETCH:", error);
      alert("Erro ao excluir cliente");
    }
  }

  // GERAR PIX (ASAAS)
async function handleGeneratePix() {
  setLoadingPix(true);

  try {
    const res = await fetch("/api/asaas/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("ERRO PIX:", data);
      alert("Erro ao gerar cobrança");
      return;
    }

    setPixCopyPaste(data.client.pixCopyPaste);
    alert("Cobrança Pix gerada!");
  } catch (error) {
    console.error("ERRO FETCH PIX:", error);
    alert("Erro ao gerar cobrança");
  } finally {
    setLoadingPix(false);
  }
}

  if (loading) {
    return <main className="p-8 text-white">Carregando...</main>;
  }

  if (!client) {
    return <main className="p-8 text-white">Cliente não encontrado</main>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Editar Cliente</h1>
        <p className="text-zinc-400 mt-2">
          Ajuste dados, cobrança e status do cliente
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Dados do cliente</h2>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Nome</label>
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Plano</label>
            <select
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Status</label>
            <select
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="unknown">Unknown</option>
              <option value="ok">OK</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Cobrança</h2>

          <div className="mt-4">
  <button
    type="button"
    onClick={handleGeneratePix}
    disabled={loadingPix}
    className="w-full rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
  >
    {loadingPix ? "Gerando..." : "Gerar cobrança Pix"}
  </button>
</div>

{pixCopyPaste && (
  <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300 break-all">
    <p className="mb-2 text-zinc-400">Pix copia e cola:</p>
    {pixCopyPaste}
  </div>
)}

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Valor mensal base (R$)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white"
              value={monthlyValue}
              onChange={(e) => setMonthlyValue(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              GB incluído
            </label>
            <input
              type="number"
              step="0.1"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white"
              value={includedGb}
              onChange={(e) => setIncludedGb(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Preço por GB extra (R$)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white"
              value={extraPricePerGb}
              onChange={(e) => setExtraPricePerGb(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-white">Backup</h2>

          <p className="text-zinc-400">
            <span className="text-white font-medium">Máquina:</span>{" "}
            {client.machineName || "-"}
          </p>

          <p className="text-zinc-400">
            <span className="text-white font-medium">Backup:</span>{" "}
            {client.backupName || "-"}
          </p>

          <p className="text-zinc-400">
            <span className="text-white font-medium">Último backup:</span>{" "}
            {client.lastBackupAt
              ? new Date(client.lastBackupAt).toLocaleString("pt-BR")
              : "-"}
          </p>

          <div>
            <span className="text-white font-medium">Último erro:</span>
            <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300 whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
              {formatBackupError(client.lastBackupError)}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Salvar alterações
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Excluir cliente
            
          </button>
        </div>
      </form>
    </div>
  );
}