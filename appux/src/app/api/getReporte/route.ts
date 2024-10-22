import { conn } from "@/utils/db";

export async function POST(request: Request): Promise<Response> {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return new Response("Solicitud JSON inválida" + error, { status: 400 });
    }

    const { reporteId } = requestBody;

    if (!reporteId) {
      return new Response("Reporte ID no proporcionado", { status: 400 });
    }

    const results = await conn?.query("SELECT * FROM reporte WHERE id = $1", [
      reporteId,
    ]);
    const evaluaciones = results?.rows;

    if (!evaluaciones || evaluaciones.length === 0) {
      return new Response("Reporte no encontrado", { status: 404 });
    }

    const jsonData = evaluaciones[0].j_reporte;
    if (!jsonData) {
      return new Response("Reporte no encontrado", { status: 404 });
    }

    return new Response(jsonData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error del Servidor: " + error, { status: 500 });
  }
}
