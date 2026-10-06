import type { ClientContent, CourseContent, FaqContent, PageHeroContent, SiteSettingsContent, SocialLinkContent } from "./types";

/* ==========================================================================
   Configuracion general del sitio (datos extraidos de las capturas)
   ========================================================================== */

export const siteSettings: SiteSettingsContent = {
  companyName: "Sound Tech Perú",
  legalName: "Sound Tech Perú",
  tagline: "Tecnología que conecta personas",
  phone: "+51961927974",
  phoneDisplay: "+51 961 927 974",
  whatsapp: "51961927974",
  email: "soundtechperu@gmail.com",
  address: "Lima, Perú",
  hours: "Lun a Sáb · 9:00 a 19:00",
  yearsOfExperience: 10,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  seoTitleTemplate: "%s | Sound Tech Perú",
  seoDescription:
    "Soluciones profesionales de audio e integración tecnológica. Audio profesional, acústica, conferencia y votación, control integrado, iluminación, videoproyección, CCTV y cableado estructurado. Formación de ingenieros de sonido en Perú.",
};

/* ==========================================================================
   Redes sociales
   Nota: en las capturas de referencia los tres accesos apuntan a la misma
   URL de Facebook. El administrador puede reemplazarlas desde /admin.
   ========================================================================== */

export const socialLinks: SocialLinkContent[] = [
  {
    platform: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/soundtechperu",
    isFeatured: true,
    showInFooter: true,
    order: 1,
  },
  {
    platform: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/51961927974",
    isFeatured: true,
    showInFooter: false,
    order: 2,
  },
  {
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/soundtechperu",
    isFeatured: true,
    showInFooter: true,
    order: 3,
  },
  {
    platform: "discord",
    label: "Discord",
    url: "https://www.facebook.com/soundtechperu",
    isFeatured: false,
    showInFooter: false,
    order: 4,
    note: "Pendiente: reemplazar por la invitación real de Discord.",
  },
  {
    platform: "x",
    label: "X",
    url: "https://x.com/soundtechperu",
    isFeatured: false,
    showInFooter: true,
    order: 5,
    note: "Pendiente: confirmar usuario de X (Twitter).",
  },
  {
    platform: "pinterest",
    label: "Pinterest",
    url: "https://www.pinterest.com/soundtechperu",
    isFeatured: false,
    showInFooter: true,
    order: 6,
    note: "Pendiente: confirmar perfil de Pinterest.",
  },
];

/* ==========================================================================
   Navegacion
   ========================================================================== */

export const mainNav = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Cursos", href: "/cursos" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Contáctenos", href: "/contactenos" },
] as const;

export const footerNav = [
  { label: "Nosotros", href: "/nosotros", column: 1 },
  { label: "Servicios", href: "/servicios", column: 1 },
  { label: "Cursos", href: "/cursos", column: 2 },
  { label: "Galería", href: "/galeria", column: 2 },
  { label: "Clientes", href: "/clientes", column: 3 },
  { label: "Redes Sociales", href: "/redes-sociales", column: 3 },
] as const;

/* ==========================================================================
   Clientes destacados
   ========================================================================== */

export const clients: ClientContent[] = [
  {
    name: "Colegio Carmelines",
    shortName: "Colegio Carmelines",
    category: "Educación",
    logoKey: "client-carmelines",
    order: 1,
    isVisible: true,
  },
  {
    name: "Colegio San Francisco de Borja",
    shortName: "Colegio San Francisco de Borja",
    category: "Educación",
    logoKey: "client-san-francisco-de-borja",
    order: 2,
    isVisible: true,
  },
  {
    name: "Colegio Nuestra Señora del Consuelo",
    shortName: "Colegio Nuestra Sra. Del Consuelo",
    category: "Educación",
    logoKey: "client-nuestra-senora-del-consuelo",
    order: 3,
    isVisible: true,
  },
  {
    name: "Colegio Reino del Mundo",
    shortName: "Colegio Reino del Mundo",
    category: "Educación",
    logoKey: "client-reino-del-mundo",
    order: 4,
    isVisible: true,
  },
];

