import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client || !client.password) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, client.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "Login OK",
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
      },
    });

    response.cookies.set("client_id", client.id, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro no login" },
      { status: 500 }
    );
  }
}