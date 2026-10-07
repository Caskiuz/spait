/**
 * Tipos del contenido del sitio.
 *
 * Estos tipos son la fuente de verdad compartida entre:
 *  - el contenido base extraido de las capturas del cliente (src/content/*)
 *  - el script de seed de la base de datos (prisma/seed.ts)
 *  - la capa de repositorios que sirve datos a las paginas (src/server/repositories)
 */

export type LeadStatus = "NUEVO" | "EN_PROCESO" | "ATENDIDO" | "DESCARTADO";

export type ProjectScopeSize = "PEQUENO" | "MEDIANO" | "GRANDE";

export type ApplicationSide = "IZQUIERDA" | "DERECHA";

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "discord"
  | "x"
  | "pinterest"
  | "youtube"
  | "tiktok";

export interface SocialLinkContent {
  platform: SocialPlatform;
  label: string;
  url: string;
  /** Aparece en la seccion grande "Redes Sociales" */
  isFeatured: boolean;
  /** Aparece en el pie de pagina */
  showInFooter: boolean;
  order: number;
  isVisible?: boolean;
  /** Nota interna para el cliente cuando la URL aun es provisional */
  note?: string;
}

export interface ServiceParagraphContent {
  text: string;
  /** Parrafos destacados se muestran con el prefijo "Nuestras soluciones..." */
  highlight?: boolean;
}

export interface ServiceSolutionContent {
  /** Numero visible: 01 - 04 */
  number: string;
  title: string;
  /** Los PDFs del cliente describen cada solucion en una frase. */
  description?: string;
}

export interface SolutionCardContent {
  title: string;
  description: string;
  badgeValue: string;
  badgeLabel: string;
  /** Palabra del titular que se pinta en naranja */
  accentWord?: string;
}

export interface ServiceApplicationContent {
  title: string;
  description: string;
  side: ApplicationSide;
  /** Se muestra resaltado dentro del grid de aplicaciones */
  emphasized?: boolean;
  /** Numero correlativo cuando el bloque los numera (01, 02…). */
  number?: string;
}

export interface ServiceScopeGroupContent {
  size: ProjectScopeSize;
  title: string;
  description: string;
}

export interface ServiceApplicationHighlightContent {
  title: string;
  bullets: string[];
}

export interface ServiceContent {
  slug: string;
  title: string;
  /** Parte del titulo que se pinta en naranja */
  titleAccent: string;
  /** Parte del titulo que se pinta en blanco */
  titleLead: string;
  order: number;
  /**
   * Posicion en la rejilla de areas de /nosotros. En el diseno ese orden es
   * distinto al de la lista de /servicios, por eso se guarda aparte.
   */
  areaOrder: number;
  isFeatured: boolean;
  /** Etiqueta corta para el grid de "areas" en /nosotros */
  areaLabel: string;
  areaDescription: string;
  summary: string;
  paragraphs: ServiceParagraphContent[];
  imageKeys: string[];
  solutionsEyebrow?: string;
  solutionsTitle: string;
  solutionsSubtitle?: string;
  solutions: ServiceSolutionContent[];
  solutionCard: SolutionCardContent;
  applicationsTitle?: string;
  applicationsSubtitle?: string;
  applications?: ServiceApplicationContent[];
  applicationHighlight?: ServiceApplicationHighlightContent;
  scopeTitle?: string;
  scopeIntro?: string;
  scopeGroups?: ServiceScopeGroupContent[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonLabel: string;
  /** Palabra clave para el buscador interno y los metadatos */
  keywords: string[];
}

export interface CourseHighlightContent {
  title: string;
  description: string;
}

export interface CourseFacilityContent {
  title: string;
  imageKey: string;
}

export interface CourseOutcomeContent {
  title: string;
}

export interface CourseTrendContent {
  title: string;
}

export interface CourseBadgeContent {
  title: string;
  description: string;
  icon: "practice" | "certificate" | "jobs";
}

export interface CourseModuleContent {
  number: number;
  title: string;
  duration: string;
  description: string;
}

export interface CourseContent {
  slug: string;
  title: string;
  headline: string;
  headlineAccent: string;
  subtitle: string;
  duration: string;
  moduleCount: number;
  description: string[];
  badges: CourseBadgeContent[];
  highlights: CourseHighlightContent[];
  modules: CourseModuleContent[];
  facilitiesIntro: string;
  facilities: CourseFacilityContent[];
  outcomesIntro: string;
  outcomes: CourseOutcomeContent[];
  trendsTitle: string;
  trends: CourseTrendContent[];
  isPublished: boolean;
}

export interface ClientContent {
  name: string;
  /** Nombre corto usado en la tarjeta del carrusel */
  shortName: string;
  category: string;
  logoKey: string;
  /** Si se indica, el logo del carrusel enlaza al sitio del cliente. */
  websiteUrl?: string;
  order: number;
  isVisible: boolean;
}

export interface FaqContent {
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
}

export interface PageHeroContent {
  slug: string;
  heroTitleLead: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroImageKey: string;
  seoTitle: string;
  seoDescription: string;
}

export interface SiteSettingsContent {
  companyName: string;
  legalName: string;
  tagline: string;
  /** Persona de contacto que figura en el material del cliente. */
  contactName: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  /** Dominio publico indicado por el cliente (sin protocolo). */
  website: string;
  address: string;
  hours: string;
  yearsOfExperience: number;
  siteUrl: string;
  seoTitleTemplate: string;
  seoDescription: string;
}

export interface MediaContent {
  key: string;
  url: string;
  alt: string;
  /** Opcionales: el manifiesto se genera escaneando public/media. */
  width?: number;
  height?: number;
}
