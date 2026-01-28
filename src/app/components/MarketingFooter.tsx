"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import Link from "next/link";

export default function MarketingFooter() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const isAdmin = session?.user?.role === "admin";
  const year = new Date().getFullYear();

  const quickLinks = useMemo(() => {
    // Sin autenticación
    if (!session) {
      return [
        { href: "/", label: "Inicio" },
        { href: "/servicios", label: "Servicios" },
        { href: "/pedidos/realizar", label: "App Café" },
        { href: "/reserva", label: "Reservá tu espacio" },
      ];
    }

    // Con autenticación (usuario regular)
    const links = [
      { href: "/pedidos/realizar", label: "Realizar pedido" },
      { href: "/pedidos/historial", label: "Historial" },
      { href: "/mis-datos", label: "Mis datos" },
    ];

    // Admin: agregar enlaces adicionales
    if (isAdmin) {
      links.splice(1, 0, { href: "/pedidos", label: "Panel" });
      links.push(
        { href: "/productos", label: "Productos" },
        { href: "/clientes", label: "Usuarios" }
      );
    }

    return links;
  }, [session, isAdmin]);

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-4 py-12 md:flex-row md:justify-between md:px-6">
        {/* Columna 1: Logo + Descripción */}
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold tracking-[0.3em] text-white">
              LAOFI
            </span>
            <p className="text-sm font-semibold text-neutral-900">
              Pedidos de café para la comunidad.
            </p>
          </div>
          <p className="text-sm text-neutral-600">
            Confirmá tus bebidas sin salir de tu escritorio. Recepción recibe el aviso en tiempo real para que sólo tengas que disfrutar.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
          {/* Columna 2: Enlaces rápidos */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900">
              Accesos rápidos
            </h3>
            <nav className="flex flex-col gap-2 text-sm text-neutral-600">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-neutral-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Columna 3: Contacto */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900">
              Soporte
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>Recepción: 11 5263 3006</li>
              <li>hola@laofi.com</li>
              <li>Av. Rivadavia 14084, Ramos Mejía</li>
              <li>Lunes a viernes · 8 a 19 h</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="border-t border-neutral-200 bg-white/60 py-5">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 px-4 text-xs text-neutral-500 md:flex-row md:px-6">
          <span>© {year} laofi.co · Todos los derechos reservados.</span>
          <span>Versiones nuevas del panel se publican periódicamente.</span>
        </div>
      </div>
    </footer>
  );
}
