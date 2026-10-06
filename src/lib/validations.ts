import { z } from "zod";

/**
 * Esquemas de validacion compartidos entre el formulario del navegador y el
 * Route Handler que los recibe. Una sola definicion, dos usos: evita que el
 * cliente y el servidor se desincronicen.
 */

/* ---------------------------------------------------------------- primitivos */

const requiredText = (label: string, min = 2, max = 120) =>
  z
    .string({ error: `${label} es obligatorio` })
    .trim()
    .min(min, `${label} debe tener al menos ${min} caracteres`)
    .max(max, `${label} no puede superar ${max} caracteres`);

/** Telefono peruano: 9 digitos empezando en 9, con o sin prefijo +51. */
const peruvianPhone = z
  .string({ error: "El número de teléfono es obligatorio" })
  .trim()
  .transform((value) => value.replace(/[\s\-().]/g, ""))
  .refine((value) => /^(\+?51)?9\d{8}$/.test(value), {
    message: "Ingresa un celular válido de 9 dígitos (ej. 961 927 974)",
  });

const optionalCompany = z
  .string()
  .trim()
  .max(140, "El nombre de la empresa es demasiado largo")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

const emailField = z
  .string({ error: "El correo electrónico es obligatorio" })
  .trim()
  .toLowerCase()
  .min(1, "El correo electrónico es obligatorio")
  .max(180, "El correo electrónico es demasiado largo")
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), {
    message: "Ingresa un correo electrónico válido",
  });

/**
 * Campo trampa: invisible para las personas, los bots lo rellenan.
 *
 * A proposito NO se valida aqui: si lo rechazaramos, el bot aprenderia que
 * ese campo lo delata. Se acepta cualquier valor y es el manejador del
 * endpoint quien descarta el envio devolviendo un exito aparente.
 */
const honeypot = z.string().max(500).optional();

/** Token de Cloudflare Turnstile. Obligatorio solo si el captcha esta activo. */
const turnstileToken = z.string().optional();

/** Consentimiento de tratamiento de datos (Ley N.º 29733). */
const consent = z.literal(true, {
  error: "Debes aceptar el tratamiento de tus datos para continuar",
});

/* ------------------------------------------------------------ contacto */

export const contactSchema = z.object({
  fullName: requiredText("El nombre", 3, 120),
  email: emailField,
  phone: peruvianPhone,
  company: optionalCompany,
  serviceSlug: z.string().trim().max(120).optional().or(z.literal("")),
  message: requiredText("El mensaje", 10, 2000),
  consent,
  website: honeypot,
  turnstileToken,
  source: z.string().max(40).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactValues = z.output<typeof contactSchema>;

/* ------------------------------------------------------------ matricula */

export const enrollmentSchema = z.object({
  fullName: requiredText("El nombre", 3, 120),
  email: emailField,
  phone: peruvianPhone,
  company: optionalCompany,
  courseSlug: z.string().trim().max(120).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, "El mensaje no puede superar 2000 caracteres")
    .optional()
    .or(z.literal("")),
  consent,
  website: honeypot,
  turnstileToken,
});

export type EnrollmentInput = z.input<typeof enrollmentSchema>;
export type EnrollmentValues = z.output<typeof enrollmentSchema>;

/* ------------------------------------------------------------ cotizacion */

export const quoteSchema = z.object({
  fullName: requiredText("El nombre", 3, 120),
  email: emailField,
  phone: peruvianPhone,
  company: optionalCompany,
  serviceSlug: z.string().trim().max(120).optional().or(z.literal("")),
  projectType: z
    .enum([
      "proyecto-nuevo",
      "ampliacion",
      "mantenimiento",
      "asesoria",
      "otro",
    ])
    .optional(),
  budget: z
    .enum(["menos-5k", "5k-15k", "15k-50k", "mas-50k", "por-definir"])
    .optional(),
  description: requiredText("La descripción del proyecto", 20, 3000),
  consent,
  website: honeypot,
  turnstileToken,
});

export type QuoteInput = z.input<typeof quoteSchema>;
export type QuoteValues = z.output<typeof quoteSchema>;

/* ------------------------------------------------------------ newsletter */

export const newsletterSchema = z.object({
  email: emailField,
  website: honeypot,
});

/* ------------------------------------------------------------ panel admin */

export const loginSchema = z.object({
  email: emailField,
  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(200),
});

export const leadStatusSchema = z.enum([
  "NUEVO",
  "EN_PROCESO",
  "ATENDIDO",
  "DESCARTADO",
]);

export const leadNoteSchema = z.object({
  body: z
    .string()
    .trim()
    .min(2, "La nota no puede estar vacía")
    .max(2000, "La nota es demasiado larga"),
});

export const serviceFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "El slug es obligatorio")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Usa solo minúsculas, números y guiones"),
  title: requiredText("El título", 3, 160),
  titleLead: requiredText("El título (parte blanca)", 2, 160),
  titleAccent: requiredText("El título (parte naranja)", 2, 160),
  summary: requiredText("El resumen", 10, 600),
  areaLabel: requiredText("La etiqueta de área", 2, 60),
  areaDescription: requiredText("La descripción de área", 3, 160),
  solutionsTitle: requiredText("El título de soluciones", 3, 200),
  ctaTitle: requiredText("El título del CTA", 3, 200),
  ctaSubtitle: requiredText("El subtítulo del CTA", 3, 400),
  ctaButtonLabel: requiredText("El texto del botón", 2, 60),
  order: z.coerce.number().int().min(0).max(999),
  isPublished: z.coerce.boolean(),
  isFeatured: z.coerce.boolean(),
  keywords: z.string().trim().max(500).optional().or(z.literal("")),
  seoTitle: z.string().trim().max(180).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(400).optional().or(z.literal("")),
});

