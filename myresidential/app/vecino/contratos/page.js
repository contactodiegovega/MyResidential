import Link from "next/link";
import { getConnection } from "../../../lib/db";
export const dynamic = "force-dynamic";
export default async function ContratosVecinoPage() {
  const comunidadId = 107;

  const pool = await getConnection();

  // Comunidad
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

  // Contratos
  const contratosResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT
        c.contrato_id,
        c.servicio,
        c.fecha_inicio,
        c.fecha_fin,
        c.importe_anual,
        c.estado,
        p.nombre AS proveedor,
        p.categoria AS categoria_proveedor
      FROM contratos c
      INNER JOIN proveedores p
        ON c.proveedor_id = p.proveedor_id
      WHERE c.comunidad_id = @id
      ORDER BY
        CASE
          WHEN c.estado = 'Activo' THEN 1
          ELSE 2
        END,
        c.fecha_fin ASC
    `);

  const contratos = contratosResult.recordset;

  const contratosActivos = contratos.filter(
    (contrato) => contrato.estado === "Activo"
  );

  const costeAnual = contratosActivos.reduce(
    (total, contrato) =>
      total + Number(contrato.importe_anual || 0),
    0
  );

  const costePorVivienda =
    comunidad.numero_viviendas > 0
      ? costeAnual / comunidad.numero_viviendas
      : 0;

  const formatoEuro = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  });

  function formatearFecha(fecha) {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  function iconoServicio(servicio) {
    const texto = servicio.toLowerCase();

    if (texto.includes("ascensor")) return "↕";
    if (texto.includes("limpieza")) return "✦";
    if (texto.includes("jardin")) return "♧";
    if (texto.includes("piscina")) return "≈";
    if (texto.includes("seguridad")) return "◇";
    if (texto.includes("seguro")) return "✓";

    return "⌂";
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

          <Link href="/vecino/reservas">
            Reservas
          </Link>

          <Link href="/vecino/gastos">
            Gastos
          </Link>

          <Link
            href="/vecino/contratos"
            className="socialNavActive"
          >
            Contratos
          </Link>
        </nav>

        <div className="socialSidebarBottom">
          <Link href="/">
            ← Volver a MyResidential
          </Link>
        </div>
      </aside>


      {/* CONTENIDO */}

      <main className="socialMain">

        <header className="residentPageHeader">
          <div>
            <p className="socialEyebrow">
              Servicios de la comunidad
            </p>

            <h1>Contratos</h1>

            <p>
              Consulta los servicios y proveedores contratados
              actualmente por tu comunidad.
            </p>
          </div>
        </header>


        {/* RESUMEN */}

        <section className="residentEconomicSummary">

          <div className="residentEconomicCard">
            <span>Contratos activos</span>

            <strong>
              {contratosActivos.length}
            </strong>

            <small>
              Servicios actualmente contratados
            </small>
          </div>

          <div className="residentEconomicCard">
            <span>Coste anual</span>

            <strong>
              {formatoEuro.format(costeAnual)}
            </strong>

            <small>
              Total de contratos activos
            </small>
          </div>

          <div className="residentEconomicCard">
            <span>Coste por vivienda</span>

            <strong>
              {formatoEuro.format(costePorVivienda)}
            </strong>

            <small>
              {comunidad.numero_viviendas} viviendas
            </small>
          </div>

        </section>


        {/* CONTRATOS ACTIVOS */}

        <section className="residentSection">

          <div className="residentSectionHeader">
            <div>
              <h2>Servicios contratados</h2>

              <p>
                Contratos que se encuentran actualmente activos.
              </p>
            </div>
          </div>

          {contratosActivos.length === 0 ? (
            <div className="residentEmptyState">
              <span>📄</span>

              <strong>No hay contratos activos</strong>

              <p>
                No existen servicios activos registrados
                actualmente.
              </p>
            </div>
          ) : (
            <div className="residentContractsGrid">

              {contratosActivos.map((contrato) => (
                <article
                  className="residentContractCard"
                  key={contrato.contrato_id}
                >

                  <div className="residentContractTop">

                    <div className="residentContractIcon">
                      {iconoServicio(contrato.servicio)}
                    </div>

                    <span className="residentContractActive">
                      Activo
                    </span>

                  </div>

                  <div className="residentContractService">
                    <span>Servicio</span>

                    <h3>{contrato.servicio}</h3>

                    <p>{contrato.proveedor}</p>
                  </div>

                  <div className="residentContractDetails">

                    <div>
                      <span>Coste anual</span>

                      <strong>
                        {formatoEuro.format(
                          Number(contrato.importe_anual)
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Vigencia</span>

                      <strong>
                        {formatearFecha(
                          contrato.fecha_fin
                        )}
                      </strong>
                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>


        {/* HISTORIAL */}

        {contratos.length > contratosActivos.length && (
          <section className="residentSection">

            <div className="residentSectionHeader">
              <div>
                <h2>Historial</h2>

                <p>
                  Contratos anteriores de la comunidad.
                </p>
              </div>
            </div>

            <div className="residentHistory">

              {contratos
                .filter(
                  (contrato) =>
                    contrato.estado !== "Activo"
                )
                .map((contrato) => (
                  <div
                    className="residentHistoryRow"
                    key={contrato.contrato_id}
                  >
                    <div className="residentHistoryIcon">
                      ✓
                    </div>

                    <div className="residentHistoryContent">
                      <strong>
                        {contrato.servicio}
                      </strong>

                      <span>
                        {contrato.proveedor}
                      </span>
                    </div>

                    <div className="residentHistoryDate">
                      <span>
                        {contrato.estado}
                      </span>

                      <small>
                        {formatearFecha(
                          contrato.fecha_fin
                        )}
                      </small>
                    </div>
                  </div>
                ))}

            </div>

          </section>
        )}


        {/* INFORMACIÓN */}

        <div className="residentTransparency">

          <div className="residentTransparencyIcon">
            i
          </div>

          <div>
            <strong>
              Información clara para los vecinos
            </strong>

            <p>
              MyResidential centraliza los contratos de la
              comunidad para facilitar el acceso a la información
              sobre servicios, proveedores, costes y vigencia.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}