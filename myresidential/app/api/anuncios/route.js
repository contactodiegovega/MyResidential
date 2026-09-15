import { getConnection } from "../../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      comunidadId,
      viviendaId,
      titular,
      texto,
    } = body;

    if (
      !comunidadId ||
      !viviendaId ||
      !titular?.trim() ||
      !texto?.trim()
    ) {
      return Response.json(
        { error: "Completa el titular y el texto del anuncio." },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("comunidadId", comunidadId)
      .input("viviendaId", viviendaId)
      .input("titular", titular.trim())
      .input("texto", texto.trim())
      .query(`
        INSERT INTO anuncios (
          comunidad_id,
          vivienda_id,
          titular,
          texto,
          fecha_publicacion,
          activo
        )
        OUTPUT INSERTED.anuncio_id
        VALUES (
          @comunidadId,
          @viviendaId,
          @titular,
          @texto,
          GETDATE(),
          1
        )
      `);

    return Response.json({
      ok: true,
      anuncioId: result.recordset[0].anuncio_id,
    });
  } catch (error) {
    console.error("Error publicando anuncio:", error);

    return Response.json(
      { error: "No se ha podido publicar el anuncio." },
      { status: 500 }
    );
  }
}