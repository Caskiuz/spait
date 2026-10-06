import { unstable_cache } from "next/cache";
import { getPrisma } from "@/lib/db";
import { env } from "@/lib/env";
import {
  clients as clientSeed,
  course as courseSeed,
  faqs as faqSeed,
  pageHeroes as pageHeroSeed,
  services as serviceSeed,
  siteSettings as settingsSeed,
  socialLinks as socialSeed,
} from "@/content";
import type {
  ClientContent,
  CourseContent,
  FaqContent,
  PageHeroContent,
  ServiceContent,
  SocialLinkContent,
} from "@/content/types";

/**
 * Capa de acceso a contenido.
 *
 * El sitio publico siempre consume estos tipos, nunca filas de Prisma
 * directamente. Cuando hay DATABASE_URL los datos vienen del CMS; cuando no,
 * se sirve el contenido base extraido de las capturas (src/content).
 *
 * Asi el sitio es desplegable en Vercel y presentable al cliente desde el
 * primer minuto, y activa el CMS en cuanto se conecta Neon.
 *
 * Las lecturas se memorizan por peticion y se etiquetan para poder
 * revalidarlas desde el panel con revalidateTag("content").
 */

const CONTENT_TAG = "content";
const REVALIDATE_SECONDS = 300;

/* ==========================================================================
   Configuracion del sitio
   ========================================================================== */

export type SiteSettingsView = typeof settingsSeed;

/**
 * Ajustes base con la URL del entorno actual ya aplicada.
 * `siteUrl` nunca viene de la base de datos: es lo unico que cambia entre
 * local, preview y produccion, asi que se resuelve siempre en tiempo de
 * ejecucion (ver src/lib/env.ts).
 */
const baseSettings = { ...settingsSeed, siteUrl: env.siteUrl };

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsView> => {
    const prisma = getPrisma();
    if (!prisma) return baseSettings;

    try {
      const rows = await prisma.siteSetting.findMany({ where: { group: "general" } });
      if (!rows.length) return baseSettings;

      // SiteSetting.value es Json: solo aplicamos claves conocidas cuyo valor
      // guardado coincide con el tipo del valor por defecto. Asi un ajuste mal
      // guardado no puede romper la pagina.
      const template = settingsSeed as unknown as Record<string, unknown>;
      const stored: Record<string, unknown> = {};

      for (const row of rows) {
        if (!(row.key in template)) continue;
        const value = row.value as unknown;
        if (typeof value !== typeof template[row.key]) continue;
        stored[row.key] = value;
      }

      // El cast es seguro: cada valor de `stored` ya se contrasto contra el
      // tipo de su equivalente en settingsSeed justo arriba.
      return { ...baseSettings, ...stored } as SiteSettingsView;
    } catch (error) {
      console.error("[contenido] fallo al leer SiteSetting, se usa el respaldo:", error);
      return baseSettings;
    }
  },
  ["site-settings"],
  { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
);

/* ==========================================================================
   Redes sociales
   ========================================================================== */

export const getSocialLinks = unstable_cache(
  async (): Promise<SocialLinkContent[]> => {
    const prisma = getPrisma();
    if (!prisma) return socialSeed;

    try {
      const rows = await prisma.socialLink.findMany({
        where: { isVisible: true },
        orderBy: { order: "asc" },
      });
      if (!rows.length) return socialSeed;

      return rows.map((r) => ({
        platform: r.platform as SocialLinkContent["platform"],
        label: r.label,
        url: r.url,
        isFeatured: r.isFeatured,
        showInFooter: r.showInFooter,
        order: r.order,
        note: r.note ?? undefined,
      }));
    } catch (error) {
      console.error("[contenido] fallo al leer SocialLink, se usa el respaldo:", error);
      return socialSeed;
    }
  },
  ["social-links"],
  { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
);

/* ==========================================================================
   Servicios
   ========================================================================== */

type ServiceRow = Awaited<ReturnType<typeof loadServiceRows>>[number];

function loadServiceRows() {
  const prisma = getPrisma();
  if (!prisma) return Promise.resolve([] as never[]);

  return prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: {
      heroImage: true,
      paragraphs: { orderBy: { order: "asc" } },
      images: { orderBy: { order: "asc" }, include: { media: true } },
      solutions: { orderBy: { order: "asc" } },
      solutionCard: { include: { image: true } },
      applications: { orderBy: { order: "asc" } },
      applicationHighlight: true,
      scopeGroups: { orderBy: { order: "asc" } },
    },
  });
}

