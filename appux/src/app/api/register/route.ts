import { sql } from "@vercel/postgres";

import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { nombres, apellidos, correoE, contrasena } = await request.json();

    console.log('Request Body:', { nombres, apellidos, correoE, contrasena });

    // Validación de campos
    if (!nombres || !apellidos || !correoE || !contrasena) {
      return new Response(JSON.stringify({ message: 'Todos los campos son requeridos' }), { status: 400 });
    }

    // Verificar si el usuario ya existe
    const userExist = await sql`SELECT * FROM usuario WHERE "correoE" = ${correoE}`;
    if (userExist?.rowCount ?? 0 > 0) {
      return new Response(JSON.stringify({ message: 'El correo ya está registrado' }), { status: 400 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar el nuevo usuario en la base de datos
    await sql`INSERT INTO usuario (nombres, apellidos, "correoE", contrasena, fecha_registro) VALUES (${nombres}, ${apellidos}, ${correoE}, ${hashedPassword}, NOW())`;

    return new Response(JSON.stringify({ message: 'Usuario registrado exitosamente' }), { status: 201 });
  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({ message: 'Error en el servidor' + error }), { status: 500 });
  }
}
