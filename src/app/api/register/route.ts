import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import { isAdminEmail } from "@/lib/adminEmails";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: "Email ya registrado" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const role = isAdminEmail(email) ? 'admin' : 'user';
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    return NextResponse.json({ message: "Usuario creado" }, { status: 201 });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
