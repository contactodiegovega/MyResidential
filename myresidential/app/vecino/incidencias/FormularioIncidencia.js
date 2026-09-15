"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormularioIncidencia({ comunidadId }) {
  const router = useRouter();

  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [formulario, setFormulario] = useState({
    tipo: "Ascensor",
    descripcion: "",
    prioridad: "Media",
  });

  function actualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function enviarIncidencia(event) {
    event.preventDefault();

    setEnviando(true);
    setMensaje("");

    try {
      const response = await fetch("/api/incidencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comunidadId,
          ...formulario,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar incidencia");
      }

      setMensaje("Incidencia comunicada correctamente.");

      setFormulario({
        tipo: "Ascensor",
        descripcion: "",
        prioridad: "Media",
      });

      router.refresh();

      setTimeout(() => {
        setAbierto(false);
        setMensaje("");
      }, 1200);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <button
        className="residentPrimaryButton"
        onClick={() => setAbierto(true)}
      >
        + Comunicar incidencia
      </button>

      {abierto && (
        <div className="incidentModalOverlay">
          <div className="incidentModal">

            <div className="incidentModalHeader">
              <div>
                <span>Nueva incidencia</span>
                <h2>¿Qué ha ocurrido?</h2>
              </div>

              <button
                type="button"
                className="incidentModalClose"
                onClick={() => setAbierto(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={enviarIncidencia}>

              <div className="incidentFormGroup">
                <label htmlFor="tipo">
                  Tipo de incidencia
                </label>

                <select
                  id="tipo"
                  name="tipo"
                  value={formulario.tipo}
                  onChange={actualizarCampo}
                >
                  <option value="Ascensor">Ascensor</option>
                  <option value="Fontanería">Fontanería</option>
                  <option value="Electricidad">Electricidad</option>
                  <option value="Garaje">Garaje</option>
                  <option value="Piscina">Piscina</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Zonas comunes">
                    Zonas comunes
                  </option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="incidentFormGroup">
                <label htmlFor="descripcion">
                  Descripción
                </label>

                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={actualizarCampo}
                  placeholder="Describe brevemente qué ha ocurrido..."
                  rows={5}
                  maxLength={300}
                  required
                />

                <small>
                  {formulario.descripcion.length}/300
                </small>
              </div>

              <div className="incidentFormGroup">
                <label>Prioridad</label>

                <div className="incidentPriorityOptions">

                  {["Baja", "Media", "Alta"].map((prioridad) => (
                    <label
                      key={prioridad}
                      className={
                        formulario.prioridad === prioridad
                          ? "incidentPrioritySelected"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        name="prioridad"
                        value={prioridad}
                        checked={
                          formulario.prioridad === prioridad
                        }
                        onChange={actualizarCampo}
                      />

                      {prioridad}
                    </label>
                  ))}

                </div>
              </div>

              {mensaje && (
                <div className="incidentFormMessage">
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
                    !formulario.descripcion.trim()
                  }
                >
                  {enviando
                    ? "Enviando..."
                    : "Enviar incidencia"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}