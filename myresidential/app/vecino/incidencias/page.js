import Link from "next/link";
import { getConnection } from "../../../lib/db";
import FormularioIncidencia from "./FormularioIncidencia";

export default async function IncidenciasVecinoPage() {
  // Temporalmente comunidad fija.
  // Después vendrá del login del vecino.
  const comunidadId = 107;

  const pool = await getConnection();

  const comunidadResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT nombre, direccion
      FROM comunidades
      WHERE comunidad_id = @id
    `);

  const comunidad = comunidadResult.recordset[0];

  const incidenciasResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT
        incidencia_id,
        tipo,
        descripcion,
        fecha_apertura,
        fecha_cierre,
        estado,
        prioridad,
        coste
      FROM incidencias
      WHERE comunidad_id = @id
      ORDER BY
        CASE
          WHEN estado = 'Abierta' THEN 1
          ELSE 2
        END,
        fecha_apertura DESC
    `);

  const incidencias = incidenciasResult.recordset;

  const abiertas = incidencias.filter(
    (incidencia) => incidencia.estado === "Abierta"
  );

  const cerradas = incidencias.filter(
    (incidencia) => incidencia.estado !== "Abierta"
  );

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
          <Link href="/vecino">
            Inicio
          </Link>

          <Link
            href="/vecino/incidencias"
            className="socialNavActive"
          >
            Incidencias
          </Link>

          <Link href="/vecino/reservas">
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

            <h1>Incidencias</h1>

            <p>
              Consulta el estado de las incidencias de tu comunidad
              o comunica una nueva.
            </p>
          </div>

          <FormularioIncidencia comunidadId={comunidadId} />
        </header>


        {/* RESUMEN */}

        <section className="residentSummary">
          <div>
            <strong>{incidencias.length}</strong>
            <span>Total incidencias</span>
          </div>

          <div>
            <strong>{abiertas.length}</strong>
            <span>En seguimiento</span>
          </div>

          <div>
            <strong>{cerradas.length}</strong>
            <span>Resueltas</span>
          </div>
        </section>


        {/* ABIERTAS */}

        <section className="residentSection">

          <div className="residentSectionHeader">
            <div>
              <h2>En seguimiento</h2>
              <p>
                Incidencias que todavía están siendo gestionadas.
              </p>
            </div>
          </div>

          <div className="residentIncidentGrid">

            {abiertas.length === 0 ? (
              <div className="residentEmptyState">
                <span>✓</span>
                <strong>No hay incidencias abiertas</strong>
                <p>
                  Actualmente no existen incidencias pendientes
                  en tu comunidad.
                </p>
              </div>
            ) : (
              abiertas.map((incidencia) => (
                <article
                  className="residentIncidentCard"
                  key={incidencia.incidencia_id}
                >
                  <div className="residentIncidentTop">
                    <div className="residentIncidentIcon">
                      🔧
                    </div>

                    <div className="residentIncidentStatus">
                      En seguimiento
                    </div>
                  </div>

                  <h3>{incidencia.tipo}</h3>

                  <p>{incidencia.descripcion}</p>

                  <div className="residentIncidentMeta">
                    <span>
                      Prioridad:{" "}
                      <strong>{incidencia.prioridad}</strong>
                    </span>

                    <span>
                      {new Date(
                        incidencia.fecha_apertura
                      ).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </article>
              ))
            )}

          </div>
        </section>


        {/* HISTORIAL */}

        <section className="residentSection">

          <div className="residentSectionHeader">
            <div>
              <h2>Historial</h2>
              <p>Incidencias que ya han sido gestionadas.</p>
            </div>
          </div>

          <div className="residentHistory">

            {cerradas.map((incidencia) => (
              <div
                className="residentHistoryRow"
                key={incidencia.incidencia_id}
              >
                <div className="residentHistoryIcon">
                  ✓
                </div>

                <div className="residentHistoryContent">
                  <strong>{incidencia.tipo}</strong>
                  <span>{incidencia.descripcion}</span>
                </div>

                <div className="residentHistoryDate">
                  <span>Resuelta</span>

                  <small>
                    {incidencia.fecha_cierre
                      ? new Date(
                          incidencia.fecha_cierre
                        ).toLocaleDateString("es-ES")
                      : "Finalizada"}
                  </small>
                </div>
              </div>
            ))}

          </div>
        </section>

      </main>
    </div>
  );
}