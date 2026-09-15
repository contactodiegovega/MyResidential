"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormularioReserva({
  comunidadId,
  viviendaId,
  tienePiscina,
  tieneJardin,
}) {
  const router = useRouter();

  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);

  const [formulario, setFormulario] = useState({
    espacio: tienePiscina ? "Piscina" : "Sala comunitaria",
    fechaReserva: "",
    horaInicio: "",
    horaFin: "",
  });

  function actualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function enviarReserva(event) {
    event.preventDefault();

    setEnviando(true);
    setMensaje("");
    setEsError(false);

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viviendaId,
          comunidadId,
          ...formulario,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se ha podido realizar la reserva."
        );
      }

      setMensaje("Reserva confirmada correctamente.");

      setFormulario({
        espacio: tienePiscina ? "Piscina" : "Sala comunitaria",
        fechaReserva: "",
        horaInicio: "",
        horaFin: "",
      });

      router.refresh();

      setTimeout(() => {
        setAbierto(false);
        setMensaje("");
      }, 1200);
    } catch (error) {
      setEsError(true);
      setMensaje(error.message);
    } finally {
      setEnviando(false);
    }
  }

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <>
      <button
        className="residentPrimaryButton"
        onClick={() => setAbierto(true)}
      >
        + Nueva reserva
      </button>

      {abierto && (
        <div className="incidentModalOverlay">
          <div className="incidentModal">

            <div className="incidentModalHeader">
              <div>
                <span>Nueva reserva</span>
                <h2>Reserva un espacio</h2>
              </div>

              <button
                type="button"
                className="incidentModalClose"
                onClick={() => setAbierto(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={enviarReserva}>

              <div className="incidentFormGroup">
                <label htmlFor="espacio">
                  Espacio
                </label>

                <select
                  id="espacio"
                  name="espacio"
                  value={formulario.espacio}
                  onChange={actualizarCampo}
                  required
                >
                  {tienePiscina && (
                    <option value="Piscina">Piscina</option>
                  )}

                  <option value="Sala comunitaria">
                    Sala comunitaria
                  </option>

                  {tieneJardin && (
                    <option value="Zona común">
                      Zona común
                    </option>
                  )}
                </select>
              </div>

              <div className="incidentFormGroup">
                <label htmlFor="fechaReserva">
                  Fecha
                </label>

                <input
                  id="fechaReserva"
                  type="date"
                  name="fechaReserva"
                  min={hoy}
                  value={formulario.fechaReserva}
                  onChange={actualizarCampo}
                  required
                  className="reservationInput"
                />
              </div>

              <div className="reservationTimeGrid">

                <div className="incidentFormGroup">
                  <label htmlFor="horaInicio">
                    Hora de inicio
                  </label>

                  <input
                    id="horaInicio"
                    type="time"
                    name="horaInicio"
                    value={formulario.horaInicio}
                    onChange={actualizarCampo}
                    required
                    className="reservationInput"
                  />
                </div>

                <div className="incidentFormGroup">
                  <label htmlFor="horaFin">
                    Hora de fin
                  </label>

                  <input
                    id="horaFin"
                    type="time"
                    name="horaFin"
                    value={formulario.horaFin}
                    onChange={actualizarCampo}
                    required
                    className="reservationInput"
                  />
                </div>

              </div>

              <div className="reservationHomeInfo">
                <span>🏠</span>

                <div>
                  <strong>Vivienda asociada</strong>
                  <p>Portal A · 2ºC</p>
                </div>
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
                    !formulario.fechaReserva ||
                    !formulario.horaInicio ||
                    !formulario.horaFin
                  }
                >
                  {enviando
                    ? "Reservando..."
                    : "Confirmar reserva"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}