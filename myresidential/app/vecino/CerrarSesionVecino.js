"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CerrarSesionVecino() {
  const router = useRouter();
  const [cerrando, setCerrando] = useState(false);

  async function cerrarSesion() {
    setCerrando(true);

    try {
      const response = await fetch("/api/logout/vecino", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("No se ha podido cerrar sesión.");
      }

      router.push("/vecino/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      setCerrando(false);
    }
  }

  return (
    <button
      type="button"
      className="residentLogoutButton"
      onClick={cerrarSesion}
      disabled={cerrando}
    >
      {cerrando ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}