import type { MetadataRoute } from "next";
import { siteSettings, services, projects } from "@/content";

/**
 * Sitemap. Se genera en el build con las rutas estaticas, las nueve fichas de
 * servicio y los proyectos publicados.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteSettings.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/servicios", priority: 0.9, changeFrequency: "monthly" },
    { path: "/cursos", priority: 0.9, changeFrequency: "monthly" },
    { path: "/nosotros", priority: 0.8, changeFrequency: "yearly" },
    { path: "/proyectos", priority: 0.8, changeFrequency: "monthly" },
    { path: "/clientes", priority: 0.6, changeFrequency: "yearly" },
    { path: "/galeria", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contactenos", priority: 0.8, changeFrequency: "yearly" },
    { path: "/cotizar", priority: 0.9, changeFrequency: "yearly" },
    { path: "/redes-sociales", priority: 0.4, changeFrequency: "yearly" },
    { path: "/politica-de-privacidad", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...services.map((service) => ({
      url: `${base}/servicios/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((project) => ({
      url: `${base}/proyectos/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
