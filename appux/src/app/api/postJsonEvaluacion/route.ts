import { conn } from "@/utils/db";
import fs from "fs";
import path from "path";
import crypto from "crypto";


export async function POST(request: Request): Promise<Response> {
    const client = await conn?.connect();

    try {
        // Extraer el cuerpo de la solicitud
        const result = await request.json();

        console.log("Request body:", result); // Log the request body for debugging

        // Extraer las propiedades necesarias del objeto result
        const { nombreR, evaluacionGeneral, selectedP, userId, nombreE, descripcion, rubricaId } = result;

        // Verificar que todas las propiedades necesarias estén definidas
        const requiredFields = {
            nombreR,
            evaluacionGeneral,
            selectedP,
            userId,
            nombreE,
            descripcion
        };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                throw new Error(`Falta el dato requerido: ${key}, recargue la página e intente de nuevo.`);
            }
        }

        const salt = "R";
        const valorRandom = crypto.randomBytes(3).toString("hex").slice(0, 5 - salt.length);

        // Generar el nombre del archivo JSON
        const nombreRShort = "Reporte" + nombreR.slice(0, 50);
        const jsonFolder = "../appux/src/app/api/json";
        const filePath = path.join(jsonFolder, `${nombreRShort}-${valorRandom}.json`); // Nombre del archivo JSON

        // Verificar si el directorio existe y crearlo si no existe
        if (!fs.existsSync(jsonFolder)) {
            fs.mkdirSync(jsonFolder, { recursive: true });
        }


        await client?.query("BEGIN");


        // Variables para almacenar las evaluaciones
        let v_usabilidad: number | null = null;
        let v_accesibilidad: number | null = null;
        let v_simplicidad: number | null = null;
        let v_consistencia: number | null = null;
        let v_centrado_en_el_usuario: number | null = null;

        // Mapear las evaluaciones a los campos correspondientes
        selectedP.forEach((principio: { label: string; evaluacionFinal: number | null; }) => {
            switch (principio.label.toLowerCase()) {
                case "usabilidad":
                    v_usabilidad = principio.evaluacionFinal;
                    break;
                case "accesibilidad":
                    v_accesibilidad = principio.evaluacionFinal;
                    break;
                case "simplicidad":
                    v_simplicidad = principio.evaluacionFinal;
                    break;
                case "consistencia":
                    v_consistencia = principio.evaluacionFinal;
                    break;
                case "centrado en el usuario":
                    v_centrado_en_el_usuario = principio.evaluacionFinal;
                    break;
                default:
                    break;
            }
        });

        // Insertar el reporte de evaluación
        const evaluacionResult = await client?.query<{ id: number }>(
            `INSERT INTO reporte 
            (nombre, descripcion, v_usabilidad, v_accesibilidad, v_simplicidad, v_consistencia, 
            v_centrado_en_el_usuario, v_final, usuario_id, path_reporte ,rubrica_id, fecha_registro) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING id`,
            [
                nombreE,
                descripcion,
                v_usabilidad,
                v_accesibilidad,
                v_simplicidad,
                v_consistencia,
                v_centrado_en_el_usuario,
                evaluacionGeneral,
                parseInt(userId, 10),
                filePath,
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
        // Crear y escribir el archivo JSON
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf8");
        return new Response(JSON.stringify({ message: "Evaluación insertada correctamente.", reporteId: reporteId }),
            { status: 200 });
    } catch (err) {
        await client?.query("ROLLBACK");
        console.error("Error al insertar la evaluación:", err);
        return new Response("Error al insertar la evaluación en ." + err, { status: 500 });
    } finally {
        client?.release();
    }
}
