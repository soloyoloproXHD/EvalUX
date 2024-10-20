import { conn } from "@/utils/db";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request): Promise<Response> {
    try {
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (jsonError) {
            return new Response("Solicitud JSON inválida", { status: 400 });
        }

        const { reporteId } = requestBody;

        if (!reporteId) {
            return new Response("Reporte ID no proporcionado", { status: 400 });
        }

        const results = await conn?.query('SELECT * FROM reporte WHERE id = $1', [reporteId]);
        const evaluaciones = results?.rows;

        if (!evaluaciones || evaluaciones.length === 0) {
            return new Response("Reporte no encontrado", { status: 404 });
        }

        const rutaReporte = evaluaciones[0].path_reporte;

        if (!rutaReporte) {
            return new Response("El reporte no tiene una ruta asociada", { status: 404 });
        }

        console.log("Ruta del reporte:", rutaReporte);
        const jsonFilePath = path.resolve(rutaReporte);
        const jsonData = await fs.readFile(jsonFilePath, "utf-8");

        return new Response(jsonData, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        console.error(error);
        return new Response('Error del Servidor: ' + error, { status: 500 });
    }
}
