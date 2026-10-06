/**
 * Seed de la base de datos.
 *
 * Uso:  npm run db:seed
 *
 * Carga en Postgres todo el contenido real extraido de las capturas del
 * cliente: los 9 servicios con sus bloques, el programa de cursos, los
 * clientes, las preguntas frecuentes, el portafolio y la galeria.
 *
 * Es idempotente: usa upsert por clave natural, asi que se puede volver a
 * ejecutar sin duplicar ni perder los cambios hechos desde el panel.
 *
 * El contenido vive en src/content/* para no duplicar la fuente de verdad.
 */

import { config as loadEnv } from "dotenv";
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

// Next.js lee .env.local; el CLI de Prisma y este script, solo .env.
loadEnv({ path: [".env.local", ".env"], quiet: true });

import {
  clients as clientSeed,
  course as courseSeed,
  faqs as faqSeed,
  media,
  pageHeroes,
  services as serviceSeed,
  siteSettings,
  socialLinks as socialSeed,
} from "../src/content/index";
import {
  galleryItems,
  projects as projectSeed,
  testimonials as testimonialSeed,
} from "../src/content/pages";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "\nFalta DATABASE_URL (o DIRECT_URL).\n\n" +
      "1. Crea una base PostgreSQL en Neon: https://neon.tech\n" +
      "2. Copia la cadena de conexion a .env.local\n" +
      "3. Vuelve a ejecutar: npm run db:seed\n",
  );
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

/** Clave de medios -> id, para enlazar las imagenes del contenido. */
const mediaIds = new Map<string, string>();

async function seedMedia() {
  for (const asset of Object.values(media)) {
    const existing = await prisma.mediaAsset.findUnique({
      where: { key: asset.key },
    });

    if (existing) {
      mediaIds.set(asset.key, existing.id);
      continue;
    }

    const created = await prisma.mediaAsset.create({
      data: {
        key: asset.key,
        url: asset.url,
        alt: asset.alt,
        folder: asset.key.startsWith("hero-")
          ? "heroes"
          : asset.key.startsWith("client-")
            ? "clientes"
            : asset.key.startsWith("course-")
              ? "academia"
              : "servicios",
      },
    });
    mediaIds.set(asset.key, created.id);
  }
  console.log(`  ${mediaIds.size} medios`);
}

function mediaId(key?: string): string | null {
  if (!key) return null;
  return mediaIds.get(key) ?? null;
}

async function seedUsers() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@soundtechperu.com";

  // Sin contrasena en el entorno se genera una aleatoria y se imprime una
  // sola vez. Asi no existe una contrasena por defecto que alguien pueda
  // adivinar ni que quede escrita en el repositorio.
  const provided = process.env.SEED_ADMIN_PASSWORD?.trim();
  const generated = provided ? null : generatePassword();
  const password = provided || generated!;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`  usuario ${email} ya existe (no se toca la contraseña)`);
    return;
  }

  await prisma.user.create({
    data: {
      name: "Administrador Sound Tech",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  console.log(`  usuario inicial: ${email}`);
  if (generated) {
    console.log("");
    console.log("  ┌─────────────────────────────────────────────────────────┐");
    console.log("  │ CONTRASEÑA GENERADA — anótala, no se vuelve a mostrar   │");
    console.log("  └─────────────────────────────────────────────────────────┘");
    console.log(`   ${generated}`);
    console.log("");
  } else {
    console.log("  contraseña tomada de SEED_ADMIN_PASSWORD");
  }
}

/** Contraseña aleatoria legible pero fuerte (base64url de 24 bytes). */
function generatePassword(): string {
  return randomBytes(24).toString("base64url");
}

async function seedSettings() {
  const entries: [string, string | number][] = [
    ["companyName", siteSettings.companyName],
    ["legalName", siteSettings.legalName],
    ["tagline", siteSettings.tagline],
    ["phone", siteSettings.phone],
    ["phoneDisplay", siteSettings.phoneDisplay],
    ["whatsapp", siteSettings.whatsapp],
    ["email", siteSettings.email],
    ["address", siteSettings.address],
    ["hours", siteSettings.hours],
    ["yearsOfExperience", siteSettings.yearsOfExperience],
    ["siteUrl", siteSettings.siteUrl],
    ["seoTitleTemplate", siteSettings.seoTitleTemplate],
    ["seoDescription", siteSettings.seoDescription],
  ];

  for (const [key, value] of entries) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value, group: "general" },
    });
  }
  console.log(`  ${entries.length} ajustes del sitio`);
}

async function seedSocials() {
  for (const social of socialSeed) {
    const existing = await prisma.socialLink.findFirst({
      where: { platform: social.platform, label: social.label },
    });

    if (existing) continue;

    await prisma.socialLink.create({
      data: {
        platform: social.platform,
        label: social.label,
        url: social.url,
        isFeatured: social.isFeatured,
        showInFooter: social.showInFooter,
        order: social.order,
        note: social.note,
      },
    });
  }
  console.log(`  ${socialSeed.length} redes sociales`);
}

