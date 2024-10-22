import { conn } from "@/utils/db";

export async function POST(request: Request) {
    try {
        // Extraer el cuerpo de la solicitud
        const result  = await request.json();

        const id = result.userId;
        const results = await conn?.query(`SELECT * FROM reporte WHERE usuario_id = ${id}`);
        const evaluaciones = results?.rows;


        return new Response(JSON.stringify(evaluaciones), { status: 200 });
    } catch (error) {
        console.error(error); // Log para depuración
        return new Response('Error del Servidor', { status: 500 });
    }
}
