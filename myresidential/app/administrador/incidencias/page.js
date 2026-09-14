import Link from "next/link";
import { getConnection } from "../../../lib/db";

export default async function IncidenciasPage() {
  const pool = await getConnection();

  const resumenResult = await pool.request().query(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN estado = 'Abierta' THEN 1 ELSE 0 END) AS abiertas,
      SUM(CASE WHEN prioridad = 'Alta' THEN 1 ELSE 0 END) AS prioridad_alta,
      AVG(
        CASE
          WHEN fecha_cierre IS NOT NULL
          THEN DATEDIFF(HOUR, fecha_apertura, fecha_cierre) * 1.0
        END
      ) AS horas_resolucion
    FROM incidencias
  `);

  const resumen = resumenResult.recordset[0];

  const incidenciasResult = await pool.request().query(`
    SELECT TOP 100
      i.incidencia_id,
      i.tipo,
      i.descripcion,
      i.fecha_apertura,
      i.fecha_cierre,
      i.estado,
      i.prioridad,
      i.coste,
      c.nombre AS comunidad,
      p.nombre AS proveedor
    FROM incidencias i
    INNER JOIN comunidades c
      ON i.comunidad_id = c.comunidad_id
    LEFT JOIN proveedores p
      ON i.proveedor_id = p.proveedor_id
    ORDER BY
      CASE
        WHEN i.estado = 'Abierta' THEN 0
        ELSE 1
      END,
      CASE
        WHEN i.prioridad = 'Alta' THEN 1
        WHEN i.prioridad = 'Media' THEN 2
        ELSE 3
      END,
      i.fecha_apertura DESC
  `);

  const incidencias = incidenciasResult.recordset;

  return (
    <main className="adminMain">
      <div className="pageTop">
        <div>
          <p className="adminEyebrow">Gestión</p>
          <h1>Incidencias</h1>
          <p>
            Seguimiento del estado, prioridad y resolución de incidencias.
          </p>
        </div>

        <Link href="/administrador" className="backButton">
          ← Inicio
        </Link>
      </div>

      <section className="dashboardKpis">
        <article className="dashboardKpiCard">
          <span>Total</span>
          <strong>{resumen.total}</strong>
          <small>Incidencias registradas</small>
        </article>

        <article className="dashboardKpiCard dashboardKpiWarning">
          <span>Abiertas</span>
          <strong>{resumen.abiertas}</strong>
          <small>Pendientes de resolución</small>
        </article>

        <article className="dashboardKpiCard">
          <span>Prioridad alta</span>
          <strong>{resumen.prioridad_alta}</strong>
          <small>Incidencias críticas</small>
        </article>

        <article className="dashboardKpiCard">
          <span>Tiempo medio</span>
          <strong>
            {resumen.horas_resolucion
              ? `${Number(resumen.horas_resolucion).toFixed(0)} h`
              : "—"}
          </strong>
          <small>Resolución de incidencias cerradas</small>
        </article>
      </section>

      <section className="adminPanel communitiesPagePanel">
        <div className="communitiesToolbar">
          <div>
            <h2>Incidencias registradas</h2>
            <p>Abiertas primero y ordenadas por prioridad.</p>
          </div>
        </div>

        <div className="managementTable">
          <div className="managementTableHeader incidentsColumns">
            <span>Incidencia</span>
            <span>Comunidad</span>
            <span>Prioridad</span>
            <span>Estado</span>
            <span>Apertura</span>
            <span>Coste</span>
          </div>

          {incidencias.map((incidencia) => (
            <div
              className="managementTableRow incidentsColumns"
              key={incidencia.incidencia_id}
            >
              <div>
                <strong>{incidencia.tipo}</strong>
                <small>{incidencia.descripcion}</small>
              </div>

              <span>{incidencia.comunidad}</span>

              <span
                className={`priorityBadge priority${incidencia.prioridad}`}
              >
                {incidencia.prioridad}
              </span>

              <span
                className={
                  incidencia.estado === "Abierta"
                    ? "statusWarning"
                    : "statusOk"
                }
              >
                {incidencia.estado}
              </span>

              <span>
                {new Date(incidencia.fecha_apertura).toLocaleDateString(
                  "es-ES"
                )}
              </span>

              <strong>
                {incidencia.coste != null
                  ? `${Number(incidencia.coste).toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} €`
                  : "—"}
              </strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}