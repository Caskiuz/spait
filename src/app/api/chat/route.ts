import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  askGemini,
  buildSystemPrompt,
  fallbackReply,
  type ChatTurn,
} from "@/server/ai/assistant";
import { getSiteSettings } from "@/server/repositories/content";

/**
 * POST /api/chat — asistente virtual del sitio.
 *
 * Recibe el ultimo mensaje del visitante y el historial reciente, y devuelve
 * la respuesta del asistente. La clave de Gemini nunca viaja al navegador:
 * este Route Handler es el unico punto que habla con Google.
 */

export const maxDuration = 40;

const chatSchema = z.object({
  message: z
    .string({ error: "El mensaje es obligatorio" })
    .trim()
    .min(1, "El mensaje es obligatorio")
    .max(2000, "El mensaje es demasiado largo"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        text: z.string().trim().min(1).max(2000),
      }),
    )
    .max(10, "El historial es demasiado largo")
    .optional()
    .default([]),
});

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limite = await rateLimit(`chat:${ip}`, 15, 5 * 60 * 1000);
  if (!limite.success) {
    return NextResponse.json(
      { error: "Demasiadas consultas. Espera unos minutos, por favor." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 },
    );
  }

  const { message, history } = parsed.data;

  // El historial se recorta a los 10 turnos recientes mas el mensaje nuevo.
  const turnos: ChatTurn[] = [
    ...history.map((h) => ({ role: h.role, text: h.text })),
    { role: "user", text: message },
  ];

  const [settings, systemPrompt] = await Promise.all([
    getSiteSettings(),
    buildSystemPrompt(),
  ]);

  const respuesta = await askGemini(turnos, systemPrompt);

  return NextResponse.json({
    reply: respuesta ?? fallbackReply(settings.phoneDisplay),
  });
}