/* ==========================================================================
   Preguntas frecuentes
   ========================================================================== */

export const faqs: FaqContent[] = [
  {
    question: "¿Cuánto dura el curso?",
    answer:
      "La carrera está conformada por 4 módulos de 3 meses cada uno, con una duración total de un año.",
    order: 1,
    isVisible: true,
  },
  {
    question: "¿Cómo es la propuesta estándar?",
    answer:
      "Contamos con una metodología de enseñanza personalizada y adaptada, con tecnología profesional y docentes en actividad.",
    order: 2,
    isVisible: true,
  },
  {
    question: "¿Cuentan con certificación?",
    answer:
      "Sí. Cada módulo concluido cuenta con su certificación pedagógica, con estándares de universidades.",
    order: 3,
    isVisible: true,
  },
  {
    question: "¿Cómo los contacto?",
    answer:
      "Haz clic en WhatsApp, Facebook o Instagram. También puedes escribirnos desde el formulario de contacto y te responderemos a la brevedad.",
    order: 4,
    isVisible: true,
  },
];

/* ==========================================================================
   Curso: Ingeniería de Sonido
   ========================================================================== */

export const course: CourseContent = {
  slug: "ingenieria-de-sonido",
  title: "Ingeniería de Sonido",
  headline: "FORMAMOS",
  headlineAccent: "INGENIEROS DE SONIDO PARA UN MUNDO QUE SUENA",
  subtitle:
    "Educación técnica profesional con estándares internacionales y enfoque práctico.",
  duration: "1 año (4 módulos)",
  moduleCount: 4,
  description: [
    "Sound Tech Perú es un centro de capacitación técnica especializada en ingeniería de sonido.",
    "Contamos con un programa profesional de un año de duración, conformado por 4 módulos de 3 meses cada uno, con certificación en cada módulo pedagógico.",
    "Brindamos formación 100% práctica, con docentes profesionales en actividad y equipos de última generación. Preparamos a nuestros estudiantes para enfrentar los retos actuales de la industria del sonido, con los estándares de las universidades.",
  ],
  badges: [
    {
      title: "100% PRÁCTICA",
      description: "En nuestras aulas",
      icon: "practice",
    },
    {
      title: "CERTIFICACIÓN",
      description: "Certificados por módulo",
      icon: "certificate",
    },
    {
      title: "SALIDAS LABORALES",
      description: "Audio, televisión y más",
      icon: "jobs",
    },
  ],
  highlights: [
    {
      title: "Docentes profesionales",
      description:
        "Formación en sonido en actividad, con experiencia real en la industria.",
    },
    {
      title: "Enfoque 100% práctico",
      description:
        "Aprendizaje técnico con equipos reales y proyectos reales.",
    },
    {
      title: "Estudio de grabación propio",
      description:
        "Nuestros alumnos realizan prácticas profesionales en nuestro estudio.",
    },
    {
      title: "Certificación por módulo",
      description:
        "Certificación profesional al concluir cada etapa de la formación.",
    },
    {
      title: "Alta demanda laboral",
      description:
        "Formación orientada a las exigencias del mercado actual.",
    },
  ],
  modules: [
    {
      number: 1,
      title: "Fundamentos del audio",
      duration: "3 meses",
      description:
        "Física del sonido, acústica básica, señal de audio y operación de equipos.",
    },
    {
      number: 2,
      title: "Grabación y microfonía",
      duration: "3 meses",
      description:
        "Técnicas de micrófono, captura multipista y trabajo en estudio de grabación.",
    },
    {
      number: 3,
      title: "Mezcla y procesamiento",
      duration: "3 meses",
      description:
        "Ecualización, dinámica, efectos, mezcla análoga y digital.",
    },
    {
      number: 4,
      title: "Sonido en vivo y post-producción",
      duration: "3 meses",
      description:
        "Sistemas de refuerzo sonoro, monitoreo, diseño sonoro y post-producción.",
    },
  ],
  facilitiesIntro:
    "Contamos con ambientes acondicionados acústicamente y equipados con tecnología profesional.",
  facilities: [
    { title: "ESTUDIO DE GRABACIÓN PROFESIONAL", imageKey: "course-studio" },
    { title: "AULAS ACONDICIONADAS ACÚSTICAMENTE", imageKey: "course-classroom" },
    { title: "LABORATORIO DE INFORMÁTICA MUSICAL", imageKey: "course-lab" },
    { title: "EQUIPOS DE ÚLTIMA GENERACIÓN", imageKey: "course-gear" },
  ],
  outcomesIntro:
    "El egresado de Sound Tech Perú estará capacitado para desempeñarse en:",
  outcomes: [
    { title: "Estudios de grabación" },
    { title: "Sonido en vivo y espectáculos" },
    { title: "Producción musical y audiovisual" },
    { title: "Broadcast y medios de comunicación" },
    { title: "Diseño sonoro y post-producción" },
  ],
  trendsTitle: "Tendencias de este año",
  trends: [
    { title: "Audio inmersivo (Dolby Atmos)" },
    { title: "Inteligencia Artificial en producción de audio" },
    { title: "Redes de Audio Digital (Dante / AES67)" },
    { title: "Streaming y producción remota" },
    { title: "Realidad virtual y sonido 3D" },
  ],
  isPublished: true,
};

