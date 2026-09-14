import Link from "next/link";
import { getConnection } from "../../lib/db";

export default async function AdministradorPage() {
  const pool = await getConnection();

  const resumenResult = await pool.request().query(`
    SELECT
      (SELECT COUNT(*) FROM comunidades) AS total_comunidades,

      (
        SELECT COUNT(*)
        FROM benchmark_comunidades
        WHERE alerta_gasto = 1
      ) AS comunidades_alerta,

      (
        SELECT COUNT(*)
        FROM incidencias
        WHERE estado = 'Abierta'
      ) AS incidencias_abiertas,

      (
        SELECT COUNT(*)
        FROM contratos
        WHERE fecha_fin IS NOT NULL
          AND fecha_fin >= CAST(GETDATE() AS DATE)
          AND fecha_fin <= DATEADD(DAY, 60, CAST(GETDATE() AS DATE))
      ) AS contratos_proximos
  `);

  const resumen = resumenResult.recordset[0];

  const topComunidadesResult = await pool.request().query(`
    SELECT TOP 5
      c.comunidad_id,
      c.nombre,
      c.numero_viviendas,
      b.gasto_por_vivienda,
      b.mediana_grupo,
      b.desviacion_pct,
      b.comunidades_comparables
    FROM comunidades c
    INNER JOIN benchmark_comunidades b
      ON c.comunidad_id = b.comunidad_id
    WHERE b.alerta_gasto = 1
    ORDER BY b.desviacion_pct DESC
  `);

  const topComunidades = topComunidadesResult.recordset;

  const incidenciasResult = await pool.request().query(`
    SELECT TOP 5
      i.incidencia_id,
      c.nombre AS comunidad,
      i.tipo,
      i.prioridad,
      i.fecha_apertura
    FROM incidencias i
    INNER JOIN comunidades c
      ON i.comunidad_id = c.comunidad_id
    WHERE i.estado = 'Abierta'
    ORDER BY
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

      {/* CABECERA */}

      <div className="adminDashboardHeader">
        <div>
          <p className="adminEyebrow">Panel de administración</p>
          <h1>Buenos días, Urbalia</h1>
          <p>
            Resumen de las comunidades gestionadas y principales
            desviaciones detectadas.
          </p>
        </div>

        <Link
          href="/administrador/comunidades"
          className="dashboardPrimaryButton"
        >
          Ver comunidades
        </Link>
      </div>

      {/* KPIs */}

      <section className="dashboardKpis">

        <article className="dashboardKpiCard">
          <div>
            <span>Comunidades</span>
            <strong>{resumen.total_comunidades}</strong>
          </div>

          <small>Cartera gestionada</small>
        </article>

        <article className="dashboardKpiCard dashboardKpiWarning">
          <div>
            <span>Alertas de gasto</span>
            <strong>{resumen.comunidades_alerta}</strong>
          </div>

          <small>Comunidades para revisar</small>
        </article>

        <article className="dashboardKpiCard">
          <div>
            <span>Incidencias abiertas</span>
            <strong>{resumen.incidencias_abiertas}</strong>
          </div>

          <small>Pendientes de resolución</small>
        </article>

        <article className="dashboardKpiCard">
          <div>
            <span>Contratos próximos</span>
            <strong>{resumen.contratos_proximos}</strong>
          </div>

          <small>Vencen en los próximos 60 días</small>
        </article>

      </section>

      {/* CONTENIDO PRINCIPAL */}

      <section className="dashboardMainGrid">

        {/* COMUNIDADES CON MAYOR DESVIACIÓN */}

        <article className="dashboardPanel">

          <div className="dashboardPanelHeader">
            <div>
              <h2>Comunidades a revisar</h2>
              <p>
                Mayores desviaciones de gasto frente a su grupo comparable.
              </p>
            </div>

            <Link href="/administrador/comunidades">
              Ver todas →
            </Link>
          </div>

          <div className="dashboardCommunitiesList">

            {topComunidades.map((comunidad) => (
              <div
                className="dashboardCommunityRow"
                key={comunidad.comunidad_id}
              >
                <div className="dashboardCommunityInfo">
                  <strong>{comunidad.nombre}</strong>

                  <span>
                    {comunidad.numero_viviendas} viviendas ·{" "}
                    {comunidad.comunidades_comparables} comparables
                  </span>
                </div>

                <div className="dashboardCommunityMetrics">

                  <div>
                    <span>€/ vivienda</span>
                    <strong>
                      {Number(
                        comunidad.gasto_por_vivienda
                      ).toFixed(2)} €
                    </strong>
                  </div>

                  <div>
                    <span>Desviación</span>
                    <strong className="dashboardDeviation">
                      +
                      {Number(
                        comunidad.desviacion_pct
                      ).toFixed(1)}
                      %
                    </strong>
                  </div>

                  <Link
                    href={`/administrador/comunidades/${comunidad.comunidad_id}`}
                    className="dashboardAnalyzeButton"
                  >
                    Analizar
                  </Link>

                </div>
              </div>
            ))}

          </div>
        </article>

        {/* INCIDENCIAS */}

        <article className="dashboardPanel">

          <div className="dashboardPanelHeader">
            <div>
              <h2>Incidencias abiertas</h2>
              <p>
                Incidencias que requieren seguimiento.
              </p>
            </div>

            <Link href="/administrador/incidencias">
              Ver todas →
            </Link>
          </div>

          <div className="dashboardIncidentList">

            {incidencias.length === 0 ? (
              <p className="dashboardEmpty">
                No hay incidencias abiertas.
              </p>
            ) : (
              incidencias.map((incidencia) => (
                <div
                  className="dashboardIncident"
                  key={incidencia.incidencia_id}
                >
                  <div>
                    <strong>{incidencia.tipo}</strong>
                    <span>{incidencia.comunidad}</span>
                  </div>

                  <span
                    className={`priorityBadge priority${incidencia.prioridad}`}
                  >
                    {incidencia.prioridad}
                  </span>
                </div>
              ))
            )}

          </div>
        </article>

      </section>

      {/* ACCESOS RÁPIDOS */}

      <section className="dashboardQuickSection">

        <div className="dashboardSectionTitle">
          <h2>Gestión</h2>
          <p>
            Accede a las principales áreas de MyResidential.
          </p>
        </div>

        <div className="dashboardQuickGrid">

          <Link
            href="/administrador/comunidades"
            className="dashboardQuickCard"
          >
            <span>01</span>
            <strong>Comunidades</strong>
            <p>
              Consulta la cartera, benchmarks y alertas.
            </p>
          </Link>

          <Link
            href="/administrador/gastos"
            className="dashboardQuickCard"
          >
            <span>02</span>
            <strong>Gastos</strong>
            <p>
              Analiza gastos por comunidad y categoría.
            </p>
          </Link>

          <Link
            href="/administrador/proveedores"
            className="dashboardQuickCard"
          >
            <span>03</span>
            <strong>Proveedores</strong>
            <p>
              Consulta proveedores y servicios contratados.
            </p>
          </Link>

          <Link
            href="/administrador/incidencias"
            className="dashboardQuickCard"
          >
            <span>04</span>
            <strong>Incidencias</strong>
            <p>
              Supervisa incidencias y prioridades.
            </p>
          </Link>

          <Link
            href="/administrador/contratos"
            className="dashboardQuickCard"
          >
            <span>05</span>
            <strong>Contratos</strong>
            <p>
              Controla importes y próximos vencimientos.
            </p>
          </Link>

        </div>

      </section>

    </main>
  );
}