"use client";

import { useState } from "react";

export default function NewClientPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [backupName, setBackupName] = useState("");
  const [plan, setPlan] = useState("basic");
  const [monthlyValue, setMonthlyValue] = useState("30");
  const [includedGb, setIncludedGb] = useState("5");
  const [extraPricePerGb, setExtraPricePerGb] = useState("2");
  const [loading, setLoading] = useState(false);

  function generateBackupName(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!backupName) {
      setBackupName(generateBackupName(value));
    }
  }

  async function createClient() {
    setLoading(true);

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        backupName,
        plan,
        monthlyValue,
        includedGb,
        extraPricePerGb,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Erro ao criar cliente");
      return;
    }

    alert("Cliente criado com sucesso!");
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-6">
          <a href="/dashboard" className="text-sm text-blue-300 hover:text-blue-200">
            ← Voltar ao dashboard
          </a>

          <h1 className="mt-4 text-3xl font-bold">Novo cliente</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Crie o acesso do cliente e defina o nome que será usado no Duplicati.
          </p>
        </div>

        <div className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Nome do cliente
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Mercado Teste"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Email de login
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Senha inicial
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
            />
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <label className="mb-2 block text-sm font-semibold text-blue-200">
              Backup name do Duplicati
            </label>
            <input
              className="w-full rounded-xl border border-blue-500/20 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-400"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="mercado-teste"
            />

            <p className="mt-2 text-xs text-blue-200/70">
              Use exatamente esse nome no Duplicati. O report precisa enviar
              backup-name = <strong>{backupName || "nome-do-backup"}</strong>
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Plano</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-500"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Valor mensal
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-500"
                value={monthlyValue}
                onChange={(e) => setMonthlyValue(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                GB incluídos
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-500"
                value={includedGb}
                onChange={(e) => setIncludedGb(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Preço por GB extra
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-500"
                value={extraPricePerGb}
                onChange={(e) => setExtraPricePerGb(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={createClient}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar cliente"}
          </button>
        </div>
      </div>
    </div>
  );
}