/* ==========================================================================
   Encabezados (hero) de las paginas internas
   ========================================================================== */

export const pageHeroes: Record<string, PageHeroContent> = {
  nosotros: {
    slug: "nosotros",
    heroTitleLead: "SOBRE",
    heroTitleAccent: "NOSOTROS",
    heroSubtitle: "Conoce nuestra trayectoria",
    heroImageKey: "hero-nosotros",
    seoTitle: "Sobre nosotros",
    seoDescription:
      "Conoce la trayectoria de Sound Tech Perú: más de 10 años en la venta de equipos profesionales y en la ingeniería de sonido.",
  },
  servicios: {
    slug: "servicios",
    heroTitleLead: "NUESTROS",
    heroTitleAccent: "SERVICIOS",
    heroSubtitle: "Soluciones profesionales para cada espacio",
    heroImageKey: "hero-servicios",
    seoTitle: "Nuestros servicios",
    seoDescription:
      "Audio profesional, acústica, conferencia y votación, teleconferencia, control integrado, iluminación, videoproyección, CCTV y cableado estructurado.",
  },
  cursos: {
    slug: "cursos",
    heroTitleLead: "NUESTROS",
    heroTitleAccent: "CURSOS",
    heroSubtitle: "Formación profesional en ingeniería de sonido",
    heroImageKey: "hero-cursos",
    seoTitle: "Cursos",
    seoDescription:
      "Programa profesional de Ingeniería de Sonido: 1 año, 4 módulos, certificación por módulo y 100% de práctica en estudio propio.",
  },
  proyectos: {
    slug: "proyectos",
    heroTitleLead: "NUESTROS",
    heroTitleAccent: "PROYECTOS",
    heroSubtitle: "Espacios que suenan y funcionan mejor",
    heroImageKey: "hero-proyectos",
    seoTitle: "Proyectos",
    seoDescription:
      "Proyectos de audio, acústica, control integrado, iluminación, videoproyección, CCTV y cableado estructurado ejecutados por Sound Tech Perú.",
  },
  clientes: {
    slug: "clientes",
    heroTitleLead: "NUESTROS",
    heroTitleAccent: "CLIENTES",
    heroSubtitle: "Empresas que confían en nosotros",
    heroImageKey: "hero-clientes",
    seoTitle: "Clientes",
    seoDescription:
      "Colegios, empresas e instituciones que confían en Sound Tech Perú para sus proyectos de audio e integración tecnológica.",
  },
  galeria: {
    slug: "galeria",
    heroTitleLead: "NUESTRA",
    heroTitleAccent: "GALERÍA",
    heroSubtitle: "Instalaciones, aulas y estudio de grabación",
    heroImageKey: "hero-galeria",
    seoTitle: "Galería",
    seoDescription:
      "Galería de instalaciones, aulas acústicas, laboratorio y estudio de grabación de Sound Tech Perú.",
  },
  contactenos: {
    slug: "contactenos",
    heroTitleLead: "CONTÁCTE",
    heroTitleAccent: "NOS",
    heroSubtitle: "Hablemos de tu próximo proyecto",
    heroImageKey: "hero-contacto",
    seoTitle: "Contáctenos",
    seoDescription:
      "Cuéntanos qué solución necesitas y nuestro equipo se pondrá en contacto contigo. Teléfono +51 961 927 974.",
  },
  cotizar: {
    slug: "cotizar",
    heroTitleLead: "COTIZA TU",
    heroTitleAccent: "PROYECTO",
    heroSubtitle: "Cuéntanos qué necesitas y te enviamos una propuesta",
    heroImageKey: "hero-cotizar",
    seoTitle: "Cotizar proyecto",
    seoDescription:
      "Solicita una cotización para tu proyecto de audio, acústica, iluminación, videoproyección, CCTV o cableado estructurado.",
  },
  "redes-sociales": {
    slug: "redes-sociales",
    heroTitleLead: "NUESTRAS",
    heroTitleAccent: "REDES SOCIALES",
    heroSubtitle: "Prepárate hoy para ser parte del futuro",
    heroImageKey: "hero-redes",
    seoTitle: "Redes sociales",
    seoDescription:
      "Descubre contenido exclusivo, noticias, consejos y mucho más. Únete a la comunidad de Sound Tech Perú.",
  },
  "politica-de-privacidad": {
    slug: "politica-de-privacidad",
    heroTitleLead: "POLÍTICA DE",
    heroTitleAccent: "PRIVACIDAD",
    heroSubtitle: "Tratamiento de tus datos personales",
    heroImageKey: "hero-legal",
    seoTitle: "Política de privacidad",
    seoDescription:
      "Política de privacidad y tratamiento de datos personales de Sound Tech Perú conforme a la Ley N.º 29733.",
  },
};

