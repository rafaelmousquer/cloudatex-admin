"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("/api/client/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erro no login");
      return;
    }

    localStorage.setItem("client", JSON.stringify(data));

    router.push("/client/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          Área do Cliente
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Acesse o painel do seu backup
        </p>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="border rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}