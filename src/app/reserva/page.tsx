"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaArrowRight, FaChevronDown, FaChevronRight } from "react-icons/fa";

const primaryImage = "/assets/reserva-page.png";
// Gallery can be extended; controls show only if multiple images
const galleryImages = [primaryImage];

export default function ReservaPage() {
  const { data: session } = useSession();
  const [visitPreference, setVisitPreference] = useState("si");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [feedback, setFeedback] = useState<string|null>(null);
  const user = session?.user;

  // CTA derivada del usuario (no utilizada en esta vista por ahora)

  return (
    <main>
        <section className="mx-auto max-w-screen-xl px-6 pb-10 pt-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">
              Reservá hoy
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight text-neutral-900 md:text-6xl">
              Agendá tu lugar en La Ofi
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-screen-xl px-6 pb-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
            <form
              id="reserva-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setStatus("loading");
                setFeedback(null);
                try {
                  const res = await fetch("/api/reserva", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, phone, message, visit: visitPreference }),
                  });
                  if (!res.ok) {
                    const data = await res.json().catch(() => null) as unknown;
                    let errMsg = "No pudimos procesar tu solicitud";
                    if (data && typeof data === "object" && "message" in data) {
                      const msg = (data as { message?: unknown }).message;
                      if (typeof msg === "string") errMsg = msg;
                    }
                    throw new Error(errMsg);
                  }
                  // No necesitamos procesar el cuerpo en éxito
                  setStatus("success");
                  setFeedback("Recibimos tu solicitud. Te contactaremos a la brevedad.");
                  // limpiar
                  setName("");
                  setEmail("");
                  setPhone("");
                  setMessage("");
                } catch (err) {
                  setStatus("error");
                  setFeedback(err instanceof Error ? err.message : "Error desconocido");
                }
              }}
              className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <div className="space-y-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-left text-lg font-semibold text-neutral-900"
                >
                  Espacio compartido
                  <FaChevronDown className="h-4 w-4 text-neutral-500" />
                </button>
                <div className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-700">
                  <span className="inline-flex h-2 w-2 rounded-full bg-neutral-500" />
                  Capacidad de 24 puestos
                </div>
                <p className="text-sm text-neutral-600">
                  Completá el formulario y coordinaremos una visita, o si lo preferís, un miembro de nuestro equipo se pondrá en contacto con vos para conocer tus necesidades y asesorarte en la elección del espacio que mejor se adecue a vos.
                </p>
              </div>

              <div className="grid gap-4">
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
                  Tu nombre*
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ingresa tu nombre"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
                  Tu correo*
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nombre@empresa.com"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
                  Tu número de teléfono
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Ej: +54 9 11 1234 5678"
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
                  Contanos más sobre tu necesidad
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="¿Cuántas personas son? ¿Qué tipo de espacio buscan?"
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                  />
                </label>
              </div>

              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-neutral-800">
                  ¿Querés programar una visita?
                </legend>
                <label className="flex items-center gap-3 text-sm text-neutral-700">
                  <input
                    type="radio"
                    name="visit"
                    value="si"
                    checked={visitPreference === "si"}
                    onChange={() => setVisitPreference("si")}
                    className="h-4 w-4"
                  />
                  Sí, programar una visita
                </label>
                <label className="flex items-center gap-3 text-sm text-neutral-700">
                  <input
                    type="radio"
                    name="visit"
                    value="no"
                    checked={visitPreference === "no"}
                    onChange={() => setVisitPreference("no")}
                    className="h-4 w-4"
                  />
                  No, quisiera tener más información
                </label>
              </fieldset>

              {feedback && (
                <div className={`rounded-lg border px-4 py-3 text-sm ${status==="success"?"border-green-200 bg-green-50 text-green-700":"border-red-200 bg-red-50 text-red-600"}`}>
                  {feedback}
                </div>
              )}

              <button
                type="submit"
                disabled={status==="loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#fdca00] px-6 py-3 text-base font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Reservar espacio
                <FaArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 min-h-[520px] md:min-h-[560px] lg:min-h-[680px]">
              <div className="relative w-full h-full">
                <Image
                  src={galleryImages[0]}
                  alt="Personas trabajando en La Ofi"
                  fill
                  sizes="100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  aria-label="Siguiente imagen"
                  className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md transition hover:bg-white"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              )}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                  {galleryImages.map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 w-2 rounded-full ${index === 0 ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    );
}
