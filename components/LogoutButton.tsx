"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const res = await fetch("/api/logout", {
      method: "POST",
    });

    if (res.ok) {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
    >
      Sair
    </button>
  );
}