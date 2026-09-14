import Link from "next/link";
import { getConnection } from "../../../lib/db";

export default async function Comunidades() {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT
      c.comunidad_id,
      c.nombre,
      c.numero_viviendas,
      c.numero_ascensores,
      c.piscina,
      c.garaje,
      c.jardin,
      c.conserjeria,
      b.gasto_por_vivienda,
      b.mediana_grupo,
      b.desviacion_pct,
      b.comunidades_comparables,
      b.alerta_gasto
    FROM comunidades c
    LEFT JOIN benchmark_comunidades b
      ON c.comunidad_id = b.comunidad_id
    ORDER BY b.desviacion_pct DESC
  `);

  const comunidades = result.recordset;

  const totalAlertas = comunidades.filter(
    (comunidad) => comunidad.alerta_gasto
  ).length;

  return (
    <main className="adminMain">
      <div className="pageTop">
        <div>
          <p className="adminEyebrow">Cartera</p>
          <h1>Comunidades</h1>
          <p>
            Análisis de las comunidades gestionadas por Urbalia.
          </p>
        </div>

        <Link href="/administrador" className="backButton">
          ← Inicio
        </Link>
      </div>

      <section className="communitiesStats">
        <div>
          <span>Comunidades gestionadas</span>
          <strong>{comunidades.length}</strong>
        </div>

        <div>
          <span>Con desviaciones detectadas</span>
          <strong>{totalAlertas}</strong>
        </div>

        <div>
          <span>Sin alertas</span>
          <strong>{comunidades.length - totalAlertas}</strong>
        </div>
      </section>

      <section className="adminPanel communitiesPagePanel">
        <div className="communitiesToolbar">
          <div>
            <h2>Cartera de comunidades</h2>
            <p>
              Ordenadas por desviación frente a su grupo comparable.
            </p>
          </div>
        </div>

        <div className="fullCommunityTable">
          <div className="fullCommunityHeader">
            <span>Comunidad</span>
            <span>Viviendas</span>
            <span>€/ vivienda</span>
            <span>Benchmark</span>
            <span>Desviación</span>
            <span>Estado</span>
            <span></span>
          </div>

          {comunidades.map((comunidad) => (
            <div
              className="fullCommunityRow"
              key={comunidad.comunidad_id}
            >
              <strong>{comunidad.nombre}</strong>

              <span>{comunidad.numero_viviendas}</span>

              <span>
                {Number(comunidad.gasto_por_vivienda).toFixed(2)} €
              </span>

              <span>
                {Number(comunidad.mediana_grupo).toFixed(2)} €
              </span>

              <span
                className={
                  comunidad.alerta_gasto
                    ? "negativeMetric"
                    : ""
                }
              >
                {Number(comunidad.desviacion_pct) > 0 ? "+" : ""}
                {Number(comunidad.desviacion_pct).toFixed(2)}%
              </span>

              <span
                className={
                  comunidad.alerta_gasto
                    ? "statusWarning"
                    : "statusOk"
                }
              >
                {comunidad.alerta_gasto
                  ? "Revisar"
                  : "Normal"}
              </span>

              <Link
                href={`/administrador/comunidades/${comunidad.comunidad_id}`}
                className="tableAction"
              >
                Analizar →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}