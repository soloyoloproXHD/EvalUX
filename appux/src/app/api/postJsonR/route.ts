import { conn } from "@/utils/db";

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

    const { nombreR, userId, selectedP } = result.dataWithUserId;

    await client?.query("BEGIN");

    // 1. Insertar la rúbrica
    const rubricaResult = await client?.query<{ id: number }>(
      `INSERT INTO rubrica (nombre, j_rubrica, usuario_id) VALUES ($1, $2, $3) RETURNING id`,
      [nombreR, result.dataWithUserId, parseInt(userId, 10)]
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

      const principioId =
        principioResult &&
        principioResult.rowCount !== null &&
        principioResult.rowCount > 0
          ? principioResult.rows[0].id
          : principio.id;

      // Insertar la relación en princ_rub
      await client?.query(
        `INSERT INTO princ_rub (rubrica_id, principio_id) VALUES ($1, $2)`,
        [rubricaId, principioId]
      );
    }

    await client?.query("COMMIT");

    return new Response(
      JSON.stringify({ message: "Rubrica creada exitosamente", id: rubricaId }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    await client?.query("ROLLBACK");
    console.error("Error al guardar la rúbrica:", error);
    return new Response("Error del Servidor" + error, { status: 500 });
  } finally {
    client?.release();
  }
}
