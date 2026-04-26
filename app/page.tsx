"use client";

export default function Page() {
  return (
    <div style={{ padding: 40 }}>
      <h1>TESTE FUNCIONANDO</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Ir pro Admin
      </button>

      <button onClick={() => (window.location.href = "/client/dashboard")}>
        Ir pro Cliente
      </button>
    </div>
  );
}