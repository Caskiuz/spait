import { Resend } from "resend";
import { env } from "./env";
import { siteSettings } from "@/content/site";

/**
 * Envio de correo transaccional con Resend.
 *
 * Si no hay RESEND_API_KEY configurada el envio se degrada: se registra en el
 * log y se devuelve `skipped`. Los formularios siguen respondiendo bien para
 * que la demo funcione sin infraestructura; el prospecto siempre queda
 * guardado si hay base de datos.
 */

let client: Resend | null = null;

function getClient(): Resend | null {
  if (!env.hasMail) return null;
  client ??= new Resend(env.resendApiKey!);
  return client;
}

export type MailResult =
  | { status: "sent"; id: string }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

interface SendOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendMail(options: SendOptions): Promise<MailResult> {
  const resend = getClient();
  if (!resend) {
    console.info(
      `[correo omitido] sin RESEND_API_KEY — "${options.subject}" para ${options.to}`,
    );
    return { status: "skipped", reason: "RESEND_API_KEY no configurada" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: env.mailFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });

    if (error) {
      console.error("[correo] error de Resend:", error);
      return { status: "failed", reason: error.message };
    }
    return { status: "sent", id: data?.id ?? "" };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "error desconocido";
    console.error("[correo] excepcion:", reason);
    return { status: "failed", reason };
  }
}

/* ==========================================================================
   Plantillas
   ========================================================================== */

const shell = (title: string, intro: string, rows: [string, string][], footer: string) => `
<!doctype html>
<html lang="es">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;padding:24px;background:#0a0a0b;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#f5f5f6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#141417;border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,.08);">
          <p style="margin:0;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#a1a1aa;">${siteSettings.companyName}</p>
          <h1 style="margin:10px 0 0;font-size:24px;line-height:1.15;color:#ffffff;">${title}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#c9c9cf;">${intro}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            ${rows
              .map(
                ([label, value]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#7c7c85;width:38%;vertical-align:top;">${label}</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#f5f5f6;white-space:pre-wrap;">${value}</td>
            </tr>`,
              )
              .join("")}
          </table>
          <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#7c7c85;">${footer}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,.08);font-size:12px;color:#7c7c85;">
          ${siteSettings.phoneDisplay} · ${siteSettings.email}
        </td>
      </tr>
    </table>
  </body>
</html>`;

/** Escapa texto que viene del usuario antes de inyectarlo en el HTML. */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function contactNotificationHtml(data: {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  service?: string;
  message: string;
  receivedAt: string;
}) {
  return shell(
    "Nueva consulta desde la web",
    "Se registró una nueva consulta en el formulario de contacto.",
    [
      ["Nombre", esc(data.fullName)],
      ["Correo", esc(data.email)],
      ["Teléfono", esc(data.phone)],
      ["Empresa", data.company ? esc(data.company) : "—"],
      ["Servicio de interés", data.service ? esc(data.service) : "—"],
      ["Mensaje", esc(data.message)],
      ["Recibido", esc(data.receivedAt)],
    ],
    "Responde directamente a este correo para contactar al prospecto.",
  );
}

export function enrollmentNotificationHtml(data: {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  course?: string;
  message?: string;
  receivedAt: string;
}) {
  return shell(
    "Nueva matrícula registrada",
    "Alguien solicitó información para matricularse en el programa.",
    [
      ["Nombre", esc(data.fullName)],
      ["Correo", esc(data.email)],
      ["Teléfono", esc(data.phone)],
      ["Empresa", data.company ? esc(data.company) : "—"],
      ["Curso", data.course ? esc(data.course) : "—"],
      ["Mensaje", data.message ? esc(data.message) : "—"],
      ["Recibido", esc(data.receivedAt)],
    ],
    "Responde directamente a este correo para coordinar la matrícula.",
  );
}

export function quoteNotificationHtml(data: {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  service?: string;
  projectType?: string;
  budget?: string;
  description: string;
  receivedAt: string;
}) {
  return shell(
    "Nueva solicitud de cotización",
    "Se recibió una solicitud de cotización desde la web.",
    [
      ["Nombre", esc(data.fullName)],
      ["Correo", esc(data.email)],
      ["Teléfono", esc(data.phone)],
      ["Empresa", data.company ? esc(data.company) : "—"],
      ["Servicio", data.service ? esc(data.service) : "—"],
      ["Tipo de proyecto", data.projectType ? esc(data.projectType) : "—"],
      ["Presupuesto", data.budget ? esc(data.budget) : "—"],
      ["Descripción", esc(data.description)],
      ["Recibido", esc(data.receivedAt)],
    ],
    "Responde directamente a este correo para enviar la propuesta.",
  );
}

export function autoReplyHtml(data: { fullName: string; kind: string }) {
  const message = esc(data.fullName).split(" ")[0] || "gracias";
  return shell(
    `Gracias por escribirnos, ${message}`,
    `Hemos recibido tu ${data.kind}. Nuestro equipo se pondrá en contacto contigo para brindarte mayor información.`,
    [
      ["Tiempo de respuesta", "Menos de 24 horas hábiles"],
      ["Teléfono", siteSettings.phoneDisplay],
      ["Correo", siteSettings.email],
    ],
    "Si tu consulta es urgente puedes escribirnos directamente por WhatsApp.",
  );
}
