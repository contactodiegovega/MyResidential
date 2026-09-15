import { getConnection } from "../../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      viviendaId,
      comunidadId,
      espacio,
      fechaReserva,
      horaInicio,
      horaFin,
    } = body;

    if (
      !viviendaId ||
      !comunidadId ||
      !espacio ||
      !fechaReserva ||
      !horaInicio ||
      !horaFin
    ) {
      return Response.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    if (horaFin <= horaInicio) {
      return Response.json(
        { error: "La hora de fin debe ser posterior a la hora de inicio." },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    // Comprobamos que no haya otra reserva solapada
    const conflicto = await pool
      .request()
      .input("comunidadId", comunidadId)
      .input("espacio", espacio)
      .input("fechaReserva", fechaReserva)
      .input("horaInicio", horaInicio)
      .input("horaFin", horaFin)
      .query(`
        SELECT COUNT(*) AS total
        FROM reservas
        WHERE comunidad_id = @comunidadId
          AND espacio = @espacio
          AND fecha_reserva = @fechaReserva
          AND estado <> 'Cancelada'
          AND hora_inicio < @horaFin
          AND hora_fin > @horaInicio
      `);

    if (conflicto.recordset[0].total > 0) {
      return Response.json(
        {
          error:
            "Ese espacio ya está reservado durante esa franja horaria.",
        },
        { status: 409 }
      );
    }

    const result = await pool
      .request()
      .input("viviendaId", viviendaId)
      .input("comunidadId", comunidadId)
      .input("espacio", espacio)
      .input("fechaReserva", fechaReserva)
      .input("horaInicio", horaInicio)
      .input("horaFin", horaFin)
      .query(`
        INSERT INTO reservas (
          vivienda_id,
          comunidad_id,
          espacio,
          fecha_reserva,
          hora_inicio,
          hora_fin,
          estado
        )
        OUTPUT INSERTED.reserva_id
        VALUES (
          @viviendaId,
          @comunidadId,
          @espacio,
          @fechaReserva,
          @horaInicio,
          @horaFin,
          'Confirmada'
        )
      `);

    return Response.json({
      ok: true,
      reservaId: result.recordset[0].reserva_id,
    });
  } catch (error) {
    console.error("Error creando reserva:", error);

    return Response.json(
      { error: "No se ha podido realizar la reserva." },
      { status: 500 }
    );
  }
}