import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteSettings } from "@/content";
import "./globals.css";

/* BR Firma se declara en globals.css sobre los .woff2 de public/fonts.
   Se precargan solo los tres pesos que se ven al abrir: Black (titulares),
   Bold (botones y etiquetas) y Light (texto corrido). Regular, Medium y
   SemiBold se descargan bajo demanda; juntos sumaban 97 KB en la ruta
   critica del movil. */
const FUENTES_CRITICAS = [
  "/fonts/BRFirma-Light.woff2",
  "/fonts/BRFirma-Bold.woff2",
  "/fonts/BRFirma-Black.woff2",
];

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
    <html lang="es-PE">
      <body className="min-h-dvh bg-ink-950 antialiased">
        {FUENTES_CRITICAS.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
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
