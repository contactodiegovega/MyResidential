import { getConnection } from "../../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      comunidadId,
      tipo,
      descripcion,
      prioridad,
    } = body;

    if (!comunidadId || !tipo || !descripcion || !prioridad) {
      return Response.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("comunidadId", comunidadId)
      .input("tipo", tipo)
      .input("descripcion", descripcion)
      .input("prioridad", prioridad)
      .query(`
        INSERT INTO incidencias (
          comunidad_id,
          tipo,
          descripcion,
          fecha_apertura,
          estado,
          prioridad
        )
        OUTPUT INSERTED.incidencia_id
        VALUES (
          @comunidadId,
          @tipo,
          @descripcion,
          GETDATE(),
          'Abierta',
          @prioridad
        )
      `);

    return Response.json({
      ok: true,
      incidenciaId: result.recordset[0].incidencia_id,
    });
  } catch (error) {
    console.error("Error creando incidencia:", error);

    return Response.json(
      {
        error: "No se ha podido registrar la incidencia.",
      },
      { status: 500 }
    );
  }
}