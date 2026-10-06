/**
 * Lectura centralizada de variables de entorno.
 *
 * El sitio esta disenado para funcionar en tres escenarios:
 *
 *  1. Demo sin infraestructura  -> sin variables. Las paginas publicas se
 *     sirven desde el contenido base (src/content) y los formularios validan
 *     pero solo registran en el log del servidor.
 *  2. Demo con correo           -> + RESEND_API_KEY. Los formularios avisan
 *     al equipo por correo.
 *  3. Produccion completa       -> + DATABASE_URL. Se activan el panel de
 *     administracion, la bandeja de prospectos y la revalidacion por etiquetas.
 *
 * Ninguna ruta debe romper si falta una variable: se degrada la funcionalidad.
 */

const raw = {
  databaseUrl: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,

  authSecret: process.env.AUTH_SECRET,
  authUrl: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL,

  resendApiKey: process.env.RESEND_API_KEY,
  mailFrom: process.env.MAIL_FROM,
  adminNotifyEmail: process.env.ADMIN_NOTIFY_EMAIL,

  blobToken: process.env.BLOB_READ_WRITE_TOKEN,

  turnstileSecret: process.env.TURNSTILE_SECRET_KEY,
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,

  upstashUrl: process.env.UPSTASH_REDIS_REST_URL,
  upstashToken: process.env.UPSTASH_REDIS_REST_TOKEN,

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
} as const;

export const env = {
  ...raw,

  /** Hay base de datos configurada: se activan CMS y bandeja de prospectos. */
  get hasDatabase(): boolean {
    return Boolean(raw.databaseUrl);
  },

  /** Hay servicio de correo configurado. */
  get hasMail(): boolean {
    return Boolean(raw.resendApiKey && raw.mailFrom);
  },

  /** Hay almacenamiento de archivos configurado (subida de imagenes). */
  get hasBlob(): boolean {
    return Boolean(raw.blobToken);
  },

  /** Hay proteccion antispam de Cloudflare configurada. */
  get hasTurnstile(): boolean {
    return Boolean(raw.turnstileSecret && raw.turnstileSiteKey);
  },

  /** Hay limitador de peticiones distribuido configurado. */
  get hasRedis(): boolean {
    return Boolean(raw.upstashUrl && raw.upstashToken);
  },

  get siteUrl(): string {
    return raw.siteUrl ?? "http://localhost:3000";
  },

  get mailFrom(): string {
    return raw.mailFrom ?? "Sound Tech Perú <onboarding@resend.dev>";
  },

  get adminNotifyEmail(): string {
    return raw.adminNotifyEmail ?? "soundtechperu@gmail.com";
  },
};

/** Resumen del estado de la infraestructura, util para /api/health y /admin. */
export function infrastructureStatus() {
  return {
    database: env.hasDatabase,
    mail: env.hasMail,
    storage: env.hasBlob,
    captcha: env.hasTurnstile,
    rateLimit: env.hasRedis,
  } as const;
}
