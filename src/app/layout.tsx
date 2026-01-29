"use client";

import { Geist, Geist_Mono } from "next/font/google";
import AdminNotificationListener from "@/app/components/AdminNotificationListener";
import NavigationBar from "@/app/components/NavigationBar";
import "./globals.css";
import AuthProvider from "./AuthProvider";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
// useSession usado en FooterWithAccount
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Extiende el tipo de usuario de NextAuth para incluir 'role'
declare module "next-auth" {
  interface User {
    role?: string;
  }
}

function FooterWithAccount() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const quickLinks = useMemo(() => {
    const links = [
      { href: "/pedidos/realizar", label: "Realizar pedido" },
      { href: "/pedidos/historial", label: "Historial" },
      { href: "/mis-datos", label: "Mis datos" },
    ];
    if (isAdmin) {
      links.splice(1, 0, { href: "/pedidos", label: "Panel" });
      links.push({ href: "/productos", label: "Productos" }, { href: "/clientes", label: "Usuarios" });
    }
    return links;
  }, [isAdmin]);

  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-4 py-12 md:flex-row md:justify-between md:px-6">
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold tracking-[0.3em] text-white">
              LAOFI
            </span>
            <p className="text-sm font-semibold text-neutral-900">Pedidos de café para la comunidad.</p>
          </div>
          <p className="text-sm text-neutral-600">
            Confirmá tus bebidas sin salir de tu escritorio. Recepción recibe el aviso en tiempo real para que sólo tengas que disfrutar.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900">Accesos rápidos</h3>
            <nav className="flex flex-col gap-2 text-sm text-neutral-600">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-neutral-900">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900">Soporte</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>Recepción: 11 5263 3006</li>
              <li>hola@laofi.com</li>
              <li>Av. Rivadavia 14084, Ramos Mejía</li>
              <li>Lunes a viernes · 8 a 19 h</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 bg-white/60 py-5">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 px-4 text-xs text-neutral-500 md:flex-row md:px-6">
          <span>© {year} laofi.co · Todos los derechos reservados.</span>
          <span>Versiones nuevas del panel se publican periódicamente.</span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logolaofi.svg" type="image/svg+xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-dvh flex flex-col`}>
        <AuthProvider>
          <NavigationBar pathname={pathname} />
          <AdminNotificationListener />
          <main className="flex flex-col flex-grow w-full">{children}</main>
          <FooterWithAccount />
        </AuthProvider>
      </body>
    </html>
  );
}
