import Link from "next/link";
import { getConnection } from "../../../lib/db";

export default async function ContratosPage() {
  const pool = await getConnection();

  const resumenResult = await pool.request().query(`
    SELECT
      COUNT(*) AS total_contratos,
      SUM(CASE WHEN estado = 'Activo' THEN 1 ELSE 0 END) AS activos,
      SUM(importe_anual) AS importe_anual_total,
      SUM(
        CASE
          WHEN fecha_fin >= CAST(GETDATE() AS DATE)
          AND fecha_fin <= DATEADD(DAY, 90, CAST(GETDATE() AS DATE))
          THEN 1
          ELSE 0
        END
      ) AS proximos_vencer
    FROM contratos
  `);

  const resumen = resumenResult.recordset[0];

  const contratosResult = await pool.request().query(`
    SELECT TOP 100
      ct.contrato_id,
      ct.servicio,
      ct.fecha_inicio,
      ct.fecha_fin,
      ct.importe_anual,
      ct.estado,
      c.nombre AS comunidad,
      p.nombre AS proveedor
    FROM contratos ct
    INNER JOIN comunidades c
      ON ct.comunidad_id = c.comunidad_id
    INNER JOIN proveedores p
      ON ct.proveedor_id = p.proveedor_id
    ORDER BY
      CASE
        WHEN ct.fecha_fin IS NULL THEN 1
        ELSE 0
      END,
      ct.fecha_fin ASC
  `);

  const contratos = contratosResult.recordset;

  return (
    <main className="adminMain">
      <div className="pageTop">
        <div>
          <p className="adminEyebrow">Gestión</p>
          <h1>Contratos</h1>
          <p>
            Control de servicios contratados, importes y fechas de vencimiento.
          </p>
        </div>

        <Link href="/administrador" className="backButton">
          ← Inicio
        </Link>
      </div>

      <section className="dashboardKpis">
        <article className="dashboardKpiCard">
          <span>Contratos</span>
          <strong>{resumen.total_contratos}</strong>
          <small>Total registrado</small>
        </article>

        <article className="dashboardKpiCard">
          <span>Activos</span>
          <strong>{resumen.activos}</strong>
          <small>Contratos en vigor</small>
        </article>

        <article className="dashboardKpiCard">
          <span>Importe anual</span>
          <strong>
            {Number(resumen.importe_anual_total).toLocaleString("es-ES", {
              maximumFractionDigits: 0,
            })} €
          </strong>
          <small>Volumen contractual</small>
        </article>

        <article className="dashboardKpiCard dashboardKpiWarning">
          <span>Próximos a vencer</span>
          <strong>{resumen.proximos_vencer}</strong>
          <small>Próximos 90 días</small>
        </article>
      </section>

      <section className="adminPanel communitiesPagePanel">
        <div className="communitiesToolbar">
          <div>
            <h2>Contratos registrados</h2>
            <p>Ordenados por fecha de vencimiento.</p>
          </div>
        </div>

        <div className="managementTable">
          <div className="managementTableHeader contractsColumns">
            <span>Servicio</span>
            <span>Comunidad</span>
            <span>Proveedor</span>
            <span>Inicio</span>
            <span>Fin</span>
            <span>Importe anual</span>
            <span>Estado</span>
          </div>

          {contratos.map((contrato) => (
            <div
              className="managementTableRow contractsColumns"
              key={contrato.contrato_id}
            >
              <strong>{contrato.servicio}</strong>

              <span>{contrato.comunidad}</span>

              <span>{contrato.proveedor}</span>

              <span>
                {new Date(contrato.fecha_inicio).toLocaleDateString("es-ES")}
              </span>

              <span>
                {contrato.fecha_fin
                  ? new Date(contrato.fecha_fin).toLocaleDateString("es-ES")
                  : "Sin fecha"}
              </span>

              <strong>
                {Number(contrato.importe_anual).toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} €
              </strong>

              <span
                className={
                  contrato.estado === "Activo"
                    ? "statusOk"
                    : "statusWarning"
                }
              >
                {contrato.estado}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}