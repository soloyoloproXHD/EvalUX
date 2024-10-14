import { conn } from "@/utils/db";

export async function POST(request: Request) {
    try {
        // Extraer el cuerpo de la solicitud
        const { ids } = await request.json();

        // Validar que ids sea un array y contenga solo números
        if (!Array.isArray(ids) || !ids.every(id => typeof id === 'number' && !isNaN(id))) {
            return new Response('IDs inválidos', { status: 400 });
        }

        // Convertir el array de IDs a una cadena para la consulta SQL
        const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');
        
        // Realizar la consulta SQL
        const result = await conn?.query(`SELECT contenido, principio_id FROM categoria WHERE principio_id IN (${placeholders})`, ids);
        const categorias = result?.rows;

        if (categorias && categorias.length > 0) {
            return new Response(JSON.stringify({ categorias }), { status: 200 });
        } else {
            return new Response('No hay cateorias', { status: 404 });
        }
    } catch (error) {
        console.error(error); // Log para depuración
        return new Response('Error del Servidor', { status: 500 });
    }
}
