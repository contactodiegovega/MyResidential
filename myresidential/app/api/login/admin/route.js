import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (
      email !== "admin@urbalia.es" ||
      password !== "demo123"
    ) {
      return Response.json(
        { error: "Email o contraseña incorrectos." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("admin_session", "urbalia_demo", {
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
    console.error("Error login administrador:", error);

    return Response.json(
      { error: "No se ha podido iniciar sesión." },
      { status: 500 }
    );
  }
}