async function seedPages() {
  for (const hero of Object.values(pageHeroes)) {
    await prisma.page.upsert({
      where: { slug: hero.slug },
      update: {},
      create: {
        slug: hero.slug,
        title: `${hero.heroTitleLead} ${hero.heroTitleAccent}`.trim(),
        heroTitleLead: hero.heroTitleLead,
        heroTitleAccent: hero.heroTitleAccent,
        heroSubtitle: hero.heroSubtitle,
        heroImageId: mediaId(hero.heroImageKey),
        seoTitle: hero.seoTitle,
        seoDescription: hero.seoDescription,
      },
    });
  }
  console.log(`  ${Object.keys(pageHeroes).length} páginas`);
}

async function seedServices() {
  for (const service of serviceSeed) {
    const heroImageId = mediaId(service.imageKeys[0]);

    const created = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        slug: service.slug,
        title: service.title,
        titleLead: service.titleLead,
        titleAccent: service.titleAccent,
        order: service.order,
        isFeatured: service.isFeatured,
        areaLabel: service.areaLabel,
        areaDescription: service.areaDescription,
        summary: service.summary,
        solutionsEyebrow: service.solutionsEyebrow,
        solutionsTitle: service.solutionsTitle,
        solutionsSubtitle: service.solutionsSubtitle,
        applicationsTitle: service.applicationsTitle,
        applicationsSubtitle: service.applicationsSubtitle,
        scopeTitle: service.scopeTitle,
        scopeIntro: service.scopeIntro,
        ctaTitle: service.ctaTitle,
        ctaSubtitle: service.ctaSubtitle,
        ctaButtonLabel: service.ctaButtonLabel,
        keywords: service.keywords,
        heroImageId,
      },
    });

    // Si ya existia, sus bloques ya se cargaron en una ejecucion anterior.
    const existingParagraphs = await prisma.serviceParagraph.count({
      where: { serviceId: created.id },
    });
    if (existingParagraphs > 0) continue;

    await prisma.serviceParagraph.createMany({
      data: service.paragraphs.map((paragraph, index) => ({
        serviceId: created.id,
        text: paragraph.text,
        highlight: paragraph.highlight ?? false,
        order: index,
      })),
    });

    const imageRows = service.imageKeys
      .map((key, index) => {
        const id = mediaId(key);
        return id
          ? { serviceId: created.id, mediaId: id, order: index }
          : null;
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);

    if (imageRows.length) {
      await prisma.serviceImage.createMany({ data: imageRows });
    }

    await prisma.serviceSolution.createMany({
      data: service.solutions.map((solution, index) => ({
        serviceId: created.id,
        number: solution.number,
        title: solution.title,
        order: index,
      })),
    });

    await prisma.solutionCard.create({
      data: {
        serviceId: created.id,
        title: service.solutionCard.title,
        accentWord: service.solutionCard.accentWord,
        description: service.solutionCard.description,
        badgeValue: service.solutionCard.badgeValue,
        badgeLabel: service.solutionCard.badgeLabel,
        imageId: mediaId(service.imageKeys[0]),
      },
    });

    if (service.applications?.length) {
      await prisma.serviceApplication.createMany({
        data: service.applications.map((application, index) => ({
          serviceId: created.id,
          title: application.title,
          description: application.description,
          side: application.side,
          emphasized: application.emphasized ?? false,
          order: index,
        })),
      });
    }

    if (service.applicationHighlight) {
      await prisma.serviceApplicationHighlight.create({
        data: {
          serviceId: created.id,
          title: service.applicationHighlight.title,
          bullets: service.applicationHighlight.bullets,
        },
      });
    }

    if (service.scopeGroups?.length) {
      await prisma.serviceScopeGroup.createMany({
        data: service.scopeGroups.map((group, index) => ({
          serviceId: created.id,
          size: group.size,
          title: group.title,
          description: group.description,
          order: index,
        })),
      });
    }
  }

  console.log(
    `  ${serviceSeed.length} servicios con sus bloques ` +
      `(${serviceSeed.reduce((a, s) => a + s.solutions.length, 0)} soluciones)`,
  );
}

