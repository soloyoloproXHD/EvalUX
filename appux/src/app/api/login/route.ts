import { conn } from "@/utils/db";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { correoE, contrasena } = await request.json();
    // Validación de campos
    if (!correoE || !contrasena) {
      return new Response(JSON.stringify({ message: 'Todos los campos son requeridos' }), { status: 400 });
    }

    // Verificar si el usuario existe
    const userResult = await conn?.query('SELECT * FROM usuario WHERE "correoE" = $1', [correoE]);

    if (userResult?.rowCount === 0) {
      return new Response(JSON.stringify({ message: 'Correo o contraseña incorrectos' }), { status: 400 });
    }

    if (!userResult) {
      return new Response(JSON.stringify({ message: 'Correo o contraseña incorrectos' }), { status: 400 });
    }
    const user = userResult.rows[0];

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Correo o contraseña incorrectos' }), { status: 400 });
    }

    // Crear y devolver token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return new Response(JSON.stringify({ message: 'Inicio de sesión exitoso', token }), { status: 200 });
  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({ message: 'Error en el servidor' }), { status: 500 });
  }
}
