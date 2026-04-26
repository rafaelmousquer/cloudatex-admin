"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("/api/login", {
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

    // 🔥 REDIRECIONA
    if (data.role === "admin") {
      router.push("/dashboard");
    } else {
      router.push("/client/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold">
          Cloudatex
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Login do sistema
        </p>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="rounded-lg border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="rounded-lg border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}