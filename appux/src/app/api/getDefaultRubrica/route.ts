import { conn } from "@/utils/db";

interface Escenario {
  puntaje: number;
  contenido: string;
}

interface Subcategory {
  id: string;
  contenido: string;
  incognitas?: string;
  escenarios?: Escenario[];
}

interface SelectedP {
  id: number;
  label: string;
  categorias: Subcategory[];
}

export async function POST() {
  try {
    // Obtener la rúbrica con el nombre "default"
    const rubricaResult = await conn?.query(
      `SELECT * FROM rubrica WHERE nombre = 'default'`
    );
    const rubrica = rubricaResult?.rows[0];

    if (!rubrica) {
      return new Response('Rúbrica no encontrada', { status: 404 });
    }

    // Obtener los principios asociados a la rúbrica
    const principiosResult = await conn?.query(
      `SELECT p.id, p.contenido FROM princ_rub pr
       JOIN principio p ON pr.principio_id = p.id
       WHERE pr.rubrica_id = $1`,
      [rubrica.id]
    );
    const principios = principiosResult?.rows;

    if (!principios || principios.length === 0) {
      return new Response('Principios no encontrados', { status: 404 });
    }

    // Obtener las categorías y escenarios asociados a cada principio
    const selectedP: SelectedP[] = [];

    for (const principio of principios) {
      const categoriasResult = await conn?.query(
        `SELECT c.id, c.contenido FROM categoria c
         WHERE c.principio_id = $1`,
        [principio.id]
      );
      const categorias = categoriasResult?.rows;

      const categoriasFormatted: Subcategory[] = [];

      if (categorias && categorias.length > 0) {
        for (const categoria of categorias) {
          const escenariosResult = await conn?.query(
            `SELECT e.puntaje, e.contenido FROM ecenario e
             WHERE e.categoria_id = $1`,
            [categoria.id]
          );
          const escenarios = escenariosResult?.rows;

          const incognitasResult = await conn?.query(
            `SELECT i.pregunta FROM incognita i
             WHERE i.categoria_id = $1`,
            [categoria.id]
          );
          const incognitas = incognitasResult?.rows.map((row) => row.pregunta).join(', ');

          categoriasFormatted.push({
            id: categoria.id,
            contenido: categoria.contenido,
            incognitas: incognitas,
            escenarios: escenarios
          });
        }
      }

      selectedP.push({
        id: principio.id,
        label: principio.contenido,
        categorias: categoriasFormatted
      });
    }

    const responseData = {
      nombreR: rubrica.nombre,
      selectedP: selectedP
    };

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error(error); // Log para depuración
    return new Response('Error del Servidor', { status: 500 });
  }
}