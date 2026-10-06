"use client";

import { useMemo, useState } from "react";
import { Container, Section } from "@/components/ui/layout";
import { MediaImage } from "@/components/site/media-image";
import { cn } from "@/lib/utils";

interface GalleryItem {
  title: string;
  category: string;
  imageKey: string;
}

/**
 * Galeria con filtro por categoria.
 * El filtrado es local (el conjunto es pequeno) y se anuncia por aria-live
 * para que los lectores de pantalla sepan cuantos elementos se muestran.
 */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const categories = useMemo(
    () => ["Todo", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );
  const [active, setActive] = useState("Todo");

  const visible = useMemo(
    () => (active === "Todo" ? items : items.filter((i) => i.category === active)),
    [items, active],
  );

  return (
    <Section className="pt-14 md:pt-16">
      <Container>
        {/* Filtros */}
        <div
          role="tablist"
          aria-label="Filtrar galería por categoría"
          className="flex flex-wrap gap-2.5"
        >
          {categories.map((category) => {
            const isActive = category === active;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(category)}
                className={cn(
                  "h-9 rounded-full border px-5 font-display text-[11px] font-bold uppercase tracking-[0.14em] transition-all",
                  isActive
                    ? "border-brand-600 bg-gradient-brand text-white"
                    : "border-hairline text-fog-300 hover:border-brand-600/60 hover:text-brand-400",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="mt-5 text-xs text-fog-500">
          {visible.length} {visible.length === 1 ? "imagen" : "imágenes"}
          {active !== "Todo" ? ` en ${active}` : ""}
        </p>

        {/* Rejilla */}
        <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visible.map((item) => (
            <li key={`${item.category}-${item.imageKey}-${item.title}`}>
              <figure className="group relative overflow-hidden rounded-card border border-hairline">
                <div className="aspect-4/3">
                  <MediaImage
                    mediaKey={item.imageKey}
                    sizes="(max-width: 1024px) 46vw, 23vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100"
                />

                <figcaption className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block font-display text-[10px] font-bold uppercase tracking-[0.16em] text-brand-400">
                    {item.category}
                  </span>
                  <span className="mt-1 block text-[11px] leading-snug text-fog-200">
                    {item.title}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
