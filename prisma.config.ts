import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

/**
 * Configuracion del Prisma CLI (Prisma 7+).
 *
 * En Prisma 7 la cadena de conexion ya no vive en schema.prisma: se declara
 * aqui y el cliente recibe un driver adapter (ver src/lib/db.ts).
 *
 * DATABASE_URL apunta al endpoint *pooled* de Neon; DIRECT_URL (sin pooling)
 * se usa para migraciones y para `db push` cuando esta definida.
 *
 * La url es opcional a proposito: `prisma generate` debe funcionar en Vercel
 * aunque la base de datos todavia no este conectada.
 */

// Next.js lee .env.local, pero el CLI de Prisma solo lee .env por defecto.
// Cargamos ambos para que no haya que duplicar los valores.
loadEnv({ path: [".env.local", ".env"], quiet: true });

const connectionUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  ...(connectionUrl ? { datasource: { url: connectionUrl } } : {}),
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
