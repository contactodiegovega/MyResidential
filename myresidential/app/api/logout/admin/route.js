import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("admin_session");

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error("Error cerrando sesión:", error);

    return Response.json(
      { error: "No se ha podido cerrar sesión." },
      { status: 500 }
    );
  }
}