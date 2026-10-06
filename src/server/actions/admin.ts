"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireUser } from "@/lib/auth";
import { requirePrisma } from "@/lib/db";
import {
  clientFormSchema,
  faqFormSchema,
  leadNoteSchema,
  leadStatusSchema,
  serviceFormSchema,
  siteSettingsSchema,
  socialLinkFormSchema,
  fieldErrors,
} from "@/lib/validations";

/**
 * Acciones del panel de administracion.
 *
 * Cada accion:
 *  1. exige sesion valida (el middleware no cubre las Server Actions),
 *  2. valida la entrada con Zod,
 *  3. escribe en la base de datos,
 *  4. registra la auditoria,
 *  5. revalida el contenido publico.
 */

export interface ActionResult {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
}

const ok = (message = "Cambios guardados."): ActionResult => ({ ok: true, message });
const fail = (message: string, errors?: Record<string, string>): ActionResult => ({
  ok: false,
  message,
  errors,
});

/** Registra la accion en el historial de auditoria. */
async function audit(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  diff?: unknown,
) {
  const prisma = requirePrisma();
  await prisma.auditLog
    .create({
      data: {
        userId,
        action,
        entity,
        entityId,
        diff: diff === undefined ? undefined : (diff as object),
      },
    })
    .catch((error) => console.error("[auditoria] no se pudo registrar:", error));
}

/** Invalida las cachés del sitio publico tras un cambio de contenido. */
function refreshContent() {
  // En Next 16 revalidateTag exige un perfil de vida de caché; "max" es el
  // adecuado para contenido que solo cambia cuando alguien lo edita.
  revalidateTag("content", "max");
  revalidatePath("/", "layout");
}

/* ==========================================================================
   Prospectos
   ========================================================================== */

type LeadKind = "mensaje" | "matricula" | "cotizacion";

function leadDelegate(kind: LeadKind) {
  const prisma = requirePrisma();
  switch (kind) {
    case "mensaje":
      return prisma.contactMessage;
    case "matricula":
      return prisma.enrollment;
    case "cotizacion":
      return prisma.quoteRequest;
  }
}

const LEAD_PATHS: Record<LeadKind, string> = {
  mensaje: "/admin/mensajes",
  matricula: "/admin/matriculas",
  cotizacion: "/admin/cotizaciones",
};

export async function updateLeadStatus(
  kind: LeadKind,
  id: string,
  status: string,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = leadStatusSchema.safeParse(status);
  if (!parsed.success) return fail("Estado no válido.");

  const delegate = leadDelegate(kind) as unknown as {
    update: (args: unknown) => Promise<unknown>;
  };

  try {
    await delegate.update({ where: { id }, data: { status: parsed.data } });
  } catch (error) {
    console.error("[panel] fallo al cambiar estado:", error);
    return fail("No pudimos actualizar el estado.");
  }

  await audit(user.id, "CAMBIAR_ESTADO", kind, id, { status: parsed.data });
  revalidatePath(LEAD_PATHS[kind]);
  revalidatePath(`${LEAD_PATHS[kind]}/${id}`);
  return ok("Estado actualizado.");
}

export async function addLeadNote(
  kind: LeadKind,
  id: string,
  body: string,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = leadNoteSchema.safeParse({ body });
  if (!parsed.success) return fail("La nota no es válida.", fieldErrors(parsed.error));

  const prisma = requirePrisma();
  const link =
    kind === "mensaje"
      ? { contactMessageId: id }
      : kind === "matricula"
        ? { enrollmentId: id }
        : { quoteRequestId: id };

  try {
    await prisma.leadNote.create({
      data: { body: parsed.data.body, authorId: user.id, ...link },
    });
  } catch (error) {
    console.error("[panel] fallo al guardar la nota:", error);
    return fail("No pudimos guardar la nota.");
  }

  await audit(user.id, "AGREGAR_NOTA", kind, id);
  revalidatePath(`${LEAD_PATHS[kind]}/${id}`);
  return ok("Nota agregada.");
}

/* ==========================================================================
   Servicios
   ========================================================================== */

