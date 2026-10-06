import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { env } from "./env";

/**
 * Cliente Prisma con el driver adapter de Neon.
 *
 * Se crea de forma perezosa (lazy) para que la aplicacion pueda arrancar y
 * servir el sitio publico aunque DATABASE_URL no este configurada — en ese
 * caso `getPrisma()` devuelve null y los repositorios caen al contenido base.
 *
 * En desarrollo se reutiliza la instancia entre recargas de HMR para no agotar
 * las conexiones.
 */

const globalForPrisma = globalThis as unknown as {
  __soundtechPrisma?: PrismaClient | null;
};

function createClient(): PrismaClient | null {
  if (!env.hasDatabase) return null;

  const adapter = new PrismaNeon({ connectionString: env.databaseUrl! });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

export function getPrisma(): PrismaClient | null {
  if (globalForPrisma.__soundtechPrisma === undefined) {
    globalForPrisma.__soundtechPrisma = createClient();
  }
  return globalForPrisma.__soundtechPrisma;
}

/**
 * Igual que getPrisma pero lanza si no hay base de datos.
 * Usar en el panel de administracion, donde la BD es obligatoria.
 */
export function requirePrisma(): PrismaClient {
  const client = getPrisma();
  if (!client) {
    throw new Error(
      "DATABASE_URL no está configurada. El panel de administración requiere una base de datos PostgreSQL (Neon).",
    );
  }
  return client;
}

/** Comprueba que la base de datos responde. Se usa en /api/health. */
export async function checkDatabase(): Promise<boolean> {
  const client = getPrisma();
  if (!client) return false;
  try {
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
