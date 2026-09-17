import Link from "next/link";
import { getConnection } from "../../../lib/db";
export const dynamic = "force-dynamic";
export default async function ProveedoresPage() {
  const pool = await getConnection();

  const resumenResult = await pool.request().query(`
    SELECT
      COUNT(*) AS total_proveedores,
      SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) AS activos,
      COUNT(DISTINCT categoria) AS categorias
    FROM proveedores
  `);

  const resumen = resumenResult.recordset[0];

  const proveedoresResult = await pool.request().query(`
    SELECT
      p.proveedor_id,
      p.nombre,
      p.categoria,
      p.telefono,
      p.email,
      p.activo,
      COUNT(DISTINCT c.contrato_id) AS contratos,
      COUNT(DISTINCT g.gasto_id) AS movimientos_gasto,
      COALESCE(SUM(g.importe), 0) AS gasto_asociado
    FROM proveedores p
    LEFT JOIN contratos c
      ON p.proveedor_id = c.proveedor_id
    LEFT JOIN gastos g
      ON p.proveedor_id = g.proveedor_id
    GROUP BY
      p.proveedor_id,
      p.nombre,
      p.categoria,
      p.telefono,
      p.email,
      p.activo
    ORDER BY gasto_asociado DESC
  `);

  const proveedores = proveedoresResult.recordset;

  return (
    <main className="adminMain">
      <div className="pageTop">
        <div>
          <p className="adminEyebrow">Gestión</p>
          <h1>Proveedores</h1>
          <p>
            Proveedores que prestan servicios a las comunidades gestionadas.
          </p>
        </div>

        <Link href="/administrador" className="backButton">
          ← Inicio
        </Link>
      </div>

      <section className="communitiesStats">
        <div>
          <span>Proveedores</span>
          <strong>{resumen.total_proveedores}</strong>
        </div>

        <div>
          <span>Activos</span>
          <strong>{resumen.activos}</strong>
        </div>

        <div>
          <span>Categorías</span>
          <strong>{resumen.categorias}</strong>
        </div>
      </section>

      <section className="adminPanel communitiesPagePanel">
        <div className="communitiesToolbar">
          <div>
            <h2>Cartera de proveedores</h2>
            <p>Actividad y gasto asociado a cada proveedor.</p>
          </div>
        </div>

        <div className="managementTable">
          <div className="managementTableHeader providersColumns">
            <span>Proveedor</span>
            <span>Categoría</span>
            <span>Contratos</span>
            <span>Movimientos</span>
            <span>Gasto asociado</span>
            <span>Estado</span>
          </div>

          {proveedores.map((proveedor) => (
            <div
              className="managementTableRow providersColumns"
              key={proveedor.proveedor_id}
            >
              <div>
                <strong>{proveedor.nombre}</strong>
                <small>{proveedor.email || "Sin email"}</small>
              </div>

              <span>{proveedor.categoria}</span>

              <span>{proveedor.contratos}</span>

              <span>{proveedor.movimientos_gasto}</span>

              <strong>
                {Number(proveedor.gasto_asociado).toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} €
              </strong>

              <span
                className={
                  proveedor.activo ? "statusOk" : "statusWarning"
                }
              >
                {proveedor.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}