import Link from "next/link";
import { getConnection } from "../../../lib/db";

export default async function GastosPage() {
  const pool = await getConnection();

  const resumenResult = await pool.request().query(`
    SELECT
      COUNT(*) AS total_gastos,
      SUM(importe) AS gasto_total,
      AVG(importe) AS gasto_medio
    FROM gastos
  `);

  const resumen = resumenResult.recordset[0];

  const gastosResult = await pool.request().query(`
    SELECT TOP 100
      g.gasto_id,
      g.fecha,
      g.categoria,
      g.concepto,
      g.importe,
      c.nombre AS comunidad,
      p.nombre AS proveedor
    FROM gastos g
    INNER JOIN comunidades c
      ON g.comunidad_id = c.comunidad_id
    LEFT JOIN proveedores p
      ON g.proveedor_id = p.proveedor_id
    ORDER BY g.fecha DESC
  `);

  const gastos = gastosResult.recordset;

  return (
    <main className="adminMain">
      <div className="pageTop">
        <div>
          <p className="adminEyebrow">Gestión</p>
          <h1>Gastos</h1>
          <p>
            Consulta los movimientos económicos registrados en las comunidades.
          </p>
        </div>

        <Link href="/administrador" className="backButton">
          ← Inicio
        </Link>
      </div>

      <section className="communitiesStats">
        <div>
          <span>Movimientos registrados</span>
          <strong>{resumen.total_gastos}</strong>
        </div>

        <div>
          <span>Gasto total</span>
          <strong>
            {Number(resumen.gasto_total).toLocaleString("es-ES", {
              maximumFractionDigits: 0,
            })} €
          </strong>
        </div>

        <div>
          <span>Gasto medio</span>
          <strong>
            {Number(resumen.gasto_medio).toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} €
          </strong>
        </div>
      </section>

      <section className="adminPanel communitiesPagePanel">
        <div className="communitiesToolbar">
          <div>
            <h2>Últimos gastos</h2>
            <p>Últimos 100 movimientos registrados en Azure SQL.</p>
          </div>
        </div>

        <div className="managementTable">
          <div className="managementTableHeader expensesColumns">
            <span>Fecha</span>
            <span>Comunidad</span>
            <span>Categoría</span>
            <span>Proveedor</span>
            <span>Concepto</span>
            <span>Importe</span>
          </div>

          {gastos.map((gasto) => (
            <div
              className="managementTableRow expensesColumns"
              key={gasto.gasto_id}
            >
              <span>
                {new Date(gasto.fecha).toLocaleDateString("es-ES")}
              </span>

              <strong>{gasto.comunidad}</strong>

              <span>{gasto.categoria}</span>

              <span>{gasto.proveedor || "—"}</span>

              <span>{gasto.concepto || "—"}</span>

              <strong>
                {Number(gasto.importe).toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} €
              </strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}