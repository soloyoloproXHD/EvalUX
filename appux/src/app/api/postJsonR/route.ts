import { conn } from "@/utils/db";
import fs from "fs";
import crypto from "crypto"

export async function POST(request: Request) {
    const client = conn?.connect();
    try {
        // Extraer el cuerpo de la solicitud
        const result  = await request.json();

        const nombre = result.nombreR
        const id = result.userId;
        const salt = "R";
        const valorRandom = crypto.randomBytes(3).toString("hex").slice(0,5 - salt.length);

        const jsonFolder = "../appux/src/app/api/json"
        const filePath = `${jsonFolder}/${nombre}-${valorRandom}.json`;

        (await client)?.query('BEGIN');
        (await client)?.query(`INSERT INTO rubrica (nombre, ruta_rubrica, usuario_id) VALUES ('${nombre}','${filePath}',${id})`);
        (await client)?.query('COMMIT');

        // Crear y escribir el archivo JSON
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf8');

        return new Response('Archivo JSON creado exitosamente', { status: 201 });
    } catch (error) {
        (await client)?.query('ROLLBACK');
        console.error(error); // Log para depuración
        return new Response('Error del Servidor', { status: 500 });
    }
}
