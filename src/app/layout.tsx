import type { Metadata } from "next";
import "@/app/globals.css";
import Link from "next/link";
import { GuestSessionProvider } from "@/providers/GuestSessionContext";

export const metadata: Metadata = {
  title: "Movies App",
  description: "Movies app description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950 text-gray-100 min-h-screen">
        <GuestSessionProvider>
          {/* Header global */}
          <header className="sticky top-0 z-30 w-full bg-gray-950/80 backdrop-blur shadow-lg border-b border-gray-800">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-extrabold text-blue-400 tracking-tight drop-shadow">
                  🎬 My Movies App
                </span>
              </div>
              <nav className="flex gap-4">
                <Link
                  href="/"
                  className="hover:text-blue-400 transition-colors font-semibold"
                >
                  Inicio
                </Link>
                <Link
                  href="/popular"
                  className="hover:text-blue-400 transition-colors font-semibold"
                >
                  Populares
                </Link>
                <Link
                  href="/now-playing"
                  className="hover:text-blue-400 transition-colors font-semibold"
                >
                  En cines
                </Link>
                <Link
                  href="/top-rated"
                  className="hover:text-blue-400 transition-colors font-semibold"
                >
                  Mejor valoradas
                </Link>
                <Link
                  href="/my-favorites"
                  className="hover:text-blue-400 transition-colors font-semibold"
                >
                  Favoritos
                </Link>
              </nav>
            </div>
          </header>
          <main className="p-6 mt-16 min-h-[80vh]">{children}</main>
        </GuestSessionProvider>
      </body>
    </html>
  );
}
