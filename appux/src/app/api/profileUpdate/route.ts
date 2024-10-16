import { NextRequest, NextResponse } from 'next/server';
import { conn } from "@/utils/db";
import { promises as fs } from 'fs';
import { join } from 'path'; // Asegúrate de importar join
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        // Obtiene los datos del formulario de la solicitud.
        const data = await req.formData();
        const imgFile = data.get("img"); // Extrae el archivo de imagen del FormData
        const id = data.get("id"); // Extrae el id del FormData
        const nombres = data.get("nombres");
        const apellidos = data.get("apellidos");
        const correoE = data.get("correoE");
        const contrasena = data.get("contrasena");

        // Validar que se haya proporcionado el ID
        if (!id) {
            return NextResponse.json({ message: 'ID de usuario no proporcionado' }, { status: 400 });
        }

        // Validar conexión a la base de datos
        if (!conn) {
            return NextResponse.json({ message: 'Conexión a la base de datos no disponible' }, { status: 500 });
        }

        // Verificar si el usuario existe
        const currentUserResult = await conn.query('SELECT * FROM usuario WHERE id = $1', [id]);
        const currentUser = currentUserResult.rows[0];

        if (!currentUser) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }

        const updates = [];
        const values = [];

        // Actualizar campos según los datos proporcionados
        if (nombres && nombres !== currentUser.nombres) {
            updates.push(`nombres = $${values.length + 1}`);
            values.push(nombres);
        }

        if (apellidos && apellidos !== currentUser.apellidos) {
            updates.push(`apellidos = $${values.length + 1}`);
            values.push(apellidos);
        }

        if (correoE && correoE !== currentUser.correoE) {
            updates.push(`correoE = $${values.length + 1}`);
            values.push(correoE);
        }

        if (contrasena && contrasena !== currentUser.contrasena) {
            updates.push(`contrasena = $${values.length + 1}`);
            values.push(contrasena);
        }

        // Manejo de la imagen
        if (imgFile instanceof File && imgFile.size > 0) {
            // Validar tipo de archivo
            if (!['image/png', 'image/jpeg'].includes(imgFile.type)) {
                return NextResponse.json({ message: 'Formato de imagen no permitido' }, { status: 400 });
            }
            
            const fileExtension = imgFile.name.split('.').pop();
            const newFilename = `${uuidv4()}.${fileExtension}`; // Generar un nuevo nombre para la imagen
            const imgPath = `/uploads/${id}-${newFilename}`; // Ruta sin el leading slash
            const newPath = join(process.cwd(), 'public', imgPath); // Ruta completa

            // Leer el contenido del archivo y guardarlo
            const bytes = await imgFile.arrayBuffer(); // Convierte el archivo a un ArrayBuffer
            const buffer = Buffer.from(bytes); // Convierte el ArrayBuffer a un objeto Buffer de Node.js

            await fs.writeFile(newPath, buffer); // Guarda el archivo en la ruta completa

            // Si la imagen ha cambiado, actualiza la ruta en la base de datos
            if (imgPath !== currentUser.img) {
                updates.push(`img = $${values.length + 1}`);
                values.push(imgPath);
            }
        }

        // Si no se realizaron cambios, devuelve un mensaje
        if (updates.length === 0) {
            return NextResponse.json({ message: 'No se realizaron cambios en el perfil' }, { status: 400 });
        }

        // Actualizar el usuario en la base de datos
        const updateQuery = `UPDATE usuario SET ${updates.join(', ')} WHERE id = $${values.length + 1}`;
        values.push(id);
        await conn.query(updateQuery, values);

        // Devolver el usuario actualizado
        const updatedUserResult = await conn.query('SELECT * FROM usuario WHERE id = $1', [id]);
        const updatedUser = updatedUserResult.rows[0];

        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        return NextResponse.json({ message: 'Error al actualizar el perfil', error: (error as Error).message }, { status: 500 });
    }
}

