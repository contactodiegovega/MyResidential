import Link from "next/link";
import { notFound } from "next/navigation";
import { getConnection } from "../../../../lib/db";

export default async function ComunidadDetalle({ params }) {
  const { id } = await params;

  const pool = await getConnection();

  const result = await pool
    .request()
    .input("id", id)
    .query(`
      SELECT
        c.comunidad_id,
        c.nombre,
        c.direccion,
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
      WHERE c.comunidad_id = @id
    `);

  const comunidad = result.recordset[0];

  if (!comunidad) {
    notFound();
  }

  const desviacion = Number(comunidad.desviacion_pct);
  const esAlerta = Boolean(comunidad.alerta_gasto);
  const gastosResult = await pool
  .request()
  .input("id", id)
  .query(`
    SELECT
      categoria,
      SUM(importe) AS gasto_total
    FROM gastos
    WHERE comunidad_id = @id
    GROUP BY categoria
    ORDER BY gasto_total DESC
  `);

const gastosCategorias = gastosResult.recordset;

const gastoTotal = gastosCategorias.reduce(
  (acc, gasto) => acc + Number(gasto.gasto_total),
  0
);

  return (
    <main className="communityDetailPage">
      <div className="communityDetailTop">
        <div>
          <div className="breadcrumb">
            <Link href="/administrador/comunidades">Comunidades</Link>
            <span>›</span>
            <span>ID {comunidad.comunidad_id}</span>
          </div>

          <h1>{comunidad.nombre}</h1>
          <p className="communityAddress">{comunidad.direccion}</p>
        </div>

        <Link
          href="/administrador/comunidades"
          className="backButton"
        >
          ← Volver a comunidades
        </Link>
      </div>

      <section className="communityKpis">
        <article className="communityKpiCard">
          <span>Gasto por vivienda</span>
          <strong>
            {Number(comunidad.gasto_por_vivienda).toFixed(2)} €
          </strong>
          <small>Periodo analizado</small>
        </article>

        <article className="communityKpiCard">
          <span>Benchmark</span>
          <strong>
            {Number(comunidad.mediana_grupo).toFixed(2)} €
          </strong>
          <small>
            {comunidad.comunidades_comparables} comunidades comparables
          </small>
        </article>

        <article
          className={`communityKpiCard ${
            esAlerta ? "communityKpiAlert" : ""
          }`}
        >
          <span>Desviación</span>
          <strong>
            {desviacion > 0 ? "+" : ""}
            {desviacion.toFixed(2)}%
          </strong>
          <small>
            {esAlerta
              ? "Por encima del benchmark"
              : "Dentro del rango esperado"}
          </small>
        </article>

        <article
          className={`communityKpiCard ${
            esAlerta ? "communityStatusAlert" : "communityStatusOk"
          }`}
        >
          <span>Estado</span>
          <strong>{esAlerta ? "Revisar" : "Normal"}</strong>
          <small>
            {esAlerta
              ? "Desviación relevante detectada"
              : "Sin desviaciones relevantes"}
          </small>
        </article>
      </section>

      <section className="communityDetailGrid">
        <article className="communityPanel">
          <div className="communityPanelHeader">
            <h2>Características de la comunidad</h2>
            <p>Datos utilizados para contextualizar el análisis.</p>
          </div>

          <div className="communityFeaturesGrid">
            <div className="featureCard">
              <span>Viviendas</span>
              <strong>{comunidad.numero_viviendas}</strong>
            </div>

            <div className="featureCard">
              <span>Ascensores</span>
              <strong>{comunidad.numero_ascensores}</strong>
            </div>

            <div className="featureCard">
              <span>Piscina</span>
              <strong>{comunidad.piscina ? "Sí" : "No"}</strong>
            </div>

            <div className="featureCard">
              <span>Garaje</span>
              <strong>{comunidad.garaje ? "Sí" : "No"}</strong>
            </div>

            <div className="featureCard">
              <span>Jardín</span>
              <strong>{comunidad.jardin ? "Sí" : "No"}</strong>
            </div>

            <div className="featureCard">
              <span>Conserjería</span>
              <strong>{comunidad.conserjeria ? "Sí" : "No"}</strong>
            </div>
          </div>
        </article>

        <article className="communityPanel">
          <div className="communityPanelHeader">
            <h2>Resultado del análisis</h2>
            <p>
              Comparación frente a comunidades con características similares.
            </p>
          </div>

          <div
            className={`analysisBanner ${
              esAlerta ? "analysisBannerAlert" : "analysisBannerOk"
            }`}
          >
            <strong>
              {esAlerta
                ? "Desviación relevante detectada"
                : "Sin desviaciones relevantes"}
            </strong>

            <p>
              {esAlerta
                ? `El gasto por vivienda está un ${desviacion.toFixed(
                    1
                  )}% por encima de la mediana de su grupo comparable.`
                : "El gasto por vivienda se encuentra dentro del rango esperado frente a comunidades comparables."}
            </p>
          </div>

          <div className="analysisSummary">
            <div>
              <span>Comunidades comparables</span>
              <strong>{comunidad.comunidades_comparables}</strong>
            </div>

            <div>
              <span>Mediana del grupo</span>
              <strong>
                {Number(comunidad.mediana_grupo).toFixed(2)} €
              </strong>
            </div>
          </div>
        </article>
      </section>
      <section className="communitySpendingGrid">
  <article className="communityPanel">
    <div className="communityPanelHeader">
      <h2>Distribución de gastos</h2>
      <p>
        Desglose del gasto de la comunidad por categoría.
      </p>
    </div>

    <div className="spendingList">
      {gastosCategorias.map((gasto) => {
        const importe = Number(gasto.gasto_total);

        const porcentaje =
          gastoTotal > 0
            ? (importe / gastoTotal) * 100
            : 0;

        return (
          <div
            className="spendingRow"
            key={gasto.categoria}
          >
            <div className="spendingRowTop">
              <strong>{gasto.categoria}</strong>

              <span>
                {importe.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                €
              </span>
            </div>

            <div className="spendingBar">
              <div
                className="spendingBarFill"
                style={{
                  width: `${Math.min(porcentaje, 100)}%`,
                }}
              />
            </div>

            <small>
              {porcentaje.toFixed(1)}% del gasto total
            </small>
          </div>
        );
      })}
    </div>
  </article>

  <article className="communityPanel spendingSummaryPanel">
    <div className="communityPanelHeader">
      <h2>Resumen económico</h2>
      <p>
        Visión rápida del gasto de esta comunidad.
      </p>
    </div>

    <div className="economicSummary">
      <div>
        <span>Gasto total</span>
        <strong>
          {gastoTotal.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          €
        </strong>
      </div>

      <div>
        <span>Categorías de gasto</span>
        <strong>{gastosCategorias.length}</strong>
      </div>

      <div>
        <span>Mayor categoría</span>
        <strong>
          {gastosCategorias[0]?.categoria || "Sin datos"}
        </strong>
      </div>
    </div>
  </article>
</section>
    </main>
  );
}