function mapService(row: ServiceRow): ServiceContent {
  return {
    slug: row.slug,
    title: row.title,
    titleLead: row.titleLead,
    titleAccent: row.titleAccent,
    order: row.order,
    isFeatured: row.isFeatured,
    areaLabel: row.areaLabel,
    areaDescription: row.areaDescription,
    summary: row.summary,
    paragraphs: row.paragraphs.map((p) => ({
      text: p.text,
      highlight: p.highlight,
    })),
    imageKeys: row.images.map((i) => i.media.key ?? i.media.url),
    solutionsEyebrow: row.solutionsEyebrow ?? undefined,
    solutionsTitle: row.solutionsTitle,
    solutionsSubtitle: row.solutionsSubtitle ?? undefined,
    solutions: row.solutions.map((s) => ({ number: s.number, title: s.title })),
    solutionCard: row.solutionCard
      ? {
          title: row.solutionCard.title,
          accentWord: row.solutionCard.accentWord ?? undefined,
          description: row.solutionCard.description,
          badgeValue: row.solutionCard.badgeValue,
          badgeLabel: row.solutionCard.badgeLabel,
        }
      : {
          title: row.title,
          description: row.summary,
          badgeValue: "10 años",
          badgeLabel: "de experiencia",
        },
    applicationsTitle: row.applicationsTitle ?? undefined,
    applicationsSubtitle: row.applicationsSubtitle ?? undefined,
    applications: row.applications.length
      ? row.applications.map((a) => ({
          title: a.title,
          description: a.description,
          side: a.side,
          emphasized: a.emphasized,
        }))
      : undefined,
    applicationHighlight: row.applicationHighlight
      ? {
          title: row.applicationHighlight.title,
          bullets: row.applicationHighlight.bullets,
        }
      : undefined,
    scopeTitle: row.scopeTitle ?? undefined,
    scopeIntro: row.scopeIntro ?? undefined,
    scopeGroups: row.scopeGroups.length
      ? row.scopeGroups.map((g) => ({
          size: g.size,
          title: g.title,
          description: g.description,
        }))
      : undefined,
    ctaTitle: row.ctaTitle,
    ctaSubtitle: row.ctaSubtitle,
    ctaButtonLabel: row.ctaButtonLabel,
    keywords: row.keywords,
  };
}

