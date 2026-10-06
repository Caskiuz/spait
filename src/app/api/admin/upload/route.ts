import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { env } from "@/lib/env";

/**
 * POST /api/admin/upload
 *
 * Emite el token que permite al navegador subir la imagen directamente a
 * Vercel Blob. Se hace asi porque las funciones de Vercel limitan el tamaño
 * del cuerpo de la peticion: subir desde el cliente evita ese limite.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Solo usuarios con sesion pueden subir archivos.
        const session = await getSession();
        if (!session?.user) {
          throw new Error("No autorizado.");
        }

        if (!env.hasBlob) {
          throw new Error(
            "BLOB_READ_WRITE_TOKEN no está configurado en este despliegue.",
          );
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
            "image/svg+xml",
          ],
          maximumSizeInBytes: 12 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // La fila de MediaAsset se crea desde la acción del panel, que sí
        // conoce el texto alternativo y la carpeta destino.
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
