"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewClientPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("basic");
  const [monthlyValue, setMonthlyValue] = useState("30");
  const [includedGb, setIncludedGb] = useState("5");
  const [extraPricePerGb, setExtraPricePerGb] = useState("2");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/clients", {
      method: "POST",
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
      }),
    });

    if (!res.ok) {
      alert("Erro ao criar cliente");
      return;
    }

    router.push("/clients");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-6">Novo Cliente</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              placeholder="Ex: Mercado Silva"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              placeholder="Ex: contato@cliente.com"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Plano</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            >
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Cobrança</h2>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Valor mensal base (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={monthlyValue}
              onChange={(e) => setMonthlyValue(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              GB incluído
            </label>
            <input
              type="number"
              step="0.1"
              value={includedGb}
              onChange={(e) => setIncludedGb(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Preço por GB extra (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={extraPricePerGb}
              onChange={(e) => setExtraPricePerGb(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          Cadastrar cliente
        </button>
      </form>
    </div>
  );
}