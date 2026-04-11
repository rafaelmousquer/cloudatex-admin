import Link from "next/link";
import type { ReactNode } from "react";
import LogoutButton from "@/components/LogoutButton";

export default function PanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col">
          <div className="px-6 py-6 border-b border-zinc-800">
            <h1 className="text-2xl font-bold tracking-tight">Cloudatex</h1>
            <p className="text-sm text-zinc-400 mt-1">Painel Admin</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/dashboard"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              Dashboard
            </Link>

            <Link
              href="/clients"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              Clientes
            </Link>

            <Link
              href="/clients/new"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              Novo Cliente
            </Link>
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <div className="rounded-xl bg-zinc-900 p-4">
              <p className="text-sm font-medium">Cloudatex v1</p>
              <p className="text-xs text-zinc-400 mt-1">
                Backup e monitoramento
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="border-b border-zinc-800 px-8 py-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-200">
              Painel administrativo
            </h2>

            <LogoutButton />
          </div>

          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}