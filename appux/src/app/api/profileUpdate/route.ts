import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/utils/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.formData();
    const id = data.get("id") as string | null;
    const nombres = data.get("nombres") as string | null;
    const apellidos = data.get("apellidos") as string | null;
    const correoE = data.get("correoE") as string | null;
    const contrasena = data.get("contrasena") as string | null;
    const imgFile = data.get("img") as File | null;

    if (!id) {
      return NextResponse.json(
        { message: "ID de usuario no proporcionado" },
        { status: 400 }
      );
    }

    if (!conn) {
      return NextResponse.json(
        { message: "Conexión a la base de datos no disponible" },
        { status: 500 }
      );
    }

    const currentUserResult = await conn.query(
      "SELECT * FROM usuario WHERE id = $1",
      [id]
    );
    const currentUser = currentUserResult.rows[0];
    if (!currentUser) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const updates: string[] = [];
    const values: (string | Buffer)[] = [];

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
      const isMatch = await bcrypt.compare(contrasena, currentUser.contrasena);
      if (!isMatch) {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        updates.push(`contrasena = $${values.length + 1}`);
        values.push(hashedPassword);
      }
    }

    if (imgFile) {
      const imgBuffer = Buffer.from(await imgFile.arrayBuffer());
      const imgBase64 = imgBuffer.toString("base64");
      updates.push(`img = $${values.length + 1}`);
      values.push(imgBase64);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { message: "No se realizaron cambios en el perfil" },
        { status: 400 }
      );
    }

    const updateQuery = `UPDATE usuario SET ${updates.join(", ")} WHERE id = $${
      values.length + 1
    }`;
    values.push(id);
    await conn.query(updateQuery, values);

    const updatedUserResult = await conn.query(
      "SELECT * FROM usuario WHERE id = $1",
      [id]
    );
    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    return NextResponse.json(
      {
        message: "Error al actualizar el perfil",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