export const clientFormSchema = z.object({
  name: requiredText("El nombre", 2, 160),
  shortName: requiredText("El nombre corto", 2, 120),
  category: requiredText("La categoría", 2, 60),
  websiteUrl: z
    .string()
    .trim()
    .url("Ingresa una URL válida (https://…)")
    .optional()
    .or(z.literal("")),
  order: z.coerce.number().int().min(0).max(999),
  isVisible: z.coerce.boolean(),
});

export const faqFormSchema = z.object({
  question: requiredText("La pregunta", 5, 240),
  answer: requiredText("La respuesta", 5, 1200),
  category: z.string().trim().max(60).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).max(999),
  isVisible: z.coerce.boolean(),
});

export const socialLinkFormSchema = z.object({
  platform: z.enum([
    "facebook",
    "instagram",
    "whatsapp",
    "discord",
    "x",
    "pinterest",
    "youtube",
    "tiktok",
  ]),
  label: requiredText("La etiqueta", 2, 60),
  url: z.string().trim().url("Ingresa una URL válida (https://…)"),
  isFeatured: z.coerce.boolean(),
  showInFooter: z.coerce.boolean(),
  isVisible: z.coerce.boolean(),
  order: z.coerce.number().int().min(0).max(999),
  note: z.string().trim().max(300).optional().or(z.literal("")),
});

export const projectFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Usa solo minúsculas, números y guiones"),
  title: requiredText("El título", 3, 180),
  summary: requiredText("El resumen", 10, 600),
  year: z.coerce.number().int().min(1990).max(2100).optional(),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).max(999),
  isFeatured: z.coerce.boolean(),
  isPublished: z.coerce.boolean(),
});

export const siteSettingsSchema = z.object({
  companyName: requiredText("El nombre de la empresa", 2, 120),
  tagline: z.string().trim().max(180).optional().or(z.literal("")),
  phoneDisplay: requiredText("El teléfono visible", 6, 40),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\d{9,15}$/, "Solo dígitos, con código de país (ej. 51961927974)"),
  email: emailField,
  address: z.string().trim().max(180).optional().or(z.literal("")),
  hours: z.string().trim().max(120).optional().or(z.literal("")),
  seoTitleTemplate: z.string().trim().max(180).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(400).optional().or(z.literal("")),
});

export const userFormSchema = z.object({
  name: requiredText("El nombre", 2, 120),
  email: emailField,
  password: z
    .string()
    .min(10, "La contraseña debe tener al menos 10 caracteres")
    .max(200)
    .optional()
    .or(z.literal("")),
  role: z.enum(["ADMIN", "EDITOR"]),
  isActive: z.coerce.boolean(),
});

/** Convierte los errores de Zod en un mapa campo -> primer mensaje. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
