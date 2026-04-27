"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert(data.error || "Login inválido");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">
            Painel Administrativo
          </h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

      </div>
    </main>
  );
}