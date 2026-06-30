import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitCoach — Tu entrenador personal inteligente",
  description:
    "Plataforma de fitness con rutinas, nutrición, control de peso y coach basado en ciencia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
