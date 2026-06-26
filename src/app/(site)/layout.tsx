import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactBar } from "@/components/layout/ContactBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ChatWidget } from "@/components/chat/ChatWidget";

// Layout de la tienda pública: incluye la barra de contacto, header, footer,
// carrito y chat. El panel /admin queda fuera de este grupo, con el layout
// raíz mínimo, para verse como una herramienta de gestión sin el chrome de la tienda.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <ContactBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  );
}
