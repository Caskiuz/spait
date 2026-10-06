import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteSettings } from "@/content";
import "./globals.css";

/**
 * Tipografia del diseno: Montserrat en todos sus pesos.
 * Los titulares usan 700-900 en mayusculas; el cuerpo, 300-400.
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
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
    <html lang="es-PE" className={montserrat.variable}>
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
