import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/db";
import { env } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/captcha";
import { fieldErrors } from "@/lib/validations";
import {
  autoReplyHtml,
  contactNotificationHtml,
  enrollmentNotificationHtml,
  quoteNotificationHtml,
  sendMail,
} from "@/lib/mail";
import { getServices } from "@/server/repositories/content";
import { formatDateTime } from "@/lib/utils";

/**
 * Manejador comun de los formularios publicos.
 *
 * Orden de comprobaciones (de lo mas barato a lo mas caro):
 *   validacion -> campo trampa -> limite de peticiones -> captcha -> guardado
 *   -> correo.
 *
 * Ninguna respuesta revela si el envio se guardo en base de datos: el usuario
 * siempre recibe el mismo mensaje de exito para no filtrar informacion.
 */

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

type LeadKind = "contacto" | "matricula" | "cotizacion";

export interface LeadHandlerConfig<TSchema extends z.ZodType> {
  kind: LeadKind;
  schema: TSchema;
  /** Limite de peticiones por IP en la ventana indicada. */
  limit?: number;
}

interface NormalizedLead {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  serviceSlug?: string;
  courseSlug?: string;
  message?: string;
  description?: string;
  projectType?: string;
  budget?: string;
}

const BUDGET_LABELS: Record<string, string> = {
  "menos-5k": "Menos de S/ 5,000",
  "5k-15k": "S/ 5,000 – 15,000",
  "15k-50k": "S/ 15,000 – 50,000",
  "mas-50k": "Más de S/ 50,000",
  "por-definir": "Aún por definir",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  "proyecto-nuevo": "Proyecto nuevo",
  ampliacion: "Ampliación de sistema existente",
  mantenimiento: "Mantenimiento o soporte",
  asesoria: "Asesoría técnica",
  otro: "Otro",
};

/** Resuelve el nombre legible del servicio a partir del slug. */
async function resolveServiceName(slug?: string): Promise<string | undefined> {
  if (!slug) return undefined;
  const services = await getServices();
  return services.find((s) => s.slug === slug)?.title;
}

async function resolveCourseName(slug?: string): Promise<string | undefined> {
  if (!slug) return undefined;
  const prisma = getPrisma();
  if (!prisma) {
    return slug === "ingenieria-de-sonido" ? "Ingeniería de Sonido" : slug;
  }
  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      select: { title: true },
    });
    return course?.title ?? slug;
  } catch {
    return slug;
  }
}

