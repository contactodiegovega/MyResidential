import Link from "next/link";
import { getConnection } from "../../../lib/db";

export default async function GastosVecinoPage() {
  const comunidadId = 107;

  const pool = await getConnection();

  // Información de la comunidad
  const comunidadResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT
        nombre,
        direccion,
        numero_viviendas
      FROM comunidades
      WHERE comunidad_id = @id
    `);

  const comunidad = comunidadResult.recordset[0];

  // Resumen económico
  const resumenResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT
        SUM(importe) AS gasto_total,
        COUNT(*) AS numero_gastos
      FROM gastos
      WHERE comunidad_id = @id
    `);

  const resumen = resumenResult.recordset[0];

  const gastoTotal = Number(resumen.gasto_total || 0);

  const gastoPorVivienda =
    comunidad.numero_viviendas > 0
      ? gastoTotal / comunidad.numero_viviendas
      : 0;

  // Gastos agrupados por categoría
  const categoriasResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT
        categoria,
        SUM(importe) AS total
      FROM gastos
      WHERE comunidad_id = @id
      GROUP BY categoria
      ORDER BY total DESC
    `);

  const categorias = categoriasResult.recordset;

  // Últimos movimientos
  const gastosResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT TOP 12
        g.gasto_id,
        g.fecha,
        g.categoria,
        g.concepto,
        g.importe,
        p.nombre AS proveedor
      FROM gastos g
      LEFT JOIN proveedores p
        ON g.proveedor_id = p.proveedor_id
      WHERE g.comunidad_id = @id
      ORDER BY g.fecha DESC, g.gasto_id DESC
    `);

  const gastos = gastosResult.recordset;

  const formatoEuro = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  });

  const categoriaMayor = categorias[0];

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

          <Link href="/vecino/reservas">
            Reservas
          </Link>

          <Link
            href="/vecino/gastos"
            className="socialNavActive"
          >
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
            <p className="socialEyebrow">
              Transparencia económica
            </p>

            <h1>Gastos de mi comunidad</h1>

            <p>
              Consulta de forma sencilla en qué se destinan
              los gastos de tu comunidad.
            </p>
          </div>
        </header>


        {/* KPIs */}

        <section className="residentEconomicSummary">

          <div className="residentEconomicCard">
            <span>Gasto registrado</span>

            <strong>
              {formatoEuro.format(gastoTotal)}
            </strong>

            <small>
              Total de gastos disponibles
            </small>
          </div>

          <div className="residentEconomicCard">
            <span>Por vivienda</span>

            <strong>
              {formatoEuro.format(gastoPorVivienda)}
            </strong>

            <small>
              {comunidad.numero_viviendas} viviendas
            </small>
          </div>

          <div className="residentEconomicCard">
            <span>Principal categoría</span>

            <strong className="economicCategoryValue">
              {categoriaMayor
                ? categoriaMayor.categoria
                : "Sin datos"}
            </strong>

            <small>
              {categoriaMayor
                ? formatoEuro.format(
                    Number(categoriaMayor.total)
                  )
                : "0 €"}
            </small>
          </div>

        </section>


        {/* DISTRIBUCIÓN */}

        <section className="residentSection">

          <div className="residentSectionHeader">
            <div>
              <h2>¿En qué se gasta?</h2>

              <p>
                Distribución del gasto por categoría.
              </p>
            </div>
          </div>

          <div className="residentExpenseCategories">

            {categorias.map((categoria) => {
              const total = Number(categoria.total);

              const porcentaje =
                gastoTotal > 0
                  ? (total / gastoTotal) * 100
                  : 0;

              return (
                <div
                  className="residentExpenseCategory"
                  key={categoria.categoria}
                >
                  <div className="expenseCategoryHeader">
                    <div>
                      <strong>
                        {categoria.categoria}
                      </strong>

                      <span>
                        {porcentaje.toFixed(1)}%
                      </span>
                    </div>

                    <strong>
                      {formatoEuro.format(total)}
                    </strong>
                  </div>

                  <div className="expenseProgress">
                    <div
                      className="expenseProgressValue"
                      style={{
                        width: `${Math.min(
                          porcentaje,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}

          </div>
        </section>


        {/* ÚLTIMOS GASTOS */}

        <section className="residentSection">

          <div className="residentSectionHeader">
            <div>
              <h2>Últimos movimientos</h2>

              <p>
                Gastos registrados recientemente
                en la comunidad.
              </p>
            </div>
          </div>

          <div className="residentExpenseList">

            {gastos.map((gasto) => (
              <article
                className="residentExpenseRow"
                key={gasto.gasto_id}
              >

                <div className="residentExpenseIcon">
                  €
                </div>

                <div className="residentExpenseInfo">
                  <strong>
                    {gasto.concepto ||
                      gasto.categoria}
                  </strong>

                  <span>
                    {gasto.categoria}
                    {gasto.proveedor
                      ? ` · ${gasto.proveedor}`
                      : ""}
                  </span>
                </div>

                <div className="residentExpenseAmount">
                  <strong>
                    {formatoEuro.format(
                      Number(gasto.importe)
                    )}
                  </strong>

                  <span>
                    {new Date(
                      gasto.fecha
                    ).toLocaleDateString("es-ES")}
                  </span>
                </div>

              </article>
            ))}

          </div>
        </section>


        {/* TRANSPARENCIA */}

        <div className="residentTransparency">
          <div className="residentTransparencyIcon">
            i
          </div>

          <div>
            <strong>
              Transparencia de tu comunidad
            </strong>

            <p>
              MyResidential centraliza la información
              económica para que los vecinos puedan consultar
              de forma clara cómo se distribuyen los gastos
              de su comunidad.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}