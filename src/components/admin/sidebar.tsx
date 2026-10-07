"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Cable,
  FolderKanban,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  Share2,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  {
    group: "General",
    items: [{ label: "Escritorio", href: "/admin", icon: LayoutDashboard }],
  },
  {
    group: "Prospectos",
    items: [
      { label: "Mensajes", href: "/admin/mensajes", icon: Inbox },
      { label: "Matrículas", href: "/admin/matriculas", icon: UserRound },
      {
        label: "Cotizaciones",
        href: "/admin/cotizaciones",
        icon: MessageSquareQuote,
      },
    ],
  },
  {
    group: "Contenido",
    items: [
      { label: "Servicios", href: "/admin/servicios", icon: Cable },
      { label: "Clientes", href: "/admin/clientes", icon: Users },
      { label: "Proyectos", href: "/admin/proyectos", icon: FolderKanban },
      { label: "Preguntas frecuentes", href: "/admin/faqs", icon: Sparkles },
      { label: "Redes sociales", href: "/admin/redes-sociales", icon: Share2 },
      { label: "Medios", href: "/admin/medios", icon: Images },
    ],
  },
  {
    group: "Sistema",
    items: [{ label: "Configuración", href: "/admin/configuracion", icon: Settings }],
  },
] as const;

export function AdminSidebar({
  user,
  logoUrl,
  alerts = 0,
}: {
  user: { name?: string | null; email?: string | null; role: string };
  logoUrl: string;
  alerts?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const content = (
    <>
      <Link
        href="/admin"
        className="flex items-center gap-3 px-5 py-5"
        onClick={() => setOpen(false)}
      >
        <Image src={logoUrl} alt="" width={1200} height={349} className="h-8 w-auto" />
        <span className="leading-none">
          <span className="block font-display text-[13px] font-extrabold tracking-tight text-white">
            Sound Tech
          </span>
          <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.28em] text-brand-500">
            Panel
          </span>
        </span>
      </Link>

      <nav aria-label="Secciones del panel" className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV.map((section) => (
          <div key={section.group} className="mb-5">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-fog-600">
              {section.group}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors",
                        active
                          ? "bg-brand-600/12 font-semibold text-brand-400"
                          : "text-fog-300 hover:bg-white/[0.05] hover:text-white",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      <span className="flex-1">{item.label}</span>
                      {item.href === "/admin/mensajes" && alerts > 0 ? (
                        <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {alerts}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-hairline p-4">
        <p className="truncate text-xs font-semibold text-fog-200">
          {user.name ?? "Usuario"}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-fog-500">{user.email}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-brand-500">
          {user.role === "ADMIN" ? "Administrador" : "Editor"}
        </p>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-4 flex w-full items-center gap-2.5 rounded-xl border border-hairline px-3 py-2.5 text-xs text-fog-300 transition-colors hover:border-red-500/40 hover:text-red-300"
        >
          <LogOut className="size-3.5" aria-hidden />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Barra superior en movil */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-ink-950/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image src={logoUrl} alt="" width={1200} height={349} className="h-6 w-auto" />
          <span className="font-display text-sm font-extrabold text-white">
            Panel
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="grid size-9 place-items-center rounded-xl border border-hairline text-fog-200"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <aside className="flex w-72 max-w-[82%] flex-col border-r border-hairline bg-ink-950">
            {content}
          </aside>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="flex-1 bg-ink-950/70 backdrop-blur-sm"
          />
        </div>
      ) : null}

      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-hairline bg-ink-925 lg:flex">
        {content}
      </aside>
    </>
  );
}
