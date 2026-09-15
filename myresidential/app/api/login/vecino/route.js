import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { codigo, usuario, password } = await request.json();

    if (
      codigo.toUpperCase() !== "URB107" ||
      usuario !== "vecino1" ||
      password !== "demo123"
    ) {
      return Response.json(
        { error: "Datos de acceso incorrectos." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("vecino_session", "vecino_12922", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error("Error login vecino:", error);

    return Response.json(
      { error: "No se ha podido iniciar sesión." },
      { status: 500 }
    );
  }
}