async function seedCourse() {
  const existing = await prisma.course.findUnique({
    where: { slug: courseSeed.slug },
  });
  if (existing) {
    console.log("  curso ya cargado");
    return;
  }

  const course = await prisma.course.create({
    data: {
      slug: courseSeed.slug,
      title: courseSeed.title,
      headline: courseSeed.headline,
      headlineAccent: courseSeed.headlineAccent,
      subtitle: courseSeed.subtitle,
      duration: courseSeed.duration,
      moduleCount: courseSeed.moduleCount,
      description: courseSeed.description,
      facilitiesIntro: courseSeed.facilitiesIntro,
      outcomesIntro: courseSeed.outcomesIntro,
      trendsTitle: courseSeed.trendsTitle,
      isPublished: courseSeed.isPublished,
      coverImageId: mediaId("course-studio"),
      badges: {
        create: courseSeed.badges.map((badge, index) => ({
          title: badge.title,
          description: badge.description,
          icon: badge.icon,
          order: index,
        })),
      },
      highlights: {
        create: courseSeed.highlights.map((highlight, index) => ({
          title: highlight.title,
          description: highlight.description,
          order: index,
        })),
      },
      modules: {
        create: courseSeed.modules.map((module, index) => ({
          number: module.number,
          title: module.title,
          duration: module.duration,
          description: module.description,
          order: index,
        })),
      },
      facilities: {
        create: courseSeed.facilities.map((facility, index) => ({
          title: facility.title,
          mediaId: mediaId(facility.imageKey),
          order: index,
        })),
      },
      outcomes: {
        create: courseSeed.outcomes.map((outcome, index) => ({
          title: outcome.title,
          order: index,
        })),
      },
      trends: {
        create: courseSeed.trends.map((trend, index) => ({
          title: trend.title,
          order: index,
        })),
      },
    },
  });

  console.log(
    `  curso "${course.title}" con ${courseSeed.modules.length} módulos`,
  );
}

async function seedClients() {
  for (const client of clientSeed) {
    const existing = await prisma.client.findFirst({
      where: { name: client.name },
    });
    if (existing) continue;

    await prisma.client.create({
      data: {
        name: client.name,
        shortName: client.shortName,
        category: client.category,
        logoId: mediaId(client.logoKey),
        order: client.order,
        isVisible: client.isVisible,
      },
    });
  }
  console.log(`  ${clientSeed.length} clientes`);
}

async function seedFaqs() {
  for (const faq of faqSeed) {
    const existing = await prisma.faq.findFirst({
      where: { question: faq.question },
    });
    if (existing) continue;

    await prisma.faq.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        category: "general",
        order: faq.order,
        isVisible: faq.isVisible,
      },
    });
  }
  console.log(`  ${faqSeed.length} preguntas frecuentes`);
}

async function seedTestimonials() {
  for (const testimonial of testimonialSeed) {
    const existing = await prisma.testimonial.findFirst({
      where: { author: testimonial.author },
    });
    if (existing) continue;

    await prisma.testimonial.create({
      data: {
        author: testimonial.author,
        role: testimonial.role,
        quote: testimonial.quote,
        order: testimonial.order,
      },
    });
  }
  console.log(`  ${testimonialSeed.length} testimonios`);
}

async function seedGallery() {
  const count = await prisma.galleryImage.count();
  if (count > 0) {
    console.log("  galería ya cargada");
    return;
  }

  const rows = galleryItems
    .map((item) => {
      const id = mediaId(item.imageKey);
      if (!id) return null;
      return {
        title: item.title,
        category: item.category,
        mediaId: id,
        order: item.order,
        isVisible: item.isVisible,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  await prisma.galleryImage.createMany({ data: rows });
  console.log(`  ${rows.length} imágenes de galería`);
}

async function seedProjects() {
  for (const project of projectSeed) {
    const existing = await prisma.project.findUnique({
      where: { slug: project.slug },
    });
    if (existing) continue;

    const category = await prisma.projectCategory.upsert({
      where: { slug: project.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: {},
      create: {
        name: project.category,
        slug: project.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      },
    });

    const client = project.clientName
      ? await prisma.client.findFirst({ where: { name: project.clientName } })
      : null;

    await prisma.project.create({
      data: {
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        description: project.description,
        year: project.year,
        location: project.location,
        isFeatured: project.isFeatured,
        order: project.order,
        clientId: client?.id ?? null,
        categoryId: category.id,
        coverImageId: mediaId(project.coverImageKey),
        images: {
          create: project.galleryKeys
            .map((key, index) => {
              const id = mediaId(key);
              return id
                ? { mediaId: id, order: index }
                : null;
            })
            .filter((row): row is NonNullable<typeof row> => row !== null),
        },
      },
    });
  }
  console.log(`  ${projectSeed.length} proyectos`);
}

async function main() {
  console.log("\nCargando contenido de Sound Tech Perú…\n");

  await seedMedia();
  await seedUsers();
  await seedSettings();
  await seedSocials();
  await seedPages();
  await seedServices();
  await seedCourse();
  await seedClients();
  await seedFaqs();
  await seedTestimonials();
  await seedGallery();
  await seedProjects();

  const summary = {
    servicios: await prisma.service.count(),
    soluciones: await prisma.serviceSolution.count(),
    clientes: await prisma.client.count(),
    preguntas: await prisma.faq.count(),
    proyectos: await prisma.project.count(),
    medios: await prisma.mediaAsset.count(),
  };

  console.log("\nResumen:", summary);
  console.log("\nListo. El sitio ya puede leer el contenido desde la base de datos.\n");
}

main()
  .catch((error) => {
    console.error("\nEl seed falló:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
