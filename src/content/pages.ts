import type { MediaContent } from "./types";

/* ==========================================================================
   Galeria, proyectos y testimonios.
   No aparecen en las capturas entregadas: se construyen con el mismo sistema
   visual y quedan administrables desde el panel para que el cliente los
   complete con su contenido real.
   ========================================================================== */

export interface GalleryItemContent {
  title: string;
  category: string;
  imageKey: string;
  order: number;
  isVisible: boolean;
}

export const galleryCategories = [
  "Instalaciones",
  "Estudio de grabación",
  "Aulas",
  "Proyectos",
] as const;

export const galleryItems: GalleryItemContent[] = [
  { title: "Estudio de grabación profesional", category: "Estudio de grabación", imageKey: "course-studio", order: 1, isVisible: true },
  { title: "Sala de control con consola análoga", category: "Estudio de grabación", imageKey: "hero-nosotros", order: 2, isVisible: true },
  { title: "Aula acondicionada acústicamente", category: "Aulas", imageKey: "acustica-2", order: 3, isVisible: true },
  { title: "Laboratorio de informática musical", category: "Aulas", imageKey: "course-lab", order: 4, isVisible: true },
  { title: "Panel acústico instalado", category: "Proyectos", imageKey: "acustica-1", order: 5, isVisible: true },
  { title: "Rack de comunicaciones", category: "Proyectos", imageKey: "cableado-1", order: 6, isVisible: true },
  { title: "Patch panel y cableado estructurado", category: "Proyectos", imageKey: "cableado-2", order: 7, isVisible: true },
  { title: "Videovigilancia en operación", category: "Proyectos", imageKey: "cctv-1", order: 8, isVisible: true },
  { title: "Video wall instalado", category: "Instalaciones", imageKey: "video-1", order: 9, isVisible: true },
  { title: "Sala de videoconferencia", category: "Instalaciones", imageKey: "teleconferencia-1", order: 10, isVisible: true },
  { title: "Sala de directorio equipada", category: "Instalaciones", imageKey: "conferencia-1", order: 11, isVisible: true },
  { title: "Iluminación comercial", category: "Proyectos", imageKey: "iluminacion-1", order: 12, isVisible: true },
  { title: "Sistema de audio ambiental", category: "Instalaciones", imageKey: "audio-1", order: 13, isVisible: true },
  { title: "Control integrado de sala", category: "Instalaciones", imageKey: "control-2", order: 14, isVisible: true },
  { title: "Proyección en auditorio", category: "Instalaciones", imageKey: "video-2", order: 15, isVisible: true },
  { title: "Capacitación en estudio", category: "Aulas", imageKey: "academy-photo", order: 16, isVisible: true },
];

export interface ProjectCardContent {
  slug: string;
  title: string;
  summary: string;
  clientName?: string;
  category: string;
  year?: number;
  location?: string;
  coverImageKey: string;
  galleryKeys: string[];
  description: string[];
  isFeatured: boolean;
  order: number;
}

export const projectCategories = [
  "Audio y acústica",
  "Videovigilancia",
  "Redes y cableado",
  "Control e iluminación",
  "Educación",
] as const;

