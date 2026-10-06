import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { mediaUrl } from "@/components/site/media-image";
import { MotionProvider } from "@/components/ui/reveal";
import { footerNav, mainNav } from "@/content";
import { getSiteSettings, getSocialLinks } from "@/server/repositories/content";

/**
 * Plantilla del sitio publico: navbar flotante + contenido + pie.
 * Es la unica estructura de las paginas publicas, para que la navegacion y el
 * pie sean identicos en todas las rutas.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, socials] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
  ]);

  return (
    <MotionProvider>
      <div className="flex min-h-dvh flex-col">
        <Navbar
          items={mainNav.map((i) => ({ label: i.label, href: i.href }))}
          logoUrl={mediaUrl("logo-soundtech", "/media/logo-soundtech.svg")}
          companyName={settings.companyName}
        />

        <main id="contenido" className="flex-1">
          {children}
        </main>

        <Footer
          logoUrl={mediaUrl("logo-soundtech", "/media/logo-soundtech.svg")}
          companyName={settings.companyName}
          phoneDisplay={settings.phoneDisplay}
          phone={settings.phone}
          email={settings.email}
          links={footerNav}
          socials={socials}
          tagline={settings.tagline}
        />
      </div>
    </MotionProvider>
  );
}
