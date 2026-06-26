import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function adminAuth(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

const TIPOS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const form = await req.formData();
    const file = form.get("file");
    const nombre = (form.get("nombre") as string) || "producto";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
    }
    const f = file as File;

    const ext = TIPOS[f.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa PNG, JPG o WEBP." },
        { status: 400 }
      );
    }
    if (f.size > MAX_BYTES) {
      return NextResponse.json({ error: "La imagen supera el máximo de 5MB." }, { status: 400 });
    }

    const path = `${slugify(nombre) || "producto"}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await f.arrayBuffer());

    const supabase = createServerClient();
    const { error } = await supabase.storage
      .from("productos")
      .upload(path, buffer, { contentType: f.type, upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from("productos").getPublicUrl(path);
    return NextResponse.json({ ok: true, url: data.publicUrl });
  } catch (err) {
    console.error("[API Upload] Error:", err);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
