import { NextRequest, NextResponse } from "next/server";
import { buildReservationEmail, sendReservationEmail } from "@/lib/email";

const MAX_MESSAGE_LENGTH = 2000;

const sanitize = (value: string) => value.replace(/[<>]/g, "");

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "No pudimos leer la información del formulario." }, { status: 400 });
  }

  const rawName = typeof body.name === "string" ? body.name.trim() : "";
  const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
  const rawPhone = typeof body.phone === "string" ? body.phone.trim() : "";
  const rawMessage = typeof body.message === "string" ? body.message.trim() : "";
  const rawVisit = typeof body.visit === "string" ? body.visit.trim() : "si";

  if (!rawName || !rawEmail) {
    return NextResponse.json({ message: "Por favor completá nombre y correo." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
    return NextResponse.json({ message: "Ingresá un correo válido." }, { status: 400 });
  }
  if (rawMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ message: "El mensaje es demasiado extenso." }, { status: 400 });
  }

  const payload = {
    name: sanitize(rawName),
    email: rawEmail,
    phone: sanitize(rawPhone),
    message: sanitize(rawMessage),
    visit: (rawVisit === "no" ? "no" : "si") as "si" | "no",
  };

  const emailContent = buildReservationEmail(payload);
  const isProduction = process.env.NODE_ENV === "production";
  const toAddress = process.env.CONTACT_FORM_RECIPIENT || process.env.SMTP_USER || "contacto-pruebas@laofi.com";

  if (!isProduction) {
    return NextResponse.json({
      ok: true,
      preview: {
        to: toAddress,
        from: payload.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      },
    });
  }

  try {
    await sendReservationEmail(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending reservation email", error);
    return NextResponse.json({ message: "No pudimos enviar tu solicitud. Probá más tarde." }, { status: 500 });
  }
}
