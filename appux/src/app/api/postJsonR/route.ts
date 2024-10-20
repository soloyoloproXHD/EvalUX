import { conn } from "@/utils/db";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Definición de tipos para los datos recibidos
interface Categoria {
    id: number;
    contenido: string;
}

interface Principio {
    id: number;
    label: string;
    categorias: Categoria[];
}

interface DataWithUserId {
    nombreR: string;
    selectedP: Principio[];
    userId: string;
}

export async function POST(request: Request): Promise<Response> {
    const client = await conn?.connect();

    try {
        // Extraer el cuerpo de la solicitud
        const result: { dataWithUserId: DataWithUserId } = await request.json();
        const { nombreR, selectedP, userId } = result.dataWithUserId;

        const salt = "R";
        const valorRandom = crypto.randomBytes(3).toString("hex").slice(0, 5 - salt.length);

        // Limitar el nombreR a 50 caracteres máximo para evitar que la ruta sea muy larga
        const nombreRShort = nombreR.slice(0, 50);
        const jsonFolder = "../appux/src/app/api/json";
        const filePath = path.join(jsonFolder, `${nombreRShort}-${valorRandom}.json`);

        // Verificar si el directorio existe y crearlo si no
        if (!fs.existsSync(jsonFolder)) {
            fs.mkdirSync(jsonFolder, { recursive: true });
        }

        await client?.query("BEGIN");

        // 1. Insertar la rúbrica
        const rubricaResult = await client?.query<{ id: number }>(
            `INSERT INTO rubrica (nombre, ruta_rubrica, usuario_id) VALUES ($1, $2, $3) RETURNING id`,
            [nombreR, filePath, parseInt(userId, 10)]
        );

        const rubricaId = rubricaResult?.rows[0]?.id;
        if (!rubricaId) {
            throw new Error("No se pudo insertar la rúbrica.");
        }

        // 2. Insertar los principios y sus relaciones con la rúbrica
        for (const principio of selectedP) {
            // Insertar el principio si no existe
            const principioResult = await client?.query<{ id: number }>(
                `INSERT INTO principio (id, contenido) 
                 VALUES ($1, $2) 
                 ON CONFLICT (id) DO NOTHING 
                 RETURNING id`,
                [principio.id, principio.label]
            );

            const principioId = principioResult && principioResult.rowCount !== null && principioResult.rowCount > 0
                ? principioResult.rows[0].id
                : principio.id;

            // Insertar la relación en princ_rub
            await client?.query(
                `INSERT INTO princ_rub (rubrica_id, principio_id) VALUES ($1, $2)`,
                [rubricaId, principioId]
            );

            // 3. Insertar las categorías relacionadas con el principio
            for (const categoria of principio.categorias) {
                await client?.query(
                    `INSERT INTO categoria (id, contenido, principio_id) 
                     VALUES ($1, $2, $3) 
                     ON CONFLICT (id) DO NOTHING`,
                    [categoria.id, categoria.contenido, principioId]
                );
            }
        }

        await client?.query("COMMIT");

        // Crear y escribir el archivo JSON
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf8");

        return new Response("Archivo JSON creado exitosamente", { status: 201 });

    } catch (error) {
        await client?.query("ROLLBACK");
        console.error("Error al guardar la rúbrica:", error);
        return new Response("Error del Servidor" + error, { status: 500 });
    } finally {
        client?.release();
    }
}
