import Link from "next/link";
import { getConnection } from "../../lib/db";
import FormularioAnuncio from "./FormularioAnuncio";
import CerrarSesionVecino from "./CerrarSesionVecino";
export const dynamic = "force-dynamic";
export default async function VecinoPage() {
  const comunidadId = 107;
  const viviendaId = 12922;

  const pool = await getConnection();

  // 👇 AÑÁDELO AQUÍ
  const anunciosResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT TOP 10
        a.anuncio_id,
        a.titular,
        a.texto,
        a.fecha_publicacion,
        v.portal,
        v.planta,
        v.puerta
      FROM anuncios a
      INNER JOIN viviendas v
        ON a.vivienda_id = v.vivienda_id
      WHERE a.comunidad_id = @id
        AND a.activo = 1
      ORDER BY a.fecha_publicacion DESC
    `);

  const anuncios = anunciosResult.recordset;

  // COMUNIDAD
  const comunidadResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT
        comunidad_id,
        nombre,
        direccion,
        numero_viviendas
      FROM comunidades
      WHERE comunidad_id = @id
    `);

  const comunidad = comunidadResult.recordset[0];

  // INCIDENCIAS
  const incidenciasResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT TOP 5
        incidencia_id,
        tipo,
        descripcion,
        prioridad,
        estado,
        fecha_apertura
      FROM incidencias
      WHERE comunidad_id = @id
      ORDER BY fecha_apertura DESC
    `);

  const incidencias = incidenciasResult.recordset;

  // GASTOS RECIENTES
  const gastosResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT TOP 4
        gasto_id,
        fecha,
        categoria,
        concepto,
        importe
      FROM gastos
      WHERE comunidad_id = @id
      ORDER BY fecha DESC
    `);

  const gastos = gastosResult.recordset;

  // CONTRATOS RECIENTES
  const contratosResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT TOP 3
        ct.contrato_id,
        ct.servicio,
        ct.fecha_fin,
        ct.estado,
        p.nombre AS proveedor
      FROM contratos ct
      INNER JOIN proveedores p
        ON ct.proveedor_id = p.proveedor_id
      WHERE ct.comunidad_id = @id
      ORDER BY ct.fecha_fin ASC
    `);

  const contratos = contratosResult.recordset;

  // RESERVAS
  const reservasResult = await pool
    .request()
    .input("id", comunidadId)
    .query(`
      SELECT TOP 4
        reserva_id,
        espacio,
        fecha_reserva,
        hora_inicio,
        hora_fin,
        estado
      FROM reservas
      WHERE comunidad_id = @id
      ORDER BY fecha_reserva DESC
    `);

  const reservas = reservasResult.recordset;

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
          <Link href="/vecino" className="socialNavActive">
            Inicio
          </Link>

          <Link href="/vecino/incidencias">
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
        <CerrarSesionVecino />

        <Link href="/">
          ← Volver a MyResidential
        </Link>
      </div>
      </aside>


      {/* FEED */}

      <main className="socialMain">

        <header className="socialHeader">
          <div>
            <p className="socialEyebrow">Tu comunidad</p>
            <h1>Hola, vecino 👋</h1>
            <p>
              Todo lo que pasa en {comunidad.nombre}, en un solo lugar.
            </p>
          </div>

          <div className="socialCommunityChip">
            <strong>{comunidad.nombre}</strong>
            <span>{comunidad.direccion}</span>
          </div>
        </header>


        {/* ACCIONES RÁPIDAS */}

        <section className="socialActions">
          <Link
            href="/vecino/incidencias"
            className="socialActionPrimary"
          >
            + Comunicar incidencia
          </Link>

          <Link
            href="/vecino/reservas"
            className="socialActionSecondary"
          >
            + Reservar espacio
          </Link>
        </section>


        {/* COLUMNA PRINCIPAL */}

        <section className="socialContentGrid">

          <div className="socialFeed">
        {/* TABLÓN DE ANUNCIOS */}

<section className="communityBoard">

  <div className="communityBoardHeader">
    <div>
      <p className="socialEyebrow">Entre vecinos</p>
      <h2>Tablón de la comunidad</h2>
      <p>Comparte anuncios e información con tus vecinos.</p>
    </div>

    <FormularioAnuncio
      comunidadId={comunidadId}
      viviendaId={viviendaId}
    />
  </div>

  {anuncios.length === 0 ? (
    <div className="communityBoardEmpty">
      <strong>El tablón está vacío</strong>
      <p>Sé el primero en publicar un anuncio.</p>
    </div>
  ) : (
    <div className="communityBoardGrid">
      {anuncios.map((anuncio) => (
        <article
          className="communityBoardCard"
          key={anuncio.anuncio_id}
        >
          <div className="communityBoardAvatar">
            V
          </div>

          <div className="communityBoardContent">

            <div className="communityBoardMeta">
              <strong>
                Portal {anuncio.portal} · {anuncio.planta}º
                {anuncio.puerta}
              </strong>

              <span>
                {new Date(
                  anuncio.fecha_publicacion
                ).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>

            <h3>{anuncio.titular}</h3>

            <p>{anuncio.texto}</p>

          </div>
        </article>
      ))}
    </div>
  )}

    </section>
            {/* AVISO DEMO */}

            <article className="feedCard feedAnnouncement">
              <div className="feedCardTop">
                <div className="feedIcon">
                  📢
                </div>

                <div>
                  <strong>Aviso de la comunidad</strong>
                  <span>Hoy</span>
                </div>
              </div>

              <h2>Mantenimiento de zonas comunes</h2>

              <p>
                El próximo jueves se realizarán tareas de mantenimiento
                en las zonas comunes de la comunidad.
              </p>

              <div className="feedFooter">
                <span>Comunicado por administración</span>
              </div>
            </article>


            {/* INCIDENCIAS */}

            {incidencias.map((incidencia) => (
              <article
                className="feedCard"
                key={`incidencia-${incidencia.incidencia_id}`}
              >
                <div className="feedCardTop">
                  <div className="feedIcon">
                    🔧
                  </div>

                  <div>
                    <strong>Incidencia</strong>
                    <span>
                      {new Date(
                        incidencia.fecha_apertura
                      ).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>

                <h2>{incidencia.tipo}</h2>

                <p>{incidencia.descripcion}</p>

                <div className="feedMetaRow">
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
                </div>
              </article>
            ))}


            {/* RESERVAS */}

            {reservas.map((reserva) => (
              <article
                className="feedCard"
                key={`reserva-${reserva.reserva_id}`}
              >
                <div className="feedCardTop">
                  <div className="feedIcon">
                    🎾
                  </div>

                  <div>
                    <strong>Reserva de espacio</strong>
                    <span>{reserva.estado}</span>
                  </div>
                </div>

                <h2>{reserva.espacio}</h2>

                <p>
                  {new Date(
                    reserva.fecha_reserva
                  ).toLocaleDateString("es-ES")}
                </p>

                <div className="feedFooter">
                  <span>Reserva comunitaria</span>
                </div>
              </article>
            ))}


            {/* GASTOS */}

            {gastos.map((gasto) => (
              <article
                className="feedCard"
                key={`gasto-${gasto.gasto_id}`}
              >
                <div className="feedCardTop">
                  <div className="feedIcon">
                    💶
                  </div>

                  <div>
                    <strong>Nuevo gasto registrado</strong>
                    <span>
                      {new Date(gasto.fecha).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>

                <h2>{gasto.categoria}</h2>

                <p>
                  {gasto.concepto || "Gasto de la comunidad"}
                </p>

                <div className="feedAmount">
                  {Number(gasto.importe).toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} €
                </div>
              </article>
            ))}

          </div>


          {/* COLUMNA DERECHA */}

          <aside className="socialRightColumn">

            <section className="socialSideCard">
              <h3>Mi comunidad</h3>

              <div className="socialCommunityInfo">
                <strong>{comunidad.nombre}</strong>
                <span>{comunidad.direccion}</span>
                <span>{comunidad.numero_viviendas} viviendas</span>
              </div>
            </section>


            <section className="socialSideCard">
              <div className="socialSideHeader">
                <h3>Servicios contratados</h3>

                <Link href="/vecino/contratos">
                  Ver todos
                </Link>
              </div>

              {contratos.map((contrato) => (
                <div
                  className="socialContract"
                  key={contrato.contrato_id}
                >
                  <div>
                    <strong>{contrato.servicio}</strong>
                    <span>{contrato.proveedor}</span>
                  </div>

                  <span>{contrato.estado}</span>
                </div>
              ))}
            </section>


            <section className="socialSideCard">
              <h3>Accesos rápidos</h3>

              <div className="socialQuickLinks">
                <Link href="/vecino/incidencias">
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
              </div>
            </section>

          </aside>

        </section>

      </main>
    </div>
  );
}