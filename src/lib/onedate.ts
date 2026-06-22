/**
 * Stub del cliente API One Date para facturación electrónica.
 * Punto de enganche: llamar crearDocumento() al confirmar un pedido.
 * Credenciales van en .env: ONEDATE_API_KEY
 */

interface OneDateDocumento {
  pedidoId: string;
  tipo: "boleta" | "factura";
  rutCliente?: string;
  items: Array<{
    nombre: string;
    cantidad: number;
    precioUnit: number;
    total: number;
  }>;
  total: number;
}

export async function crearDocumento(
  _doc: OneDateDocumento
): Promise<{ ok: boolean; folio?: string }> {
  const apiKey = process.env.ONEDATE_API_KEY;
  if (!apiKey) {
    console.warn("[One Date] API key no configurada. Stub activo — sin facturación real.");
    return { ok: false };
  }

  // TODO: Implementar llamada real a la API de One Date
  // const response = await fetch("https://api.onedate.cl/v1/documentos", {
  //   method: "POST",
  //   headers: {
  //     "Authorization": `Bearer ${apiKey}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(doc),
  // });

  console.log("[One Date] Documento creado (stub):", _doc.pedidoId);
  return { ok: true, folio: `STUB-${Date.now()}` };
}
