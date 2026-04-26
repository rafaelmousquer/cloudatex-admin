"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const client = JSON.parse(localStorage.getItem("client") || "{}");

    fetch(`/api/client/me?id=${client.id}`)
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Seu Backup</h1>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p>Status: 
          <span className={data.status === "ok" ? "text-green-600" : "text-red-600"}>
            {data.status}
          </span>
        </p>

        <p>Último backup: {new Date(data.lastBackupAt).toLocaleString()}</p>

        {data.lastBackupError && (
          <p className="text-red-500">Erro: {data.lastBackupError}</p>
        )}
      </div>
    </div>
  );
}