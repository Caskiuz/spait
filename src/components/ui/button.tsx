import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full font-display font-bold uppercase tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-3";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-[0_10px_34px_-14px_rgba(255,107,0,0.85)] hover:shadow-[0_16px_44px_-14px_rgba(255,107,0,0.95)] hover:brightness-110 active:brightness-95",
  outline:
    "border border-brand-600/70 text-brand-500 hover:bg-brand-600 hover:text-white hover:border-brand-600",
  ghost:
    "border border-hairline-strong text-fog-100 hover:border-brand-600/70 hover:text-brand-400",
  subtle:
    "bg-white/[0.06] text-fog-100 hover:bg-white/[0.12] border border-hairline",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[11px] tracking-[0.14em]",
  md: "h-11 px-6 text-xs tracking-[0.16em]",
  lg: "h-13 px-7 text-[13px] tracking-[0.16em]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
}

function Inner({ children, withArrow }: { children: ReactNode; withArrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {withArrow ? (
        <span
          aria-hidden
          className="grid size-5 shrink-0 place-items-center rounded-full bg-white/25 transition-transform duration-300 group-hover/btn:translate-x-0.5"
        >
          <ArrowRight className="size-3" strokeWidth={3} />
        </span>
      ) : null}
    </>
  );
}

/** Enlace con apariencia de boton. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  withArrow,
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, variants[variant], sizes[size], className)}
      >
        <Inner withArrow={withArrow}>{children}</Inner>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </Link>
  );
}

/** Boton nativo, usado en formularios. */
export function Button({
  variant = "primary",
  size = "md",
  withArrow,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </button>
  );
}