export const projects: ProjectCardContent[] = [
  {
    slug: "auditorio-escolar-audio-e-iluminacion",
    title: "Auditorio escolar con audio e iluminación escénica",
    summary:
      "Sistema de refuerzo sonoro, microfonía inalámbrica e iluminación de escenario para un auditorio de 400 butacas.",
    clientName: "Colegio San Francisco de Borja",
    category: "Audio y acústica",
    year: 2024,
    location: "Lima, Perú",
    coverImageKey: "hero-proyectos",
    galleryKeys: ["audio-1", "iluminacion-1", "faq-photo"],
    description: [
      "El colegio necesitaba un auditorio capaz de recibir actos cívicos, presentaciones artísticas y conferencias sin depender de equipos alquilados por evento.",
      "Diseñamos un sistema de refuerzo sonoro con cobertura uniforme en las 400 butacas, microfonía inalámbrica de mano y de solapa, y un set de iluminación escénica con escenas programadas para cada tipo de acto.",
      "La operación quedó a cargo del personal del colegio con un control táctil que simplifica el encendido, las escenas de luz y los niveles de audio.",
    ],
    isFeatured: true,
    order: 1,
  },
  {
    slug: "videovigilancia-colegio-control-integral",
    title: "Videovigilancia integral en institución educativa",
    summary:
      "28 cámaras IP, grabación centralizada y monitoreo por zonas para tres pabellones y dos patios.",
    clientName: "Colegio Nuestra Señora del Consuelo",
    category: "Videovigilancia",
    year: 2024,
    location: "Lima, Perú",
    coverImageKey: "cctv-1",
    galleryKeys: ["cctv-1", "cableado-1", "control-1"],
    description: [
      "La institución necesitaba cubrir accesos, patios y pasillos manteniendo un registro consultable por la dirección y la coordinación de disciplina.",
      "Planificamos la ubicación de cada cámara con un estudio de cobertura para eliminar puntos ciegos, y unificamos la instalación sobre el cableado estructurado existente.",
      "El resultado es un monitoreo por zonas con grabación continua y búsqueda por evento, accesible desde la dirección del colegio.",
    ],
    isFeatured: true,
    order: 2,
  },
  {
    slug: "sala-de-directorio-conferencia-y-votacion",
    title: "Sala de directorio con conferencia y votación",
    summary:
      "Sistema de conferencia con identificación de oradores, votación electrónica y grabación de actas.",
    clientName: "Colegio Carmelines",
    category: "Control e iluminación",
    year: 2025,
    location: "Lima, Perú",
    coverImageKey: "conferencia-1",
    galleryKeys: ["conferencia-1", "teleconferencia-1", "control-2"],
    description: [
      "Las sesiones de directorio requerían registro ordenado de intervenciones y votaciones trazables.",
      "Instalamos una mesa de conferencia con unidad de presidente, micrófonos de cuello de ganso, identificación de orador y votación electrónica integrada al software de actas.",
      "Se sumó un sistema de videoconferencia que permite incorporar participantes remotos con la misma calidad de audio que los presentes.",
    ],
    isFeatured: true,
    order: 3,
  },
  {
    slug: "red-de-datos-y-cableado-estructurado",
    title: "Red de datos y cableado estructurado certificado",
    summary:
      "Cableado certificado categoría 6A para cuatro pabellones, rack principal y gabinetes secundarios.",
    clientName: "Colegio Reino del Mundo",
    category: "Redes y cableado",
    year: 2025,
    location: "Lima, Perú",
    coverImageKey: "cableado-1",
    galleryKeys: ["cableado-1", "cableado-2", "control-1"],
    description: [
      "El colegio crecía en aulas y servicios digitales sobre una red improvisada y sin documentación.",
      "Diseñamos la topología completa, canalizamos y tendimos cableado categoría 6A, reorganizamos el rack principal y agregamos gabinetes secundarios por pabellón.",
      "Cada punto quedó etiquetado y certificado, con planos y reportes de medición entregados al área de sistemas del colegio.",
    ],
    isFeatured: false,
    order: 4,
  },
  {
    slug: "acondicionamiento-acustico-de-aulas",
    title: "Acondicionamiento acústico de aulas y sala de música",
    summary:
      "Medición, diseño y tratamiento acústico para reducir reverberación en seis aulas y una sala de ensayo.",
    category: "Audio y acústica",
    year: 2025,
    location: "Lima, Perú",
    coverImageKey: "acustica-1",
    galleryKeys: ["acustica-1", "acustica-2", "acoustica-2"],
    description: [
      "En las aulas la voz del docente se perdía por reverberación excesiva y la sala de música generaba molestias en los ambientes vecinos.",
      "Realizamos mediciones de tiempo de reverberación y transmisión, y planteamos una solución combinada de absorción y aislamiento.",
      "Tras la instalación verificamos los resultados con una segunda medición y entregamos el informe técnico.",
    ],
    isFeatured: false,
    order: 5,
  },
  {
    slug: "iluminacion-y-control-de-salas-comunes",
    title: "Iluminación y control de salas comunes",
    summary:
      "Iluminación arquitectónica y control por escenas en sala de usos múltiples y hall de ingreso.",
    clientName: "Colegio San Francisco de Borja",
    category: "Control e iluminación",
    year: 2023,
    location: "Lima, Perú",
    coverImageKey: "iluminacion-1",
    galleryKeys: ["iluminacion-1", "control-2", "video-1"],
    description: [
      "La sala de usos múltiples requería flexibilidad para actividades distintas sin reinstalar luminarias cada vez.",
      "Propusimos un sistema de iluminación arquitectónica con control por escenas y programación horaria, integrado al control centralizado del espacio.",
      "Hoy el personal cambia la configuración del ambiente desde un panel sin asistencia técnica.",
    ],
    isFeatured: false,
    order: 6,
  },
];

/* ==========================================================================
   Testimonios
   ========================================================================== */

export interface TestimonialContent {
  author: string;
  role: string;
  quote: string;
  order: number;
}

export const testimonials: TestimonialContent[] = [
  {
    author: "Dirección académica",
    role: "Colegio San Francisco de Borja",
    quote:
      "El auditorio quedó impecable. Ahora realizamos los actos sin alquilar equipos y el personal lo opera sin complicaciones.",
    order: 1,
  },
  {
    author: "Coordinación general",
    role: "Colegio Nuestra Señora del Consuelo",
    quote:
      "La cobertura de las cámaras eliminó los puntos ciegos que teníamos. El acompañamiento posterior fue muy bueno.",
    order: 2,
  },
  {
    author: "Administración",
    role: "Colegio Carmelines",
    quote:
      "Las sesiones de directorio ahora quedan registradas y las votaciones son trazables. Ganamos orden y tiempo.",
    order: 3,
  },
];

/* ==========================================================================
   Bloques de la Home
   Orden y visibilidad administrables desde /admin (PageSection).
   ========================================================================== */

export interface HomeSectionContent {
  id: string;
  type: string;
  label: string;
  order: number;
  isVisible: boolean;
}

export const homeSections: HomeSectionContent[] = [
  { id: "hero", type: "HERO", label: "Portada", order: 1, isVisible: true },
  { id: "about", type: "SPLIT_ABOUT", label: "Sobre nosotros", order: 2, isVisible: true },
  { id: "services", type: "SERVICES_SHOWCASE", label: "Nuestros servicios", order: 3, isVisible: true },
  { id: "academy", type: "ACADEMY_BANNER", label: "Ingenieros de sonido", order: 4, isVisible: true },
  { id: "clients", type: "CLIENTS_CAROUSEL", label: "Nuestros clientes", order: 5, isVisible: true },
  { id: "socials", type: "SOCIALS", label: "Redes sociales", order: 6, isVisible: true },
  { id: "faq", type: "FAQ", label: "Preguntas frecuentes", order: 7, isVisible: true },
];

/* ==========================================================================
   Ayudas de tipos
   ========================================================================== */

export type { MediaContent };
