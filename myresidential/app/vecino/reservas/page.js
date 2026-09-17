import Link from "next/link";
import { getConnection } from "../../../lib/db";
import FormularioReserva from "./FormularioReserva";
export const dynamic = "force-dynamic";
export default async function ReservasVecinoPage() {
  // Temporal hasta que hagamos el login
  const comunidadId = 107;
  const viviendaId = 12922;

  const pool = await getConnection();

  const comunidadResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT
        nombre,
        direccion,
        piscina,
        jardin
      FROM comunidades
      WHERE comunidad_id = @id
    `);

  const comunidad = comunidadResult.recordset[0];

  const reservasResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT
        reserva_id,
        vivienda_id,
        espacio,
        fecha_reserva,
        CONVERT(VARCHAR(5), hora_inicio, 108) AS hora_inicio,
        CONVERT(VARCHAR(5), hora_fin, 108) AS hora_fin,
        estado
        FROM reservas
      WHERE comunidad_id = @id
      ORDER BY fecha_reserva DESC, hora_inicio DESC
    `);

  const reservas = reservasResult.recordset;

    const ahora = new Date();

    function obtenerFechaHoraFin(reserva) {
    const fecha = new Date(reserva.fecha_reserva);

    const [horas, minutos] = String(reserva.hora_fin)
        .slice(0, 5)
        .split(":")
        .map(Number);

    fecha.setHours(horas, minutos, 0, 0);

    return fecha;
    }

    const proximasReservas = reservas
    .filter((reserva) => {
        if (reserva.estado === "Cancelada") {
        return false;
        }

        return obtenerFechaHoraFin(reserva) > ahora;
    })
    .sort(
        (a, b) =>
        obtenerFechaHoraFin(a) - obtenerFechaHoraFin(b)
    );

    const historial = reservas
    .filter((reserva) => {
        return (
        reserva.estado === "Cancelada" ||
        obtenerFechaHoraFin(reserva) <= ahora
        );
    })
    .sort(
        (a, b) =>
        obtenerFechaHoraFin(b) - obtenerFechaHoraFin(a)
    )
    .slice(0, 10);

 function formatearHora(hora) {
  if (!hora) return "";

  // Si mssql devuelve un Date
  if (hora instanceof Date) {
    const horas = String(hora.getUTCHours()).padStart(2, "0");
    const minutos = String(hora.getUTCMinutes()).padStart(2, "0");

    return `${horas}:${minutos}`;
  }

  // Si devuelve texto
  const texto = String(hora);

  // Formato HH:MM:SS
  const coincidencia = texto.match(/(\d{2}):(\d{2}):\d{2}/);

  if (coincidencia) {
    return `${coincidencia[1]}:${coincidencia[2]}`;
  }

  return texto;
}

  return (
    <div className="socialLayout">

      {/* SIDEBAR */}

      <aside className="socialSidebar">
        <Link href="/" className="socialLogo">
          MyResidential
        </Link>

        <div className="socialProfile">
          <div className="socialAvatar">V</div>

          <div>
            <strong>Vecino</strong>
            <span>{comunidad.nombre}</span>
          </div>
        </div>

        <nav className="socialNav">
          <Link href="/vecino">Inicio</Link>

          <Link href="/vecino/incidencias">
            Incidencias
          </Link>

          <Link
            href="/vecino/reservas"
            className="socialNavActive"
          >
            Reservas
          </Link>

          <Link href="/vecino/gastos">
            Gastos
          </Link>

          <Link href="/vecino/contratos">
            Contratos
          </Link>
        </nav>

        <div className="socialSidebarBottom">
          <Link href="/">← Volver a MyResidential</Link>
        </div>
      </aside>


      {/* CONTENIDO */}

      <main className="socialMain">

        <header className="residentPageHeader">
          <div>
            <p className="socialEyebrow">Mi comunidad</p>

            <h1>Reservas</h1>

            <p>
              Reserva y consulta los espacios comunes de tu
              comunidad.
            </p>
          </div>

          <FormularioReserva
            comunidadId={comunidadId}
            viviendaId={viviendaId}
            tienePiscina={Boolean(comunidad.piscina)}
            tieneJardin={Boolean(comunidad.jardin)}
            />
        </header>


        {/* ESPACIOS */}

        <section className="residentSection">

          <div className="residentSectionHeader">
            <div>
              <h2>Espacios comunes</h2>
              <p>
                Consulta los espacios disponibles para los vecinos.
              </p>
            </div>
          </div>

          <div className="reservationSpaces">

            {comunidad.piscina && (
              <article className="reservationSpaceCard">
                <div className="reservationSpaceIcon">
                  🏊
                </div>

                <div>
                  <h3>Piscina</h3>
                  <p>
                    Reserva tu franja para acceder a la piscina
                    comunitaria.
                  </p>
                </div>

                <span>Disponible</span>
              </article>
            )}

            <article className="reservationSpaceCard">
              <div className="reservationSpaceIcon">
                🏠
              </div>

              <div>
                <h3>Sala comunitaria</h3>
                <p>
                  Espacio para reuniones y actividades de la
                  comunidad.
                </p>
              </div>

              <span>Disponible</span>
            </article>

            {comunidad.jardin && (
              <article className="reservationSpaceCard">
                <div className="reservationSpaceIcon">
                  🌿
                </div>

                <div>
                  <h3>Zona común</h3>
                  <p>
                    Reserva una franja para actividades en la zona
                    común.
                  </p>
                </div>

                <span>Disponible</span>
              </article>
            )}

          </div>
        </section>


        {/* PRÓXIMAS RESERVAS */}

        <section className="residentSection">

          <div className="residentSectionHeader">
            <div>
              <h2>Próximas reservas</h2>
              <p>
                Reservas programadas actualmente en tu comunidad.
              </p>
            </div>
          </div>

          {proximasReservas.length === 0 ? (
            <div className="residentEmptyState">
              <span>📅</span>

              <strong>No hay próximas reservas</strong>

              <p>
                Cuando realices una reserva aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="reservationList">

              {proximasReservas.slice(0, 8).map((reserva) => (
                <article
                  className="reservationCard"
                  key={reserva.reserva_id}
                >
                  <div className="reservationDate">
                    <strong>
                      {new Date(
                        reserva.fecha_reserva
                      ).toLocaleDateString("es-ES", {
                        day: "2-digit",
                      })}
                    </strong>

                    <span>
                      {new Date(
                        reserva.fecha_reserva
                      )
                        .toLocaleDateString("es-ES", {
                          month: "short",
                        })
                        .replace(".", "")}
                    </span>
                  </div>

                  <div className="reservationInfo">
                    <h3>{reserva.espacio}</h3>

                    <p>
                      {formatearHora(reserva.hora_inicio)}
                      {" — "}
                      {formatearHora(reserva.hora_fin)}
                    </p>
                  </div>

                  <div className="reservationStatus">
                    {reserva.estado}
                  </div>
                </article>
              ))}

            </div>
          )}
        </section>


        {/* HISTORIAL */}

        <section className="residentSection">

          <div className="residentSectionHeader">
            <div>
              <h2>Historial</h2>
              <p>Últimas reservas de la comunidad.</p>
            </div>
          </div>

          <div className="residentHistory">

            {historial.length === 0 ? (
              <div className="reservationNoHistory">
                Todavía no hay reservas anteriores.
              </div>
            ) : (
              historial.map((reserva) => (
                <div
                  className="residentHistoryRow"
                  key={reserva.reserva_id}
                >
                  <div className="residentHistoryIcon">
                    ✓
                  </div>

                  <div className="residentHistoryContent">
                    <strong>{reserva.espacio}</strong>

                    <span>
                      {formatearHora(reserva.hora_inicio)}
                      {" — "}
                      {formatearHora(reserva.hora_fin)}
                    </span>
                  </div>

                  <div className="residentHistoryDate">
                    <span>
                    {reserva.estado === "Cancelada"
                        ? "Cancelada"
                        : "Finalizada"}
                    </span>

                    <small>
                      {new Date(
                        reserva.fecha_reserva
                      ).toLocaleDateString("es-ES")}
                    </small>
                  </div>
                </div>
              ))
            )}

          </div>
        </section>

      </main>
    </div>
  );
}