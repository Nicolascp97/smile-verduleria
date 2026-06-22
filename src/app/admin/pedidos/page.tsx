"use client";

import dynamic from "next/dynamic";

const AdminPanel = dynamic(() => import("@/components/admin/AdminPanel"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p className="text-green-700 font-medium">Cargando panel...</p>
    </div>
  ),
});

export default function AdminPedidosPage() {
  return <AdminPanel />;
}
