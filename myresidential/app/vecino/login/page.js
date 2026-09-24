"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VecinoLoginPage() {
  const router = useRouter();

  const [codigo, setCodigo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(event) {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
      const response = await fetch("/api/login/vecino", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo,
          usuario,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se ha podido iniciar sesión.");
      }
      
      window.location.href = "/vecino";

     } catch (error) {
    setError(error.message);
    setCargando(false);
    }
  }
    if (cargando) {
  return (
    <main className="loginLoadingPage">
      <div className="loginLoadingContent">

        <Link href="/" className="loginLogo">
          MyResidential
        </Link>

        <div className="loginSpinner"></div>

        <h2>Accediendo a tu comunidad</h2>

        <p>
          Estamos preparando tu espacio...
        </p>

      </div>
    </main>
  );
}
  return (
    <main className="loginPage">
      <div className="loginCard">

        <Link href="/" className="loginLogo">
          MyResidential
        </Link>

        <div className="loginHeading">
          <span>MI COMUNIDAD</span>
          <h1>Acceso de vecino</h1>
          <p>
            Accede al espacio privado de tu comunidad.
          </p>
        </div>

        <form className="loginForm" onSubmit={iniciarSesion}>

          <div className="loginField">
            <label htmlFor="codigo">Código de comunidad</label>
            <input
              id="codigo"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="URB107"
              required
            />
          </div>

          <div className="loginField">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="vecino1"
              required
            />
          </div>

          <div className="loginField">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="loginError">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="loginButton"
            disabled={cargando}
          >
            {cargando ? "Accediendo..." : "Entrar en mi comunidad"}
          </button>

        </form>

        <div className="loginDemo">
          <strong>Acceso demo</strong>
          <span>Código: URB107</span>
          <span>Usuario: vecino1</span>
          <span>Contraseña: demo123</span>
        </div>

        <Link href="/" className="loginBack">
          ← Volver a MyResidential
        </Link>

      </div>
    </main>
  );
}