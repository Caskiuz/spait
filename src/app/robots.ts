import type { MetadataRoute } from "next";
import { siteSettings } from "@/content";

export default function robots(): MetadataRoute.Robots {
  const base = siteSettings.siteUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // El panel y las rutas de API no deben indexarse.
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
