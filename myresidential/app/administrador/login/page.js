"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(event) {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
      const response = await fetch("/api/login/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se ha podido iniciar sesión.");
      }

      router.push("/administrador");
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="loginPage">
      <div className="loginCard">

        <Link href="/" className="loginLogo">
          MyResidential
        </Link>

        <div className="loginHeading">
          <span>ACCESO PROFESIONAL</span>
          <h1>Panel de administrador</h1>
          <p>
            Accede a la gestión de tus comunidades.
          </p>
        </div>

        <form className="loginForm" onSubmit={iniciarSesion}>

          <div className="loginField">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@urbalia.es"
              required
            />
          </div>

          <div className="loginField">
            <label htmlFor="password">Contraseña</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            {cargando ? "Accediendo..." : "Acceder al panel"}
          </button>

        </form>

        <div className="loginDemo">
          <strong>Acceso demo</strong>
          <span>admin@urbalia.es</span>
          <span>Contraseña: demo123</span>
        </div>

        <Link href="/" className="loginBack">
          ← Volver a MyResidential
        </Link>

      </div>
    </main>
  );
}