export const getServices = unstable_cache(
  async (): Promise<ServiceContent[]> => {
    const prisma = getPrisma();
    if (!prisma) return serviceSeed;

    try {
      const rows = await loadServiceRows();
      if (!rows.length) return serviceSeed;
      return rows.map(mapService);
    } catch (error) {
      console.error("[contenido] fallo al leer Service, se usa el respaldo:", error);
      return serviceSeed;
    }
  },
  ["services"],
  { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
);

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceContent | undefined> {
  const all = await getServices();
  return all.find((s) => s.slug === slug);
}

export async function getFeaturedServices(): Promise<ServiceContent[]> {
  const all = await getServices();
  const featured = all.filter((s) => s.isFeatured);
  return featured.length ? featured : all;
}

/** Solo las claves de imagen declaradas en el contenido base tienen archivo. */
export function serviceImageKeys(service: ServiceContent): string[] {
  return service.imageKeys;
}

/* ==========================================================================
   Clientes
   ========================================================================== */

export const getClients = unstable_cache(
  async (): Promise<ClientContent[]> => {
    const prisma = getPrisma();
    if (!prisma) return clientSeed;

    try {
      const rows = await prisma.client.findMany({
        where: { isVisible: true },
        orderBy: { order: "asc" },
        include: { logo: true },
      });
      if (!rows.length) return clientSeed;

      return rows.map((c) => ({
        name: c.name,
        shortName: c.shortName,
        category: c.category,
        logoKey: c.logo?.key ?? c.logo?.url ?? "",
        order: c.order,
        isVisible: c.isVisible,
      }));
    } catch (error) {
      console.error("[contenido] fallo al leer Client, se usa el respaldo:", error);
      return clientSeed;
    }
  },
  ["clients"],
  { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
);

/* ==========================================================================
   Preguntas frecuentes
   ========================================================================== */

export const getFaqs = unstable_cache(
  async (): Promise<FaqContent[]> => {
    const prisma = getPrisma();
    if (!prisma) return faqSeed;

    try {
      const rows = await prisma.faq.findMany({
        where: { isVisible: true, category: "general" },
        orderBy: { order: "asc" },
      });
      if (!rows.length) return faqSeed;

      return rows.map((f) => ({
        question: f.question,
        answer: f.answer,
        order: f.order,
        isVisible: f.isVisible,
      }));
    } catch (error) {
      console.error("[contenido] fallo al leer Faq, se usa el respaldo:", error);
      return faqSeed;
    }
  },
  ["faqs"],
  { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
);

/* ==========================================================================
   Cursos
   ========================================================================== */

export const getCourse = unstable_cache(
  async (slug?: string): Promise<CourseContent | null> => {
    const prisma = getPrisma();
    if (!prisma) return courseSeed;

    try {
      const row = await prisma.course.findFirst({
        where: {
          isPublished: true,
          ...(slug ? { slug } : {}),
        },
        orderBy: { order: "asc" },
        include: {
          badges: { orderBy: { order: "asc" } },
          highlights: { orderBy: { order: "asc" } },
          modules: { orderBy: { order: "asc" } },
          facilities: { orderBy: { order: "asc" }, include: { media: true } },
          outcomes: { orderBy: { order: "asc" } },
          trends: { orderBy: { order: "asc" } },
        },
      });
      if (!row) return courseSeed;

      return {
        slug: row.slug,
        title: row.title,
        headline: row.headline,
        headlineAccent: row.headlineAccent,
        subtitle: row.subtitle,
        duration: row.duration,
        moduleCount: row.moduleCount,
        description: row.description,
        badges: row.badges.map((b) => ({
          title: b.title,
          description: b.description,
          icon: b.icon as "practice" | "certificate" | "jobs",
        })),
        highlights: row.highlights.map((h) => ({
          title: h.title,
          description: h.description,
        })),
        modules: row.modules.map((m) => ({
          number: m.number,
          title: m.title,
          duration: m.duration,
          description: m.description,
        })),
        facilitiesIntro: row.facilitiesIntro,
        facilities: row.facilities.map((f) => ({
          title: f.title,
          imageKey: f.media?.key ?? f.media?.url ?? "",
        })),
        outcomesIntro: row.outcomesIntro,
        outcomes: row.outcomes.map((o) => ({ title: o.title })),
        trendsTitle: row.trendsTitle,
        trends: row.trends.map((t) => ({ title: t.title })),
        isPublished: row.isPublished,
      };
    } catch (error) {
      console.error("[contenido] fallo al leer Course, se usa el respaldo:", error);
      return courseSeed;
    }
  },
  ["course"],
  { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
);

/* ==========================================================================
   Encabezados de pagina
   ========================================================================== */

export async function getPageHero(slug: string): Promise<PageHeroContent | null> {
  const fallback = pageHeroSeed[slug] ?? null;

  const prisma = getPrisma();
  if (!prisma) return fallback;

  try {
    const row = await prisma.page.findUnique({
      where: { slug },
      include: { heroImage: true },
    });
    if (!row) return fallback;

    return {
      slug: row.slug,
      heroTitleLead: row.heroTitleLead,
      heroTitleAccent: row.heroTitleAccent,
      heroSubtitle: row.heroSubtitle,
      heroImageKey: row.heroImage?.key ?? row.heroImage?.url ?? fallback?.heroImageKey ?? "",
      seoTitle: row.seoTitle ?? fallback?.seoTitle ?? row.title,
      seoDescription: row.seoDescription ?? fallback?.seoDescription ?? "",
    };
  } catch (error) {
    console.error("[contenido] fallo al leer Page, se usa el respaldo:", error);
    return fallback;
  }
}
