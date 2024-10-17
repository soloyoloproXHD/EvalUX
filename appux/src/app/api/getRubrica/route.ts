import { conn } from "@/utils/db";

export async function GET(request: Request) {
    const client = await conn?.connect();

    try {
        // Extraer el ID de la rúbrica de los parámetros de la URL
        const url = new URL(request.url);
        const rubricaId = parseInt(url.searchParams.get("id") || "0", 10);

        if (!rubricaId) {
            return new Response("ID de rúbrica no proporcionado o inválido", { status: 400 });
        }

        // 1. Obtener la información de la rúbrica
        const rubricaResult = await client?.query(
            `SELECT nombre 
             FROM rubrica 
             WHERE id = $1`, 
            [rubricaId]
        );

        if (!rubricaResult || rubricaResult.rows.length === 0) {
            return new Response("Rúbrica no encontrada", { status: 404 });
        }

        const nombreR = rubricaResult.rows[0].nombre;

        // 2. Obtener los principios relacionados con la rúbrica
        const principiosResult = await client?.query(
            `SELECT p.id AS principio_id, p.contenido AS principio_label
             FROM princ_rub pr
             JOIN principio p ON pr.principio_id = p.id
             WHERE pr.rubrica_id = $1`, 
            [rubricaId]
        );

        if (!principiosResult || principiosResult.rows.length === 0) {
            return new Response("No se encontraron principios para la rúbrica", { status: 404 });
        }

        // 3. Obtener las categorías para cada principio
        const principios = await Promise.all(
            principiosResult.rows.map(async (principio) => {
                const categoriasResult = await client?.query(
                    `SELECT id, contenido 
                     FROM categoria 
                     WHERE principio_id = $1`, 
                    [principio.principio_id]
                );

                return {
                    id: principio.principio_id,
                    label: principio.principio_label,
                    categorias: categoriasResult?.rows.map(categoria => ({
                        id: categoria.id,
                        contenido: categoria.contenido,
                    })) || [],
                };
            })
        );

        // 4. Construir el JSON final
        const result = {
            nombreR,
            selectedP: principios,
        };

        // Devolver el JSON como respuesta
        return new Response(JSON.stringify(result, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        console.error("Error al obtener la rúbrica:", error);
        return new Response("Error del Servidor", { status: 500 });
    } finally {
        // Cerrar la conexión
        client?.release();
    }
}
