import { NextResponse } from "next/server";
import { checkDatabase } from "@/lib/db";
import { infrastructureStatus } from "@/lib/env";

/**
 * GET /api/health — comprobación de estado para Vercel y monitoreo.
 * Devuelve qué piezas de infraestructura están activas sin exponer secretos.
 */
export async function GET() {
  const status = infrastructureStatus();
  const database = status.database ? await checkDatabase() : false;

  return NextResponse.json(
    {
      ok: true,
      service: "soundtech-web",
      timestamp: new Date().toISOString(),
      infrastructure: { ...status, databaseReachable: database },
      mode: status.database ? "cms" : "demo",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
