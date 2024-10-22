import { conn } from "../../../utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { nombres, apellidos, correoE, contrasena } = await request.json();

    console.log("Request Body:", { nombres, apellidos, correoE, contrasena });

    // Validación de campos
    if (!nombres || !apellidos || !correoE || !contrasena) {
      return new Response(
        JSON.stringify({ message: "Todos los campos son requeridos" }),
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    if (!conn) {
      return new Response(
        JSON.stringify({ message: "Error de conexión a la base de datos" }),
        { status: 500 }
      );
    }
    const userExist = await conn.query(
      'SELECT * FROM usuario WHERE "correoE" = $1',
      [correoE]
    );
    if (userExist && userExist.rowCount !== null && userExist.rowCount > 0) {
      return new Response(
        JSON.stringify({ message: "El correo ya está registrado" }),
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar el nuevo usuario en la base de datos
    const result = await conn.query(
      'INSERT INTO usuario (nombres, apellidos, "correoE", contrasena, fecha_registro) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
      [nombres, apellidos, correoE, hashedPassword]
    );

    const userId = result.rows[0].id;

    const newS = await conn.query(
      'SELECT id, nombres, "correoE", apellidos, img, fecha_registro FROM usuario WHERE id = $1',
      [userId]
    );

    const user = newS.rows[0];

    // Crear y devolver token JWT
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
      expiresIn: "24h",
    });

    console.log("Usuario registrado exitosamente:", { token });

    return new Response(
      JSON.stringify({
        message: "Usuario registrado exitosamente",
        token,
        userId,
        user,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return new Response(
      JSON.stringify({ message: "Error en el servidor: " + error }),
      { status: 500 }
    );
  }
}