export async function updateService(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();
  const prisma = requirePrisma();

  const raw = Object.fromEntries(formData.entries());
  const parsed = serviceFormSchema.safeParse({
    ...raw,
    isPublished: raw.isPublished === "on" || raw.isPublished === "true",
    isFeatured: raw.isFeatured === "on" || raw.isFeatured === "true",
  });

  if (!parsed.success) {
    return fail("Revisa los campos marcados.", fieldErrors(parsed.error));
  }

  const data = parsed.data;

  try {
    await prisma.service.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        titleLead: data.titleLead,
        titleAccent: data.titleAccent,
        summary: data.summary,
        areaLabel: data.areaLabel,
        areaDescription: data.areaDescription,
        solutionsTitle: data.solutionsTitle,
        ctaTitle: data.ctaTitle,
        ctaSubtitle: data.ctaSubtitle,
        ctaButtonLabel: data.ctaButtonLabel,
        order: data.order,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        keywords: data.keywords ? data.keywords.split(",").map((k) => k.trim()) : [],
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    });
  } catch (error) {
    console.error("[panel] fallo al guardar el servicio:", error);
    return fail(
      "No pudimos guardar el servicio. Verifica que el slug no esté repetido.",
    );
  }

  await audit(user.id, "EDITAR", "servicio", id, { slug: data.slug });
  refreshContent();
  revalidatePath("/admin/servicios");
  revalidatePath(`/admin/servicios/${id}`);
  return ok("Servicio guardado.");
}

export async function deleteService(id: string): Promise<ActionResult> {
  await requireUser();
  const prisma = requirePrisma();

  try {
    await prisma.service.delete({ where: { id } });
  } catch (error) {
    console.error("[panel] fallo al eliminar el servicio:", error);
    return fail("No pudimos eliminar el servicio.");
  }

  refreshContent();
  revalidatePath("/admin/servicios");
  return ok("Servicio eliminado.");
}

/* ==========================================================================
   Clientes
   ========================================================================== */

export async function saveClient(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();
  const prisma = requirePrisma();

  const raw = Object.fromEntries(formData.entries());
  const parsed = clientFormSchema.safeParse({
    ...raw,
    isVisible: raw.isVisible === "on" || raw.isVisible === "true",
  });

  if (!parsed.success) {
    return fail("Revisa los campos marcados.", fieldErrors(parsed.error));
  }

  const data = parsed.data;

  try {
    if (id) {
      await prisma.client.update({
        where: { id },
        data: {
          name: data.name,
          shortName: data.shortName,
          category: data.category,
          websiteUrl: data.websiteUrl || null,
          order: data.order,
          isVisible: data.isVisible,
        },
      });
    } else {
      await prisma.client.create({
        data: {
          name: data.name,
          shortName: data.shortName,
          category: data.category,
          websiteUrl: data.websiteUrl || null,
          order: data.order,
          isVisible: data.isVisible,
        },
      });
    }
  } catch (error) {
    console.error("[panel] fallo al guardar el cliente:", error);
    return fail("No pudimos guardar el cliente.");
  }

  await audit(user.id, id ? "EDITAR" : "CREAR", "cliente", id ?? undefined);
  refreshContent();
  revalidatePath("/admin/clientes");
  return ok("Cliente guardado.");
}

export async function deleteClient(id: string): Promise<ActionResult> {
  await requireUser();
  const prisma = requirePrisma();

  try {
    await prisma.client.delete({ where: { id } });
  } catch (error) {
    console.error("[panel] fallo al eliminar el cliente:", error);
    return fail("No pudimos eliminar el cliente.");
  }

  refreshContent();
  revalidatePath("/admin/clientes");
  return ok("Cliente eliminado.");
}

/* ==========================================================================
   Preguntas frecuentes
   ========================================================================== */

