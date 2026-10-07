import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SocialIcon } from "./social-icon";
import type { SocialLinkContent } from "@/content/types";

interface FooterLink {
  label: string;
  href: string;
  column: number;
}

/**
 * Pie de pagina. Reproduce la estructura de las capturas: marca, datos de
 * contacto, tres columnas de enlaces, iconos sociales y barra legal.
 */
export function Footer({
  logoUrl,
  companyName,
  phoneDisplay,
  phone,
  email,
  links,
  socials,
  tagline,
}: {
  logoUrl: string;
  companyName: string;
  phoneDisplay: string;
  phone: string;
  email: string;
  links: readonly FooterLink[];
  socials: SocialLinkContent[];
  tagline: string;
}) {
  const columns = [1, 2, 3].map((n) => links.filter((l) => l.column === n));
  const footerSocials = socials.filter((s) => s.showInFooter);

  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-ink-950">
      {/* Resplandor inferior, presente en las capturas */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 size-[46rem] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(235,93,26,0.35) 0%, transparent 68%)",
        }}
      />

      <div className="relative">
        <div className="shell py-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-14 lg:grid-cols-[auto_1fr_auto]">
            {/* Marca + contacto */}
            <div className="flex flex-col gap-8 sm:flex-row sm:gap-12 md:flex-col md:gap-8">
              <Link
                href="/"
                className="flex items-center gap-3"
                aria-label={`${companyName} — inicio`}
              >
                <Image
                  src={logoUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="size-11"
                />
                <span className="leading-none">
                  <span className="block font-display text-lg font-extrabold tracking-tight text-white">
                    Sound Tech
                  </span>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.32em] text-brand-500">
                    Perú
                  </span>
                </span>
              </Link>

              <div>
                <p className="eyebrow mb-3">Contacto Info</p>
                <ul className="flex flex-col gap-2.5 text-sm">
                  <li>
                    <a
                      href={`tel:${phone}`}
                      className="inline-flex items-center gap-2 text-fog-300 transition-colors hover:text-brand-400"
                    >
                      <Phone className="size-3.5 text-brand-500" aria-hidden />
                      {phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 break-all text-fog-300 transition-colors hover:text-brand-400"
                    >
                      <Mail className="size-3.5 text-brand-500" aria-hidden />
                      {email}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enlaces */}
            <nav aria-label="Enlaces del pie" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {columns.map((column, index) => (
                <div key={index}>
                  <p className="eyebrow mb-3">
                    {index === 0 ? "Links" : "\u00A0"}
                  </p>
                  <ul className="flex flex-col gap-2.5 text-sm">
                    {column.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-2 text-fog-300 transition-colors hover:text-brand-400"
                        >
                          <span
                            aria-hidden
                            className="size-1 rounded-full bg-brand-600"
                          />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {/* Redes */}
            <div>
              <p className="eyebrow mb-3 md:text-right">Síguenos</p>
              <ul className="flex items-center gap-2.5 lg:justify-end">
                {footerSocials.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={
                        social.note
                          ? `${social.label} — ${social.note}`
                          : social.label
                      }
                      className="grid size-10 place-items-center rounded-full border border-hairline text-fog-300 transition-all hover:border-brand-600/70 hover:text-brand-400"
                    >
                      <SocialIcon platform={social.platform} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-[15rem] text-xs leading-relaxed text-fog-400 lg:text-right">
                {tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Barra legal */}
        <div className="border-t border-hairline">
          <div className="shell flex flex-col items-center justify-between gap-4 py-5 text-xs text-fog-400 md:flex-row">
            <p>
              <span className="font-semibold text-fog-200">Sound Tech Perú</span>
              <span className="mx-2 text-fog-600">©</span>
              Todos los derechos reservados
            </p>

            <Link
              href="/politica-de-privacidad"
              className="inline-block py-1.5 transition-colors hover:text-brand-400"
            >
              Política de privacidad
            </Link>

            <p className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/soundtechperu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1.5 text-brand-500 transition-colors hover:text-brand-400"
              >
                Instagram
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-block py-1.5 text-brand-500 transition-colors hover:text-brand-400"
              >
                Email
              </a>
              <Link
                href="/redes-sociales"
                className="inline-block py-1.5 text-brand-500 transition-colors hover:text-brand-400"
              >
                Comunidad
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
