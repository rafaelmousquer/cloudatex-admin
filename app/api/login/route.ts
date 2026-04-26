import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  console.log("LOGIN:", email, password);

  // 🔥 ADMIN FORÇADO
  if (email === "admin@cloudatex.com" && password === "123456") {
    const res = NextResponse.json({ role: "admin" });

    res.cookies.set("user_id", "admin", {
      path: "/",
    });

    res.cookies.set("user_role", "admin", {
      path: "/",
    });

    return res;
  }

  // 🔥 CLIENTE FORÇADO (TESTE)
  if (email === "rafael@teste.com" && password === "123456") {
    const res = NextResponse.json({ role: "client" });

    res.cookies.set("user_id", "client", {
      path: "/",
    });

    res.cookies.set("user_role", "client", {
      path: "/",
    });

    return res;
  }

  return NextResponse.json(
    { error: "Credenciais inválidas" },
    { status: 401 }
  );
}