export async function saveFaq(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();
  const prisma = requirePrisma();

  const raw = Object.fromEntries(formData.entries());
  const parsed = faqFormSchema.safeParse({
    ...raw,
    isVisible: raw.isVisible === "on" || raw.isVisible === "true",
  });

  if (!parsed.success) {
    return fail("Revisa los campos marcados.", fieldErrors(parsed.error));
  }

  const data = parsed.data;
  const payload = {
    question: data.question,
    answer: data.answer,
    category: data.category || "general",
    order: data.order,
    isVisible: data.isVisible,
  };

  try {
    if (id) {
      await prisma.faq.update({ where: { id }, data: payload });
    } else {
      await prisma.faq.create({ data: payload });
    }
  } catch (error) {
    console.error("[panel] fallo al guardar la pregunta:", error);
    return fail("No pudimos guardar la pregunta.");
  }

  await audit(user.id, id ? "EDITAR" : "CREAR", "faq", id ?? undefined);
  refreshContent();
  revalidatePath("/admin/faqs");
  return ok("Pregunta guardada.");
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  await requireUser();
  const prisma = requirePrisma();

  try {
    await prisma.faq.delete({ where: { id } });
  } catch (error) {
    console.error("[panel] fallo al eliminar la pregunta:", error);
    return fail("No pudimos eliminar la pregunta.");
  }

  refreshContent();
  revalidatePath("/admin/faqs");
  return ok("Pregunta eliminada.");
}

/* ==========================================================================
   Redes sociales
   ========================================================================== */

export async function saveSocialLink(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();
  const prisma = requirePrisma();

  const raw = Object.fromEntries(formData.entries());
  const asBool = (v: unknown) => v === "on" || v === "true";

  const parsed = socialLinkFormSchema.safeParse({
    ...raw,
    isFeatured: asBool(raw.isFeatured),
    showInFooter: asBool(raw.showInFooter),
    isVisible: asBool(raw.isVisible),
  });

  if (!parsed.success) {
    return fail("Revisa los campos marcados.", fieldErrors(parsed.error));
  }

  const data = parsed.data;
  const payload = {
    platform: data.platform,
    label: data.label,
    url: data.url,
    isFeatured: data.isFeatured,
    showInFooter: data.showInFooter,
    isVisible: data.isVisible,
    order: data.order,
    note: data.note || null,
  };

  try {
    if (id) {
      await prisma.socialLink.update({ where: { id }, data: payload });
    } else {
      await prisma.socialLink.create({ data: payload });
    }
  } catch (error) {
    console.error("[panel] fallo al guardar la red social:", error);
    return fail("No pudimos guardar la red social.");
  }

  await audit(user.id, id ? "EDITAR" : "CREAR", "red-social", id ?? undefined);
  refreshContent();
  revalidatePath("/admin/redes-sociales");
  return ok("Red social guardada.");
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  await requireUser();
  const prisma = requirePrisma();

  try {
    await prisma.socialLink.delete({ where: { id } });
  } catch (error) {
    console.error("[panel] fallo al eliminar la red social:", error);
    return fail("No pudimos eliminar la red social.");
  }

  refreshContent();
  revalidatePath("/admin/redes-sociales");
  return ok("Red social eliminada.");
}

/* ==========================================================================
   Configuracion del sitio
   ========================================================================== */

export async function updateSiteSettings(
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();
  const prisma = requirePrisma();

  const raw = Object.fromEntries(formData.entries());
  const parsed = siteSettingsSchema.safeParse(raw);

  if (!parsed.success) {
    return fail("Revisa los campos marcados.", fieldErrors(parsed.error));
  }

  const data = parsed.data as Record<string, string | undefined>;

  try {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string, group: "general" },
      });
    }
  } catch (error) {
    console.error("[panel] fallo al guardar la configuración:", error);
    return fail("No pudimos guardar la configuración.");
  }

  await audit(user.id, "EDITAR", "configuracion");
  refreshContent();
  revalidatePath("/admin/configuracion");
  return ok("Configuración guardada.");
}

/* ==========================================================================
   Medios
   ========================================================================== */

export async function deleteMediaAsset(id: string): Promise<ActionResult> {
  const user = await requireUser();
  const prisma = requirePrisma();

  try {
    await prisma.mediaAsset.delete({ where: { id } });
  } catch (error) {
    console.error("[panel] fallo al eliminar el medio:", error);
    return fail(
      "No pudimos eliminar la imagen: puede estar en uso en algún contenido.",
    );
  }

  await audit(user.id, "ELIMINAR", "medio", id);
  refreshContent();
  revalidatePath("/admin/medios");
  return ok("Imagen eliminada.");
}
