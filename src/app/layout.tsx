import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smile Fruits — Verdulería Fresca y Local",
  description:
    "Frutas, verduras, hierbas y más. Pedidos por WhatsApp con despacho a domicilio. Catálogo minorista y mayorista.",
  keywords: ["verdulería", "frutas", "verduras", "despacho", "Santiago", "Chile"],
  openGraph: {
    title: "Smile Fruits — Verdulería Fresca y Local",
    description: "Frutas, verduras, hierbas y más. Despacho a domicilio en Santiago.",
    images: [{ url: "/logo-smile.jpeg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
