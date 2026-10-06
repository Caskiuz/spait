"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

/**
 * Barra de navegacion flotante en forma de pastilla, igual que el diseno:
 * logo a la izquierda, enlaces al centro y el boton de cotizar a la derecha.
 */
export function Navbar({
  items,
  logoUrl,
  companyName,
}: {
  items: NavItem[];
  logoUrl: string;
  companyName: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerramos el menu movil al cambiar de ruta.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloqueamos el scroll del fondo mientras el menu movil esta abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-4 md:pt-5">
      <div className="shell">
        <nav
          aria-label="Navegación principal"
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-4 rounded-full px-3 py-2.5 transition-all duration-300 md:px-4",
            scrolled
              ? "glass-bar shadow-[0_16px_40px_-24px_rgba(0,0,0,0.95)]"
              : "border border-transparent bg-ink-950/35 backdrop-blur-md",
          )}
        >
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 pl-1.5"
            aria-label={`${companyName} — inicio`}
          >
            <Image
              src={logoUrl}
              alt=""
              width={34}
              height={34}
              className="size-8 md:size-9"
              priority
            />
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-[15px] font-extrabold tracking-tight text-white">
                Sound Tech
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-brand-500">
                Perú
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                    isActive(item.href)
                      ? "text-brand-400"
                      : "text-fog-300 hover:text-white",
                  )}
                >
                  {item.label}
                  {isActive(item.href) ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 -bottom-0.5 h-px bg-brand-500/80"
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ButtonLink
              href="/cotizar"
              size="sm"
              withArrow
              className="hidden sm:inline-flex"
            >
              Cotizar Proyecto
            </ButtonLink>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="grid size-10 place-items-center rounded-full border border-hairline-strong text-fog-100 transition-colors hover:border-brand-600/70 hover:text-brand-400 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Menu movil */}
      <div
        id="menu-movil"
        hidden={!open}
        className="pointer-events-auto lg:hidden"
      >
        {open ? (
          <div className="shell mt-3">
            <div className="glass-bar rounded-3xl p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,1)]">
              <ul className="flex flex-col">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-2xl px-4 py-3 font-display text-sm font-bold uppercase tracking-wide transition-colors",
                        isActive(item.href)
                          ? "bg-brand-600/12 text-brand-400"
                          : "text-fog-200 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/cotizar"
                size="md"
                withArrow
                className="mt-4 w-full"
              >
                Cotizar Proyecto
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
