import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Cloudatex</h1>
          <p className="text-zinc-400 mt-2">
            Backup seguro na nuvem
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/client/login"
            className="block w-full text-center rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 transition"
          >
            Área do Cliente
          </Link>

          <Link
            href="/admin/login"
            className="block w-full text-center rounded-xl border border-zinc-700 py-3 font-medium text-zinc-300 hover:bg-zinc-800 transition"
          >
            Área Administrativa
          </Link>
        </div>

      </div>
    </main>
  );
}