/* ==========================================================================
   Textos compartidos entre secciones
   ========================================================================== */

export const homeContent = {
  hero: {
    titleLead: "SOLUCIONES PROFESIONALES",
    titleAccent: "DE AUDIO E INTEGRACIÓN TECNOLÓGICA",
    primaryCta: { label: "Nosotros", href: "/nosotros" },
    secondaryCta: { label: "Ver Proyectos", href: "/proyectos" },
  },
  about: {
    eyebrow: "SOBRE NOSOTROS",
    titleLead: "DIVISIÓN DE PROYECTOS",
    titleAccent: "CON MÁS DE 10 AÑOS",
    body: "En la venta de equipos profesionales y dedicados a la ingeniería de sonido. Sound Tech Perú continúa brindando soluciones tecnológicas y abordando la creación en el área de proyectos, para diseñar espacios trabajados basándonos en la ingeniería del audio.",
    cta: { label: "Contáctenos", href: "/contactenos" },
  },
  services: {
    eyebrow: "NUESTROS SERVICIOS",
    titleLead: "NUESTROS",
    titleAccent: "SERVICIOS",
    cta: { label: "Ver más", href: "/servicios" },
  },
  academy: {
    eyebrow: "FORMACIÓN DE",
    titleLead: "INGENIEROS DE",
    titleAccent: "SONIDO",
    body: "Educación técnica profesional con estándares internacionales y enfoque práctico. Contamos con un programa profesional de un año de duración, conformado por 4 módulos de 3 meses cada uno, con certificación en cada módulo pedagógico.",
    cta: { label: "Ver más", href: "/cursos" },
    enrollCard: {
      title: "Matricúlate",
      subtitle: "y aprende con nosotros",
      cta: { label: "Inscríbete ya", href: "/cursos#matricula" },
    },
  },
  clients: {
    eyebrow: "MÁS DESTACADOS",
    titleLead: "NUESTROS",
    titleAccent: "CLIENTES",
    subtitle: "Empresas que confían en nosotros",
  },
  socials: {
    eyebrow: "NUESTRAS",
    titleLead: "REDES",
    titleAccent: "SOCIALES",
    quote: "“PREPÁRATE HOY PARA SER PARTE DEL FUTURO.”",
    body: "Descubre contenido exclusivo, noticias, consejos y mucho más. Únete a nuestra comunidad y no te pierdas ninguna actualización.",
    cta: { label: "Mostrar más", href: "/redes-sociales" },
  },
  faq: {
    eyebrow: "TENEMOS RESPUESTAS",
    titleLead: "PREGUNTAS",
    titleAccent: "FRECUENTES:",
    subtitle: "Todo lo que necesitas saber antes de empezar.",
    cta: { label: "Contáctenos", href: "/contactenos" },
  },
  enrollBanner: {
    eyebrow: "FORMACIÓN DE",
    titleLead: "INGENIEROS DE",
    titleAccent: "SONIDO",
    body: "Educación técnica profesional con estándares internacionales y enfoque práctico: estudia con nosotros y sé parte de un equipo profesional.",
    cardTitle: "Matricúlate",
    cardSubtitle: "y aprende con nosotros",
    cta: { label: "Inscríbete ya", href: "/cursos#matricula" },
  },
} as const;

