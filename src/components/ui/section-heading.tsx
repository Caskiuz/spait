import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Titular de seccion: etiqueta pequena + titulo bicolor.
 *
 * El diseno de referencia siempre usa la misma construccion:
 * una palabra en blanco y la siguiente en naranja, en mayusculas y muy pesada.
 */
export function SectionHeading({
  eyebrow,
  titleLead,
  titleAccent,
  subtitle,
  align = "left",
  size = "md",
  className,
  children,
}: {
  eyebrow?: string;
  titleLead?: string;
  titleAccent?: string;
  subtitle?: string;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  children?: ReactNode;
}) {
  const sizes = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl lg:text-[2.75rem]",
    lg: "text-4xl md:text-5xl lg:text-[3.5rem]",
    xl: "text-5xl md:text-6xl lg:text-[4.5rem]",
  } as const;

  return (
    <div
      className={cn(
        "relative",
        align === "center" && "text-center",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}

      {titleLead || titleAccent ? (
        <h2 className={cn("headline", sizes[size])}>
          {titleLead ? <span className="text-white">{titleLead} </span> : null}
          {titleAccent ? (
            <span className="text-gradient-brand">{titleAccent}</span>
          ) : null}
        </h2>
      ) : null}

      {subtitle ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-fog-400",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      ) : null}

      {children}
    </div>
  );
}