export function createLeadHandler<TSchema extends z.ZodType>({
  kind,
  schema,
  limit = RATE_LIMIT,
}: LeadHandlerConfig<TSchema>) {
  return async function POST(request: Request): Promise<NextResponse> {
    // 1. Cuerpo y validacion -------------------------------------------------
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "El cuerpo de la petición no es JSON válido." },
        { status: 400 },
      );
    }

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Revisa los campos marcados en rojo.",
          errors: fieldErrors(parsed.error),
        },
        { status: 422 },
      );
    }

    const data = parsed.data as NormalizedLead & {
      website?: string;
      turnstileToken?: string;
    };

    // 2. Campo trampa --------------------------------------------------------
    // Respondemos 200 para no dar senal al bot de que fue detectado.
    if (data.website) {
      return NextResponse.json({ ok: true, message: "¡Gracias! Te contactaremos pronto." });
    }

    const headers = request.headers;
    const ip = clientIp(headers);
    const userAgent = headers.get("user-agent") ?? undefined;

    // 3. Limite de peticiones ------------------------------------------------
    const rl = await rateLimit(`lead:${kind}:${ip}`, limit, RATE_WINDOW_MS);
    if (!rl.success) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Hemos recibido varios envíos desde tu conexión. Espera unos minutos antes de volver a intentarlo.",
        },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
      );
    }

    // 4. Captcha -------------------------------------------------------------
    const captcha = await verifyTurnstile(data.turnstileToken, ip);
    if (captcha === "failed") {
      return NextResponse.json(
        {
          ok: false,
          message: "No pudimos verificar que seas una persona. Recarga la página e inténtalo otra vez.",
        },
        { status: 400 },
      );
    }

    // 5. Guardado ------------------------------------------------------------
    const receivedAt = formatDateTime(new Date());
    let stored = false;

    try {
      stored = await persist(kind, data, { ip, userAgent });
    } catch (error) {
      // Que falle la base de datos no debe impedir avisar por correo.
      console.error(`[leads] fallo al guardar ${kind}:`, error);
    }

    // 6. Correos -------------------------------------------------------------
    const [serviceName, courseName] = await Promise.all([
      resolveServiceName(data.serviceSlug),
      resolveCourseName(data.courseSlug),
    ]);

    const common = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company,
    };

    const notificationHtml =
      kind === "contacto"
        ? contactNotificationHtml({
            ...common,
            service: serviceName,
            message: data.message ?? "",
            receivedAt,
          })
        : kind === "matricula"
          ? enrollmentNotificationHtml({
              ...common,
              course: courseName,
              message: data.message,
              receivedAt,
            })
          : quoteNotificationHtml({
              ...common,
              service: serviceName,
              projectType: data.projectType
                ? PROJECT_TYPE_LABELS[data.projectType] ?? data.projectType
                : undefined,
              budget: data.budget ? BUDGET_LABELS[data.budget] ?? data.budget : undefined,
              description: data.description ?? "",
              receivedAt,
            });

    const subjects: Record<LeadKind, string> = {
      contacto: `Nueva consulta web — ${data.fullName}`,
      matricula: `Nueva matrícula — ${data.fullName}`,
      cotizacion: `Nueva solicitud de cotización — ${data.fullName}`,
    };

    const kinds: Record<LeadKind, string> = {
      contacto: "consulta",
      matricula: "solicitud de matrícula",
      cotizacion: "solicitud de cotización",
    };

    const [notification] = await Promise.all([
      sendMail({
        to: env.adminNotifyEmail,
        subject: subjects[kind],
        html: notificationHtml,
        replyTo: data.email,
      }),
      sendMail({
        to: data.email,
        subject: "Recibimos tu mensaje — Sound Tech Perú",
        html: autoReplyHtml({ fullName: data.fullName, kind: kinds[kind] }),
      }).catch((error) => {
        console.error("[leads] fallo el acuse de recibo:", error);
        return null;
      }),
    ]);

    if (notification.status === "sent" && stored) {
      await markNotified(kind).catch(() => undefined);
    }

    if (!stored) {
      // Deja rastro en los registros de Vercel para no perder el contacto.
      console.warn(
        `[leads] ${kind} NO persistido (sin base de datos). Datos: ${JSON.stringify({
          ...common,
          serviceName,
          courseName,
          message: data.message,
          description: data.description,
          receivedAt,
        })}`,
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "¡Gracias por escribirnos! Nuestro equipo se pondrá en contacto contigo muy pronto.",
    });
  };
}

/* ==========================================================================
   Persistencia
   ========================================================================== */

async function persist(
  kind: LeadKind,
  data: NormalizedLead,
  meta: { ip: string; userAgent?: string },
): Promise<boolean> {
  const prisma = getPrisma();
  if (!prisma) return false;

  const base = {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    company: data.company,
    ip: meta.ip,
    userAgent: meta.userAgent,
  };

  if (kind === "contacto") {
    await prisma.contactMessage.create({
      data: {
        ...base,
        message: data.message ?? "",
        serviceText: data.serviceSlug,
        source: "FORMULARIO_CONTACTO",
      },
    });
    return true;
  }

  if (kind === "matricula") {
    let courseId: string | null = null;
    if (data.courseSlug) {
      const course = await prisma.course
        .findUnique({ where: { slug: data.courseSlug }, select: { id: true } })
        .catch(() => null);
      courseId = course?.id ?? null;
    }

    await prisma.enrollment.create({
      data: {
        ...base,
        message: data.message,
        courseId,
        courseText: data.courseSlug,
        source: "FORMULARIO_MATRICULA",
      },
    });
    return true;
  }

  await prisma.quoteRequest.create({
    data: {
      ...base,
      description: data.description ?? "",
      projectType: data.projectType,
      budget: data.budget,
      serviceText: data.serviceSlug,
      source: "FORMULARIO_COTIZACION",
    },
  });
  return true;
}

/** Marca el ultimo prospecto de ese tipo como avisado por correo. */
async function markNotified(kind: LeadKind): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) return;

  const model =
    kind === "contacto"
      ? prisma.contactMessage
      : kind === "matricula"
        ? prisma.enrollment
        : prisma.quoteRequest;

  const last = await (model as never as {
    findFirst: (args: unknown) => Promise<{ id: string } | null>;
  }).findFirst({ orderBy: { createdAt: "desc" }, select: { id: true } });

  if (!last) return;

  await (model as never as {
    update: (args: unknown) => Promise<unknown>;
  }).update({ where: { id: last.id }, data: { notified: true } });
}
