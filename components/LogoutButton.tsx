export default function LogoutButton() {
  return (
    <a
      href="/api/admin/logout"
      className="rounded-xl bg-red-600 px-4 py-2 text-white"
    >
      Sair
    </a>
  );
}