export const nosotrosContent = {
  projects: {
    eyebrow: "SOBRE NOSOTROS",
    titleLead: "DIVISIÓN",
    titleAccent: "PROYECTOS",
    body: "Con más de 10 años en la venta de equipos profesionales y dedicados a la ingeniería de sonido. Sound Tech Perú continúa brindando soluciones tecnológicas y abordando la creación en el área de proyectos, para diseñar espacios trabajados basándonos en la ingeniería del audio.",
  },
  closingText:
    "Tenemos ahora nuestra nueva División de Proyectos; aseguramos que nuestros clientes, además de tener los mejores precios, ahora cuenten con la asesoría directa de nuestra empresa y de los fabricantes para el desarrollo de cualquier proyecto en las siguientes áreas:",
  closingCta: { label: "Nuestros servicios", href: "/servicios" },
} as const;

export const serviciosPageContent = {
  eyebrow: "CON MÁS DE 10 AÑOS EN",
  titleLead: "DIVISIÓN DE",
  titleAccent: "PROYECTOS",
  /** Encabezado de las nueve fichas de servicio. */
  heroTitleLead: "NUESTROS",
  heroTitleAccent: "SERVICIOS",
  heroSubtitle: "Soluciones profesionales para cada espacio",
  brandName: "Sound Tech Perú",
  intro:
    "Tenemos ahora nuestra nueva División de Proyectos; aseguramos que nuestros clientes, además de tener los mejores precios, ahora cuenten con la asesoría directa de nuestra empresa y de los fabricantes para el desarrollo de cualquier proyecto en las siguientes áreas:",
  cardCta: "Saber más",
} as const;

export const redesPageContent = {
  heading: "REDES SOCIALES",
  eyebrow: "NUESTRAS",
  body: "Descubre contenido exclusivo, noticias, consejos y mucho más. Únete a nuestra comunidad y no te pierdas ninguna actualización.",
  quote: "“PREPÁRATE HOY PARA SER PARTE DEL FUTURO.”",
  followLabel: "Síguenos en",
} as const;

export const contactPageContent = {
  socialsHeading: "REDES SOCIALES",
  socialsEyebrow: "NUESTRAS",
  socialsBody:
    "Descubre contenido exclusivo, noticias, consejos y mucho más. Únete a nuestra comunidad y no te pierdas ninguna actualización.",
  socialsQuote: "“PREPÁRATE HOY PARA SER PARTE DEL FUTURO.”",
  socialsCta: "Descubre nuestras redes sociales",
  formHeadingLead: "FORMULARIO",
  formHeadingAccent: "DE CONTÁCTENOS",
  formSubtitle:
    "Cuéntanos qué solución necesitas y nuestro equipo se pondrá en contacto contigo.",
  formNote:
    "Nuestro equipo se comunicará contigo para brindarte mayor información.",
} as const;
