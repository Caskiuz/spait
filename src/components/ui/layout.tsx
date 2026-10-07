import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Contenedor con el ancho de las capturas. */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "main" | "article";
}) {
  return <Tag className={cn("shell", className)}>{children}</Tag>;
}

/** Espaciado vertical estandar entre secciones. */
export function Section({
  children,
  className,
  id,
  as: Tag = "section",
  tone = "base",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "article";
  tone?: "base" | "raised" | "sunken";
}) {
  const tones = {
    base: "",
    // El tono se desvanece en los bordes para que la union con las secciones
    // vecinas sea de un solo color y no se vea el escalon.
    raised:
      "bg-gradient-to-b from-transparent via-ink-925/60 to-transparent",
    sunken: "bg-ink-950",
  } as const;

  return (
    <Tag
      id={id}
      className={cn(
        "relative py-16 md:py-20 lg:py-24",
        tones[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Glow radial ambar: el recurso atmosferico de las capturas.
 * Es puramente decorativo y no captura el puntero.
 */
export function GlowBlob({
  className,
  color = "rgba(235,93,26,0.30)",
  size = 520,
  animate = true,
}: {
  className?: string;
  color?: string;
  size?: number;
  animate?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn("glow-blob", animate && "animate-pulse-glow", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
      }}
    />
  );
}

/** Textura de puntos decorativa, usada junto a imagenes. */
export function DotPattern({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "dot-pattern pointer-events-none absolute text-white/25",
        className,
      )}
    />
  );
}

/** Grano sutil para superficies con imagen de fondo. */
export function Grain({ className }: { className?: string }) {
  return <span aria-hidden className={cn("grain-overlay", className)} />;
}
