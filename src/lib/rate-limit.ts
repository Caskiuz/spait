import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "./env";

/**
 * Limitador de peticiones para los formularios publicos.
 *
 * Con Upstash configurado el limite es distribuido entre todas las instancias
 * serverless. Sin Upstash cae a un contador en memoria: suficiente para
 * desarrollo local y para frenar rafagas simples, pero no es un limite real
 * entre instancias — en produccion conviene configurar Upstash.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const memoryBuckets = new Map<string, Bucket>();

/** Limpia entradas caducadas para que el mapa no crezca sin control. */
function sweep(now: number) {
  if (memoryBuckets.size < 500) return;
  for (const [key, bucket] of memoryBuckets) {
    if (bucket.resetAt < now) memoryBuckets.delete(key);
  }
}

function memoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  sweep(now);

  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  bucket.count += 1;
  const success = bucket.count <= limit;
  return {
    success,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

let distributed: Ratelimit | null = null;
let distributedWindow: string | null = null;

function getDistributed(limit: number, windowMs: number): Ratelimit | null {
  if (!env.hasRedis) return null;
  const window = `${windowMs} ms`;
  if (!distributed || distributedWindow !== window) {
    distributed = new Ratelimit({
      redis: new Redis({
        url: env.upstashUrl!,
        token: env.upstashToken!,
      }),
      limiter: Ratelimit.slidingWindow(limit, window as `${number} ms`),
      prefix: "soundtech:ratelimit",
      analytics: false,
    });
    distributedWindow = window;
  }
  return distributed;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  /** Indica si el limite se aplico de forma distribuida o local. */
  mode: "distribuido" | "local";
}

/**
 * Consume una unidad del limite para la clave dada.
 * @param key identificador, normalmente `formulario:ip`
 */
export async function rateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
): Promise<RateLimitResult> {
  const limiter = getDistributed(limit, windowMs);

  if (limiter) {
    try {
      const result = await limiter.limit(key);
      return {
        success: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
        mode: "distribuido",
      };
    } catch (error) {
      console.error("[rate-limit] fallo Upstash, se usa limite local:", error);
    }
  }

  const local = memoryLimit(key, limit, windowMs);
  return { ...local, mode: "local" };
}

/** Extrae la IP del cliente a partir de las cabeceras que envia Vercel. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "desconocida"
  );
}
