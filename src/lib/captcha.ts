import { env } from "./env";

/**
 * Verificacion de Cloudflare Turnstile.
 *
 * Si no hay claves configuradas la verificacion se omite y se devuelve
 * `skipped`, de modo que los formularios siguen operativos en desarrollo.
 * El freno principal contra el spam son el campo trampa y el limite de
 * peticiones; Turnstile es la capa adicional recomendada en produccion.
 */

export type CaptchaResult = "ok" | "failed" | "skipped";

export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<CaptchaResult> {
  if (!env.hasTurnstile) return "skipped";

  if (!token) return "failed";

  try {
    const body = new URLSearchParams({
      secret: env.turnstileSecret!,
      response: token,
    });
    if (ip && ip !== "desconocida") body.set("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
      },
    );

    if (!res.ok) return "failed";
    const data = (await res.json()) as { success?: boolean };
    return data.success ? "ok" : "failed";
  } catch (error) {
    console.error("[turnstile] error de verificación:", error);
    // Ante un fallo de red no bloqueamos al usuario legitimo.
    return "skipped";
  }
}
