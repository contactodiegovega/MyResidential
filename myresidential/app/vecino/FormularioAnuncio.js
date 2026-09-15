"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormularioAnuncio({
  comunidadId,
  viviendaId,
}) {
  const router = useRouter();

  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);

  const [formulario, setFormulario] = useState({
    titular: "",
    texto: "",
  });

  function actualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function publicarAnuncio(event) {
    event.preventDefault();

    setEnviando(true);
    setMensaje("");
    setEsError(false);

    try {
      const response = await fetch("/api/anuncios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comunidadId,
          viviendaId,
          ...formulario,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se ha podido publicar."
        );
      }

      setMensaje("Anuncio publicado correctamente.");

      setFormulario({
        titular: "",
        texto: "",
      });

      router.refresh();

      setTimeout(() => {
        setAbierto(false);
        setMensaje("");
      }, 1000);
    } catch (error) {
      setEsError(true);
      setMensaje(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <button
        className="boardPublishButton"
        onClick={() => setAbierto(true)}
      >
        + Publicar anuncio
      </button>

      {abierto && (
        <div className="incidentModalOverlay">
          <div className="incidentModal">

            <div className="incidentModalHeader">
              <div>
                <span>Tablón de la comunidad</span>
                <h2>Publicar anuncio</h2>
              </div>

              <button
                type="button"
                className="incidentModalClose"
                onClick={() => setAbierto(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={publicarAnuncio}>

              <div className="incidentFormGroup">
                <label htmlFor="titular">
                  Titular
                </label>

                <input
                  id="titular"
                  type="text"
                  name="titular"
                  value={formulario.titular}
                  onChange={actualizarCampo}
                  placeholder="Ej. Se alquila plaza de garaje"
                  maxLength={150}
                  required
                  className="reservationInput"
                />
              </div>

              <div className="incidentFormGroup">
                <label htmlFor="texto">
                  Texto
                </label>

                <textarea
                  id="texto"
                  name="texto"
                  value={formulario.texto}
                  onChange={actualizarCampo}
                  placeholder="Escribe tu anuncio..."
                  maxLength={500}
                  rows={5}
                  required
                />

                <small>
                  {formulario.texto.length}/500
                </small>
              </div>

              {mensaje && (
                <div
                  className={
                    esError
                      ? "reservationMessage reservationMessageError"
                      : "reservationMessage"
                  }
                >
                  {mensaje}
                </div>
              )}

              <div className="incidentModalActions">

                <button
                  type="button"
                  className="incidentCancelButton"
                  onClick={() => setAbierto(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="incidentSubmitButton"
                  disabled={
                    enviando ||
                    !formulario.titular.trim() ||
                    !formulario.texto.trim()
                  }
                >
                  {enviando ? "Publicando..." : "Publicar"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}