import { conn } from "@/utils/db";

export async function POST(request: Request): Promise<Response> {
  const client = await conn?.connect();

  try {
    // Extraer el cuerpo de la solicitud
    const result = await request.json();

    console.log("Request body:", result); // Log the request body for debugging

    // Extraer las propiedades necesarias del objeto result
    const { userId, nombreE, descripcion, rubricaId } = result;

    // Verificar que todas las propiedades necesarias estén definidas
    const requiredFields = {
      userId,
      nombreE,
      descripcion,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        throw new Error(
          `Falta el dato requerido: ${key}, recargue la página e intente de nuevo.`
        );
      }
    }

    await client?.query("BEGIN");

    // Insertar el reporte de evaluación
    const evaluacionResult = await client?.query<{ id: number }>(
      `INSERT INTO reporte  (nombre, descripcion, j_reporte, usuario_id ,rubrica_id, fecha_registro)  VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id`,
      [
        nombreE,
        descripcion,
        result,
        parseInt(userId, 10),
        rubricaId,
        new Date(), // Fecha de registro actual
      ]
    );

    const reporteId = evaluacionResult?.rows[0]?.id;
    if (!reporteId) {
      throw new Error("No se pudo insertar el reporte.");
    }

    // Confirmar la transacción
    await client?.query("COMMIT");

    return new Response(
      JSON.stringify({
        message: "Evaluación insertada correctamente.",
        reporteId: reporteId,
      }),
      { status: 200 }
    );
  } catch (err) {
    await client?.query("ROLLBACK");
    console.error("Error al insertar la evaluación:", err);
    return new Response("Error al insertar la evaluación en ." + err, {
      status: 500,
    });
  } finally {
    client?.release();
  }
}
