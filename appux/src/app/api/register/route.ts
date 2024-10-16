import { conn } from "../../../utils/db";
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
    if (!conn) {
      return new Response(JSON.stringify({ message: 'Error de conexión a la base de datos' }), { status: 500 });
    }
    const userExist = await conn.query('SELECT * FROM usuario WHERE "correoE" = $1', [correoE]);
    if (userExist && userExist.rowCount !== null && userExist.rowCount > 0) {
      return new Response(JSON.stringify({ message: 'El correo ya está registrado' }), { status: 400 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar el nuevo usuario en la base de datos
    await conn.query(
      'INSERT INTO usuario (nombres, apellidos, "correoE", contrasena, fecha_registro) VALUES ($1, $2, $3, $4, NOW())',
      [nombres, apellidos, correoE, hashedPassword]
    );

    return new Response(JSON.stringify({ message: 'Usuario registrado exitosamente' }), { status: 201 });
  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({ message: 'Error en el servidor: ' + error }), { status: 500 });
  }
}