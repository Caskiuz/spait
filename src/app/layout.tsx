import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteSettings } from "@/content";
import "./globals.css";

/**
 * BR Firma, la tipografía del diseñador.
 *
 * Los .woff2 se generaron desde los .ttf que envió el cliente: 200 KB los seis
 * pesos frente a los 525 KB de los originales.
 *
 * Según sus indicaciones: Black para los titulares de banner y Regular para
 * los textos pequeños.
 */
const brFirma = localFont({
  src: [
    { path: "../fonts/BRFirma-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/BRFirma-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/BRFirma-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/BRFirma-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/BRFirma-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/BRFirma-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-br-firma",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteSettings.siteUrl),
  title: {
    default: `${siteSettings.companyName} — Audio e integración tecnológica`,
    template: siteSettings.seoTitleTemplate,
  },
  description: siteSettings.seoDescription,
  applicationName: siteSettings.companyName,
  keywords: [
    "audio profesional Perú",
    "ingeniería de sonido",
    "acondicionamiento acústico",
    "videovigilancia CCTV",
    "cableado estructurado",
    "sistemas de conferencia",
    "iluminación arquitectónica",
    "videoproyección",
    "Sound Tech Perú",
  ],
  authors: [{ name: siteSettings.companyName }],
  creator: siteSettings.companyName,
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: siteSettings.companyName,
    title: `${siteSettings.companyName} — Audio e integración tecnológica`,
    description: siteSettings.seoDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteSettings.companyName} — Audio e integración tecnológica`,
    description: siteSettings.seoDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true, address: false, email: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PE" className={brFirma.variable}>
      <body className="min-h-dvh bg-ink-950 antialiased">
        {/* Enlace de salto: primera parada del teclado para accesibilidad */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-600 focus:px-5 focus:py-2.5 focus:font-display focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:text-white"
        >
          Ir al contenido
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
