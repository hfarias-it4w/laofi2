"use client";

import { Geist, Geist_Mono } from "next/font/google";
import AdminNotificationListener from "@/app/components/AdminNotificationListener";
import NavigationBar from "@/app/components/NavigationBar";
import MarketingFooter from "@/app/components/MarketingFooter";
import "./globals.css";
import AuthProvider from "./AuthProvider";
import { usePathname } from "next/navigation";

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

// Componente wrapper interno que está dentro del AuthProvider
function LayoutContent({ children, pathname }: { children: React.ReactNode; pathname: string | null }) {
  const marketingRoutes = ["/", "/servicios", "/reserva", "/login", "/register"];
  const isMarketing = marketingRoutes.includes(pathname ?? "");

  return (
    <>
      <NavigationBar 
        variant={isMarketing ? "marketing" : "authenticated"} 
        pathname={pathname}
      />
      <AdminNotificationListener />
      <main className="flex flex-col flex-grow w-full">{children}</main>
      <MarketingFooter />
    </>
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
          <LayoutContent pathname={pathname}>
            {children}
          </LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
