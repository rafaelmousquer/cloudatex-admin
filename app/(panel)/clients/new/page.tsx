"use client";

import { useState } from "react";

export default function NewClientPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [backupName, setBackupName] = useState("");
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
          ← Voltar
        </a>

        <h1 className="mt-4 text-3xl font-bold">Novo Cliente</h1>

        <div className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6">

          <div>
            <label className="text-sm text-zinc-400">Nome</label>
            <input
              className="mt-1 w-full rounded-xl bg-black/30 p-3"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Mercado Silva"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Email</label>
            <input
              className="mt-1 w-full rounded-xl bg-black/30 p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@email.com"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Senha</label>
            <input
              className="mt-1 w-full rounded-xl bg-black/30 p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-blue-300 font-semibold">
              Backup Name (Duplicati)
            </label>

            <input
              className="mt-1 w-full rounded-xl bg-black/30 p-3 border border-blue-500/30"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
            />

            <p className="mt-2 text-xs text-blue-200/70">
              Use esse nome no Duplicati: <b>{backupName || "nome-do-backup"}</b>
            </p>
          </div>

          <button
            onClick={createClient}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-500"
          >
            {loading ? "Criando..." : "Criar Cliente"}
          </button>

        </div>
      </div>
    </div>
  );
}