import { getConnection } from "../../../lib/db";

export async function GET() {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT COUNT(*) AS total
      FROM comunidades
    `);

    return Response.json({
      conexion: "correcta",
      comunidades: result.recordset[0].total,
    });
  } catch (error) {
    console.error("Error conectando con Azure SQL:", error);

    return Response.json(
      {
        conexion: "error",
        mensaje: error.message,
      },
      { status: 500 }
    );
  }
}