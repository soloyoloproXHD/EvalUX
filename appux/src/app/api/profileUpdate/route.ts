import { NextRequest, NextResponse } from 'next/server';
import { conn } from "@/utils/db";
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const id = data.get("id");
        const nombres = data.get("nombres");
        const apellidos = data.get("apellidos");
        const correoE = data.get("correoE");
        const contrasena = data.get("contrasena");
        const imgFile = data.get("img");

        if (!id) {
            return NextResponse.json({ message: 'ID de usuario no proporcionado' }, { status: 400 });
        }

        if (!conn) {
            return NextResponse.json({ message: 'Conexión a la base de datos no disponible' }, { status: 500 });
        }

        const currentUserResult = await conn.query('SELECT * FROM usuario WHERE id = $1', [id]);
        const currentUser = currentUserResult.rows[0];
        if (!currentUser) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }

        const updates = [];
        const values = [];

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

        if (contrasena) {
            const isMatch = bcrypt.compare(contrasena as string, currentUser.contrasena);
            if (!isMatch) {
                const hashedPassword = bcrypt.hash(contrasena as string, 10);
                updates.push(`contrasena = $${values.length + 1}`);
                values.push(hashedPassword);
            }
        }

        if (imgFile instanceof File && imgFile.size > 0) {
            const imgPath = await handleImageUpload(id as string, imgFile);
            if (imgPath !== currentUser.img) {
                updates.push(`img = $${values.length + 1}`);
                values.push(imgPath);
            }
        }

        if (updates.length === 0) {
            return NextResponse.json({ message: 'No se realizaron cambios en el perfil' }, { status: 400 });
        }

        const updateQuery = `UPDATE usuario SET ${updates.join(', ')} WHERE id = $${values.length + 1}`;
        values.push(id);
        await conn.query(updateQuery, values);

        const updatedUserResult = await conn.query('SELECT * FROM usuario WHERE id = $1', [id]);
        const updatedUser = updatedUserResult.rows[0];

        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        return NextResponse.json({ message: 'Error al actualizar el perfil', error: (error as Error).message }, { status: 500 });
    }
}

async function handleImageUpload(userId: string, imgFile: File): Promise<string> {
    if (!['image/png', 'image/jpeg'].includes(imgFile.type)) {
        throw new Error('Formato de imagen no permitido');
    }

    const fileExtension = imgFile.name.split('.').pop();
    const newFilename = `${uuidv4()}.${fileExtension}`;
    const imgPath = `/uploads/${userId}-${newFilename}`;
    const newPath = join(process.cwd(), 'public', imgPath);

    const bytes = await imgFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(newPath, buffer);

    return imgPath;
}
