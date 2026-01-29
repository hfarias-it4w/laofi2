"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";

interface NavLink {
  href: string;
  label: string;
  onClick?: () => void;
}

interface NavigationBarProps {
  pathname?: string | null;
}

export default function NavigationBar({ pathname }: NavigationBarProps) {
  const sessionData = useSession();
  const session = sessionData?.data;
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = session?.user;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Links según autenticación
  const navLinks: NavLink[] = user
    ? [
        { href: "/", label: "Inicio" },
        { href: "/servicios", label: "Servicios" },
        { href: "/reserva", label: "Reservá tu espacio" },
        { href: "/pedidos/realizar", label: "Pedir Cafe" },
        { href: "#", label: "Cerrar sesión", onClick: () => signOut() },
      ]
    : [
        { href: "/", label: "Inicio" },
        { href: "/servicios", label: "Servicios" },
        { href: "/reserva", label: "Reservá tu espacio" },
        { href: "/login", label: "Iniciar sesión" },
      ];

  // Determinar si un enlace está activo
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Ir al inicio">
          <Image src="/logolaofi.svg" alt="La Ofi" width={112} height={40} priority />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-700 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href) && !link.onClick;
            if (link.onClick) {
              return (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className="hover:text-neutral-900"
                >
                  {link.label}
                </button>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  active
                    ? "rounded-lg bg-[#fae79a] px-3 py-1 text-neutral-900"
                    : "hover:text-neutral-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-xl text-neutral-700 transition hover:border-neutral-300 md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <IoMdMenu />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        >
          <div
            className="absolute right-0 top-0 flex h-full w-80 max-w-[80vw] flex-col gap-6 overflow-y-auto bg-white p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del menú móvil */}
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-neutral-900">Menú</p>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-xl text-neutral-700"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
              >
                <IoMdClose />
              </button>
            </div>

            {/* Enlaces de navegación */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href) && !link.onClick;
                if (link.onClick) {
                  return (
                    <button
                      key={link.label}
                      onClick={link.onClick}
                      className="rounded-lg px-4 py-3 text-left text-sm font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-900/5 transition"
                    >
                      {link.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[#fdca00] text-neutral-900"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-900/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
