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
    window.location.href = "/clients";
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <a href="/clients" className="text-sm text-blue-300 hover:text-blue-200">
          ← Voltar para clientes
        </a>

        <h1 className="mt-4 text-3xl font-bold">Novo Cliente</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Crie o acesso do cliente e defina o nome usado no Duplicati.
        </p>

        <div className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div>
            <label className="text-sm text-zinc-400">Nome</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Mercado Silva"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Email de login</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@email.com"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Senha inicial</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <label className="text-sm font-semibold text-blue-300">
              Backup Name do Duplicati
            </label>

            <input
              className="mt-1 w-full rounded-xl border border-blue-500/30 bg-black/30 p-3 text-white outline-none focus:border-blue-400"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="mercado-silva"
            />

            <p className="mt-2 text-xs text-blue-200/70">
              Use exatamente esse nome no Duplicati:{" "}
              <b>{backupName || "nome-do-backup"}</b>
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm text-zinc-400">Plano</label>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-blue-500"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Valor mensal</label>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-blue-500"
                value={monthlyValue}
                onChange={(e) => setMonthlyValue(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">GB incluídos</label>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-blue-500"
                value={includedGb}
                onChange={(e) => setIncludedGb(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Preço por GB extra</label>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-blue-500"
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
            {loading ? "Criando..." : "Criar Cliente"}
          </button>
        </div>
      </div>
    </div>
  );
}