import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const adminSession = request.cookies.get("admin_session");

  // Permitimos acceder al login sin estar autenticado
  if (pathname === "/administrador/login") {
    // Si ya está autenticado, no tiene sentido volver al login
    if (adminSession?.value === "urbalia_demo") {
      return NextResponse.redirect(
        new URL("/administrador", request.url)
      );
    }

    return NextResponse.next();
  }

  // Protegemos todo el panel de administrador
  if (pathname.startsWith("/administrador")) {
    if (adminSession?.value !== "urbalia_demo") {
      return NextResponse.redirect(
        new URL("/administrador/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/administrador/:path*"],
};