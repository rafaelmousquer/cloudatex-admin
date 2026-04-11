import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-black text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Cloudatex</h1>
        <p className="text-sm text-gray-300 mt-1">Painel Admin</p>
      </div>

      <nav className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg px-4 py-3 hover:bg-white/10 transition"
        >
          Dashboard
        </Link>

        <Link
          href="/clients"
          className="rounded-lg px-4 py-3 hover:bg-white/10 transition"
        >
          Clientes
        </Link>

        <Link
          href="/clients/new"
          className="rounded-lg px-4 py-3 hover:bg-white/10 transition"
        >
          Novo Cliente
        </Link>
      </nav>
    </aside>
  );
}