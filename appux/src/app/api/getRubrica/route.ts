import { conn } from "@/utils/db";

export async function GET(request: Request) {
  const client = await conn?.connect();

  try {
    // Extract the rubric ID from the URL parameters
    const url = new URL(request.url);
    const rubricaId = parseInt(url.searchParams.get("id") || "0", 10);

    if (!rubricaId) {
      return new Response("ID de rúbrica no proporcionado o inválido", {
        status: 400,
      });
    }

    // Query the database to get the j_rubrica JSON path
    const rubricaResult = await client?.query(
      `SELECT j_rubrica 
             FROM rubrica 
             WHERE id = $1`,
      [rubricaId]
    );

    if (!rubricaResult || rubricaResult.rows.length === 0) {
      return new Response("Rúbrica no encontrada", { status: 404 });
    }

    const jsonData = rubricaResult.rows[0].j_rubrica;

    // Return the JSON content as the response
    return new Response(jsonData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al obtener la rúbrica:", error);
    return new Response("Error del Servidor es: " + error, { status: 500 });
  } finally {
    // Close the connection
    client?.release();
  }
}
