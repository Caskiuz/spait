import type { SVGProps } from "react";
import type { SocialPlatform } from "@/content/types";

/**
 * Iconos de marca en SVG en linea.
 * Lucide retiro los iconos de marcas, asi que se definen aqui en trazo simple
 * para mantener el mismo peso visual que el resto de la iconografia.
 */

type IconProps = SVGProps<SVGSVGElement>;

const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...common} {...props}>
      <path d="M15.5 8.5h-1.8c-.6 0-1 .4-1 1v2h2.7l-.4 2.6h-2.3V21" />
      <path d="M12.4 14.1V21" />
      <path d="M12.4 9.3V8.2c0-1.3 1-2.2 2.3-2.2h1.3" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...common} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg {...common} {...props}>
      <path d="M20 11.6a8 8 0 0 1-11.9 7L4 20l1.5-3.9A8 8 0 1 1 20 11.6Z" />
      <path d="M9.2 8.6c.3-.1.6 0 .8.3l.6 1c.1.3.1.5-.1.7l-.4.4c-.2.2-.2.4-.1.6.4.7 1 1.3 1.7 1.7.2.1.4.1.6-.1l.4-.4c.2-.2.5-.2.7-.1l1 .6c.3.2.4.5.3.8-.2.7-1 1.2-1.8 1.1-2.3-.3-4.5-2.5-4.8-4.8-.1-.7.4-1.5 1.1-1.8Z" />
    </svg>
  );
}

export function DiscordIcon(props: IconProps) {
  return (
    <svg {...common} {...props}>
      <path d="M8.5 7.5c2.3-.7 4.7-.7 7 0" />
      <path d="M7.6 17.2c-1.4-2.1-2-4.5-1.9-7 .1-.9.3-1.8.6-2.6.9-.6 1.9-1 2.9-1.2l.6 1.1c1.4-.2 2.8-.2 4.2 0l.6-1.1c1 .2 2 .6 2.9 1.2.3.8.5 1.7.6 2.6.1 2.5-.5 4.9-1.9 7" />
      <path d="M7.6 17.2c1.3.6 2.7.9 4.2.9s2.9-.3 4.2-.9" />
      <circle cx="9.6" cy="12.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.4" cy="12.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...common} {...props}>
      <path d="M4.5 4.5l6.2 8.1-6 7h2.1l4.8-5.7 4.4 5.7h3.5l-6.5-8.5 5.7-6.6h-2.1l-4.5 5.3-4.1-5.3H4.5Z" />
    </svg>
  );
}

export function PinterestIcon(props: IconProps) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.6 20c.5-1.6 1.1-3.9 1.4-5.3" />
      <path d="M9.6 10.9c-.3-1.6.9-3.1 2.7-3.1 1.7 0 2.9 1.1 2.9 2.8 0 2-1.1 3.5-2.6 3.5-.8 0-1.4-.6-1.2-1.4" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...common} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="3.6" />
      <path d="M10.6 9.6l4.2 2.4-4.2 2.4V9.6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokIcon(props: IconProps) {
  return (
    <svg {...common} {...props}>
      <path d="M14.2 4.2v9.5a3.4 3.4 0 1 1-3.4-3.4" />
      <path d="M14.2 6.2c.5 1.6 1.8 2.7 3.5 2.8" />
    </svg>
  );
}

const registry: Record<SocialPlatform, (p: IconProps) => React.JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  whatsapp: WhatsappIcon,
  discord: DiscordIcon,
  x: XIcon,
  pinterest: PinterestIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
};

export function SocialIcon({
  platform,
  ...props
}: IconProps & { platform: SocialPlatform }) {
  const Icon = registry[platform] ?? FacebookIcon;
  return <Icon {...props} />;
}

export const socialRegistry = registry;
