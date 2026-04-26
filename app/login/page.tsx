"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  function handleLogin() {
    console.log("clicou", email);

    if (email === "admin@cloudatex.com") {
      window.location.href = "/dashboard";
      return;
    }

    window.location.href = "/client/dashboard";
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 8, marginRight: 10 }}
      />

      <button
        type="button"
        onClick={handleLogin}
        style={{ padding: 8 }}
      >
        Entrar
      </button>
    </div>
  );
}