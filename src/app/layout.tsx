import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactBar } from "@/components/layout/ContactBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ChatWidget } from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "Smile — Verdulería Fresca y Local",
  description:
    "Frutas, verduras, hierbas y más. Pedidos por WhatsApp con despacho a domicilio. Catálogo minorista y mayorista.",
  keywords: ["verdulería", "frutas", "verduras", "despacho", "Santiago", "Chile"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className="h-full">
      <body className="min-h-full flex flex-col">
        <ContactBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <ChatWidget />
      </body>
    </html>
  );
}
