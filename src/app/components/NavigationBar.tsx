"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { FaSignOutAlt, FaArrowRight } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

interface NavLink {
  href: string;
  label: string;
}

interface NavigationBarProps {
  variant: "authenticated" | "marketing";
  pathname?: string | null;
}

export default function NavigationBar({ variant, pathname }: NavigationBarProps) {
  if (variant === "marketing") {
    return <MarketingNavigation pathname={pathname} />;
  }

  return <AuthenticatedNavigation pathname={pathname} />;
}

function MarketingNavigation({ pathname }: { pathname?: string | null }) {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Determinar enlaces de navegación según la ruta
  const navLinks = useMemo(() => {
    if (pathname === "/") {
      // Página principal
      const links: NavLink[] = [
        { href: "#espacios", label: "Espacios" },
        { href: "#servicios", label: "Servicios" },
        { href: "#ubicacion", label: "Ubicaciones" },
        { href: "#testimonios", label: "Testimonios" },
      ];

      // Si está autenticado, agregar enlaces adicionales
      if (session) {
        links.push(
          { href: "/pedidos/realizar", label: "Realizar pedido" },
          { href: "/pedidos/historial", label: "Historial" }
        );

        if (isAdmin) {
          // Insertar "Panel" antes de "Historial"
          links.splice(links.length - 1, 0, { href: "/pedidos", label: "Panel" });
        }
      }

      return links;
    } else {
      // Otras páginas de marketing
      return [
        { href: "/", label: "Inicio" },
        { href: "/servicios", label: "Servicios" },
        { href: "/reserva", label: "Reservá tu espacio" },
      ];
    }
  }, [pathname, session, isAdmin]);

  // Determinar CTAs según autenticación y ruta
  const primaryCta = useMemo(() => {
    if (!user) {
      return { href: "/login", label: "Iniciar sesión" };
    }
    if (isAdmin) {
      return { href: "/pedidos", label: "Ir al panel" };
    }
    return { href: "/pedidos/realizar", label: "Pedir café" };
  }, [user, isAdmin]);

  const secondaryCta = useMemo(() => {
    // Página principal
    if (pathname === "/") {
      return user
        ? { href: "/pedidos/historial", label: "Historial" }
        : { href: "#contacto", label: "Contactanos" };
    }

    // Página de reserva
    if (pathname === "/reserva") {
      return { href: "#reserva-form", label: "Contactanos" };
    }

    // Página de login
    if (pathname === "/login") {
      return { href: "/reserva#reserva-form", label: "Contactanos" };
    }

    // Página de register
    if (pathname === "/register") {
      return { href: "/login", label: "Iniciar sesión" };
    }

    // Otras páginas (/servicios, etc.)
    return user
      ? { href: "/pedidos/historial", label: "Historial" }
      : { href: "#contacto", label: "Contactanos" };
  }, [pathname, user]);

  // Determinar si un enlace está activo
  const isActive = (href: string) => {
    if (href.startsWith("#")) {
      return false; // Los anchors no se marcan como activos
    }
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-neutral-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Ir al inicio">
          <Image src="/logolaofi.svg" alt="La Ofi" width={112} height={40} priority />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-700 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
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

        {/* CTAs Desktop */}
        <div className="flex items-center gap-3">
          {/* CTA Secundario - Ocultar en /register si no hay usuario */}
          {(pathname !== "/register" || user) && (
            <Link
              href={secondaryCta.href}
              className="hidden rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900 hover:text-neutral-900 md:inline"
            >
              {secondaryCta.label}
            </Link>
          )}

          {/* CTA Primario */}
          <Link
            href={primaryCta.href}
            className="inline-flex items-center gap-2 rounded-lg bg-[#fdca00] px-4 py-2 text-sm font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
          >
            {primaryCta.label}
            <FaArrowRight className="h-4 w-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-xl text-neutral-700 transition hover:border-neutral-300 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <IoMdMenu />
          </button>
        </div>
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
                const active = isActive(link.href);
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

            {/* CTAs del menú móvil */}
            <div className="mt-auto flex flex-col gap-3">
              {/* CTA Secundario */}
              {(pathname !== "/register" || user) && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
                >
                  {secondaryCta.label}
                </Link>
              )}

              {/* CTA Primario */}
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#fdca00] px-4 py-3 text-sm font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
              >
                {primaryCta.label}
                <FaArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function AuthenticatedNavigation({
  pathname,
}: {
  pathname?: string | null;
}) {
  const { data: session } = useSession();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = session?.user?.role === "admin";
  const user = session?.user;

  useEffect(() => {
    setAccountOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = useMemo(() => {
    const links: NavLink[] = [
      { href: "/pedidos/realizar", label: "Realizar pedido" },
      { href: "/pedidos/historial", label: "Historial" },
    ];
    if (isAdmin) {
      links.unshift({ href: "/pedidos", label: "Panel" });
      links.push(
        { href: "/productos", label: "Productos" },
        { href: "/clientes", label: "Usuarios" }
      );
    }
    return links;
  }, [isAdmin]);

  const displayName = (user?.name || user?.email || "Tu cuenta").trim();
  const firstName = displayName.split(" ")[0];
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk.charAt(0).toUpperCase())
      .join("") || "LC";

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center" aria-label="Ir al inicio">
            <Image src="/logolaofi.svg" alt="Logo La Ofi" width={120} height={32} priority />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-neutral-900 text-white shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)]"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Account Section */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              {/* User Info (Desktop) */}
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-semibold text-neutral-900">Hola, {firstName}</span>
                <span className="text-xs text-neutral-500">{isAdmin ? "Administración" : "Coworker"}</span>
              </div>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-3 py-2 text-left shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)] transition hover:border-neutral-300"
                  aria-haspopup="true"
                  aria-expanded={accountOpen}
                >
                  <span className="hidden text-sm font-semibold text-neutral-700 sm:inline">Cuenta</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                    {initials}
                  </span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_30px_60px_-35px_rgba(0,0,0,0.45)]">
                    <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3">
                      <p className="text-sm font-semibold text-neutral-900">{displayName}</p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href="/mis-datos"
                        className="px-4 py-3 text-sm text-neutral-700 transition hover:bg-neutral-100"
                      >
                        Mis datos
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 px-4 py-3 text-left text-sm text-neutral-700 transition hover:bg-neutral-100"
                      >
                        <FaSignOutAlt className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-xl text-neutral-700 transition hover:border-neutral-300 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú"
              >
                <IoMdMenu />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && session && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        >
          <div
            className="absolute right-0 top-0 flex h-full w-80 max-w-[80vw] flex-col gap-6 overflow-y-auto bg-white p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-neutral-900">{displayName}</p>
                <p className="text-xs text-neutral-500">{isAdmin ? "Administración" : "Coworker"}</p>
              </div>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-xl text-neutral-700"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
              >
                <IoMdClose />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      active ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-900/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/mis-datos"
                className="rounded-lg px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-900/5"
              >
                Mis datos
              </Link>
            </nav>

            <button
              onClick={() => signOut()}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              <FaSignOutAlt className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
