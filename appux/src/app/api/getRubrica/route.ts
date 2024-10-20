import { conn } from "@/utils/db";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: Request) {
    const client = await conn?.connect();

    try {
        // Extract the rubric ID from the URL parameters
        const url = new URL(request.url);
        const rubricaId = parseInt(url.searchParams.get("id") || "0", 10);

        if (!rubricaId) {
            return new Response("ID de rúbrica no proporcionado o inválido", { status: 400 });
        }

        // Query the database to get the ruta_rubrica JSON path
        const rubricaResult = await client?.query(
            `SELECT ruta_rubrica 
             FROM rubrica 
             WHERE id = $1`, 
            [rubricaId]
        );

        if (!rubricaResult || rubricaResult.rows.length === 0) {
            return new Response("Rúbrica no encontrada", { status: 404 });
        }

        const rutaRubrica = rubricaResult.rows[0].ruta_rubrica;

        // Read the JSON file from the path obtained
        const jsonFilePath = path.resolve(rutaRubrica);
        const jsonData = await fs.readFile(jsonFilePath, "utf-8");

        // Return the JSON content as the response
        return new Response(jsonData, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        console.error("Error al obtener la rúbrica:", error);
        return new Response("Error del Servidor", { status: 500 });
    } finally {
        // Close the connection
        client?.release();
    }
}