import type { ServiceContent } from "./types";

/**
 * Las 9 fichas de servicio transcritas de las capturas de referencia.
 *
 * Cada ficha declara sus bloques opcionales:
 *  - applications + applicationHighlight  -> bloque "¿Dónde se aplica?"
 *  - scopeGroups                          -> galeria + tipos de proyecto
 * Los servicios sin esos bloques siguen la plantilla base.
 */
export const services: ServiceContent[] = [
  /* ---------------------------------------------------------------------- 1 */
  {
    slug: "sistema-de-audio-profesional-y-comercial",
    title: "Sistema de audio profesional y comercial",
    titleLead: "SISTEMA DE AUDIO",
    titleAccent: "PROFESIONAL Y COMERCIAL",
    order: 1,
    isFeatured: true,
    areaLabel: "AUDIO",
    areaDescription: "Sistemas de Audio Profesional y Comercial",
    summary:
      "Soluciones de audio para proyectos de pequeña, mediana y gran escala, con cobertura uniforme y experiencia sonora de calidad.",
    paragraphs: [
      {
        text: "Soluciones de audio para proyectos de pequeña, mediana y gran escala. Desde una pequeña sala de reuniones hasta un centro comercial, tenemos ideas en equipos para poder realizar desde pequeños proyectos hasta grandes sistemas de distribución de audio digital.",
      },
      {
        text: "Los sistemas de audio profesional y comercial permiten distribuir sonido de manera eficiente en diferentes tipos de ambientes, buscando una cobertura adecuada y una experiencia sonora uniforme.",
      },
      {
        text: "Nuestras soluciones pueden aplicarse en: Salas de reuniones · Oficinas · Locales comerciales · Restaurantes · Hoteles · Centros comerciales · Auditorios · Espacios corporativos.",
        highlight: true,
      },
    ],
    imageKeys: ["audio-1", "audio-2"],
    solutionsTitle: "¿QUÉ PODEMOS ENCONTRAR EN ESTE TIPO DE SISTEMAS?",
    solutions: [
      { number: "01", title: "Elementos de altavoces" },
      { number: "02", title: "Amplificación y control" },
      { number: "03", title: "Distribución de audio" },
      { number: "04", title: "Audio ambiental" },
    ],
    solutionCard: {
      title: "Soluciones para cada espacio",
      accentWord: "cada espacio",
      description:
        "Tecnología de audio que transforma cada espacio en una experiencia sonora.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    scopeTitle: "DE PEQUEÑOS ESPACIOS A GRANDES PROYECTOS",
    scopeGroups: [
      {
        size: "PEQUENO",
        title: "Pequeños proyectos",
        description: "Salas de reuniones, oficinas y espacios corporativos.",
      },
      {
        size: "MEDIANO",
        title: "Proyectos comerciales",
        description: "Tiendas, restaurantes, hoteles y establecimientos.",
      },
      {
        size: "GRANDE",
        title: "Grandes instalaciones",
        description:
          "Centros comerciales, auditorios y sistemas de distribución de audio.",
      },
    ],
    ctaTitle: "¿TIENES UN PROYECTO DE AUDIO?",
    ctaSubtitle:
      "Cuéntanos sobre tu proyecto y las características del espacio. Podemos ayudarte a encontrar una solución adaptada a tus necesidades.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "audio profesional",
      "audio comercial",
      "distribución de audio",
      "audio ambiental",
      "altavoces",
    ],
  },

  /* ---------------------------------------------------------------------- 2 */
  {
    slug: "acondicionamiento-y-aislamiento-acustico",
    title: "Acondicionamiento y aislamiento acústico",
    titleLead: "ACONDICIONAMIENTO Y",
    titleAccent: "AISLAMIENTO ACÚSTICO",
    order: 2,
    isFeatured: true,
    areaLabel: "ACÚSTICA",
    areaDescription: "Acondicionamiento y Aislamiento Acústico",
    summary:
      "Medición, diseño y solución acústica de recintos para mejorar el confort y el comportamiento del sonido.",
    paragraphs: [
      {
        text: "Atendemos la medición, el diseño y la solución de recintos ya construidos. Contamos con la experiencia de más de 10 años y los niveles de aislación del sonido pueden darse a los niveles de inteligibilidad necesarios para cada caso.",
      },
      {
        text: "Analizamos las características acústicas de cada recinto para identificar problemas de reverberación, reflexiones y transmisión de ruido, planteando soluciones que permitan mejorar el confort y el comportamiento del sonido en el espacio.",
      },
      {
        text: "Esto está alineado con lo que normalmente comprende el estudio y tratamiento acústico: medición, control de reverberación, aislamiento, reflexión y acondicionamiento.",
      },
    ],
    imageKeys: ["acustica-1", "acustica-2"],
    solutionsTitle: "SOLUCIONES ACÚSTICAS",
    solutions: [
      { number: "01", title: "Acondicionamiento acústico" },
      { number: "02", title: "Aislamiento acústico" },
      { number: "03", title: "Análisis y medición" },
      { number: "04", title: "Diseño acústico" },
    ],
    solutionCard: {
      title: "Acondicionamos tu espacio",
      accentWord: "tu espacio",
      description: "Soluciones acústicas adaptadas a cada proyecto.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    applicationsTitle: "¿DÓNDE SE APLICA?",
    applications: [
      {
        title: "AUDITORIOS Y TEATROS",
        description:
          "Control de reverberación y reflexiones para mejorar inteligibilidad y presencia sonora.",
        side: "IZQUIERDA",
      },
      {
        title: "SALAS DE ENSAYO",
        description:
          "Tratamiento para favorecer la claridad de la voz y reducir reflexiones indeseadas.",
        side: "IZQUIERDA",
      },
      {
        title: "CINES Y ESPACIOS DE ENTRETENIMIENTO",
        description:
          "Tratamiento orientado a optimizar las características y necesidades del recinto.",
        side: "IZQUIERDA",
      },
      {
        title: "OFICINAS",
        description:
          "Control del comportamiento sonoro para generar ambientes más confortables.",
        side: "IZQUIERDA",
      },
      {
        title: "ESTUDIOS DE GRABACIÓN",
        description:
          "Control acústico para conseguir un entorno adecuado para grabación, mezcla y monitoreo.",
        side: "DERECHA",
      },
      {
        title: "OFICINAS Y ESPACIOS CORPORATIVOS",
        description:
          "Soluciones para mejorar el confort acústico y reducir el ruido dentro de los ambientes.",
        side: "DERECHA",
      },
    ],
    applicationHighlight: {
      title: "DISEÑAMOS EL COMPORTAMIENTO DEL SONIDO",
      bullets: ["Aísla", "Direcciona", "Soluciona acústica"],
    },
    ctaTitle: "¿TU ESPACIO NECESITA UNA SOLUCIÓN ACÚSTICA?",
    ctaSubtitle:
      "Evaluamos el recinto para optimizar su comportamiento acústico según cada proyecto.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "acondicionamiento acústico",
      "aislamiento acústico",
      "reverberación",
      "tratamiento acústico",
      "medición acústica",
    ],
  },

  /* ---------------------------------------------------------------------- 3 */
  {
    slug: "sistemas-de-conferencia-y-votacion",
    title: "Sistemas de conferencia y votación",
    titleLead: "SISTEMAS DE",
    titleAccent: "CONFERENCIA Y VOTACIÓN",
    order: 3,
    isFeatured: true,
    areaLabel: "CONFERENCIA Y VOTACIÓN",
    areaDescription: "Sistemas de Conferencia y Votación",
    summary:
      "Reuniones ordenadas, grabadas y con identificación y votación para congresos, directorios y salas de jurados.",
    paragraphs: [
      {
        text: "Para el desarrollo de reuniones ordenadas, grabadas y con opción a identificación y votación, tales como congresos, salas de directorio o salas de jurados, tenemos las soluciones para poder cumplir con cualquiera de sus requerimientos.",
      },
      {
        text: "Nuestras soluciones permiten gestionar la participación de los asistentes, facilitar el control de las intervenciones y registrar cada sesión, adaptándose a las características y necesidades de cada espacio.",
      },
    ],
    imageKeys: ["conferencia-1"],
    solutionsTitle: "SISTEMAS Y SOLUCIONES",
    solutions: [
      { number: "01", title: "Sistemas de conferencia" },
      { number: "02", title: "Identificación y control" },
      { number: "03", title: "Grabación de reuniones" },
      { number: "04", title: "Sistemas de votación" },
    ],
    solutionCard: {
      title: "Tecnología adaptada a cada espacio.",
      accentWord: "cada espacio",
      description: "Comunicación y control en cada reunión.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    ctaTitle: "¿NECESITA UNA SOLUCIÓN PARA SU SALA?",
    ctaSubtitle: "Encuentre la solución ideal para su sistema de conferencia.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "sistemas de conferencia",
      "sistema de votación",
      "sala de directorio",
      "congresos",
      "grabación de reuniones",
    ],
  },

  /* ---------------------------------------------------------------------- 4 */
  {
    slug: "sistemas-de-teleconferencia",
    title: "Sistemas de teleconferencia",
    titleLead: "SISTEMAS DE",
    titleAccent: "TELECONFERENCIAS",
    order: 4,
    isFeatured: true,
    areaLabel: "TELECOMUNICACIÓN",
    areaDescription: "Comunicación a través de medios audiovisuales",
    summary:
      "Videoconferencia, audio, cámaras y conectividad integrados para una comunicación sin límites.",
    paragraphs: [
      {
        text: "Para el desarrollo de reuniones ordenadas, grabadas y con opción a identificación y votación, tales como congresos, salas de directorio o salas de jurados, tenemos las soluciones para poder cumplir con cualquiera de sus requerimientos.",
      },
      {
        text: "Nuestras soluciones permiten gestionar la participación de los asistentes, facilitar el control de las intervenciones y registrar cada sesión, adaptándose a las características y necesidades de cada espacio.",
      },
    ],
    imageKeys: ["teleconferencia-1"],
    solutionsEyebrow: "COMUNICACIÓN SIN LÍMITES",
    solutionsTitle: "SOLUCIONES DE TELECONFERENCIA",
    solutionsSubtitle: "Comunicación sin límites.",
    solutions: [
      { number: "01", title: "Videoconferencia" },
      { number: "02", title: "Audio y micrófonos" },
      { number: "03", title: "Cámaras y visualización" },
      { number: "04", title: "Integración y conectividad" },
    ],
    solutionCard: {
      title: "Conectividad audiovisual para cada espacio",
      accentWord: "cada espacio",
      description: "Tecnología para una comunicación sin límites.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    ctaTitle: "¿LISTO PARA CONECTAR TU ESPACIO?",
    ctaSubtitle:
      "Cuéntanos sobre tu proyecto y encontraremos la solución ideal.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "teleconferencia",
      "videoconferencia",
      "salas de reuniones",
      "cámaras PTZ",
      "conectividad",
    ],
  },

  /* ---------------------------------------------------------------------- 5 */
  {
    slug: "sistemas-de-control-integrado",
    title: "Sistemas de control integrado para salas automatizadas",
    titleLead: "SISTEMAS DE CONTROL INTEGRADO",
    titleAccent: "PARA SALAS AUTOMATIZADAS",
    order: 5,
    isFeatured: true,
    areaLabel: "CONTROL INTEGRADO",
    areaDescription: "Sistemas de Control Integrado para Salas Automatizadas",
    summary:
      "Un solo control para iluminación, cortinas, video, audio y pantallas de todo un espacio.",
    paragraphs: [
      {
        text: "La integración de salas fusiona varios sistemas que se pueden controlar en un solo comando y hacer un uso más fácil de las tecnologías instaladas.",
      },
      {
        text: "Nuestros sistemas permiten centralizar y controlar diferentes sistemas audiovisuales y tecnológicos de todo un área en un solo punto, facilitando el manejo de los equipos y mejorando la experiencia de los usuarios.",
      },
      {
        text: "La automatización puede adaptarse a diferentes tipos de espacios, permitiendo controlar de manera sencilla la iluminación, cortinas, video, audio, pantallas y otros dispositivos integrados.",
      },
      {
        text: "Además, configuramos cada sistema de acuerdo con las necesidades del proyecto, brindando una operación ordenada y centralizada, con el propósito de que el usuario final pueda operar múltiples equipos por separado.",
      },
    ],
    imageKeys: ["control-1", "control-2"],
    solutionsEyebrow: "SOLUCIONES DE AUTOMATIZACIÓN",
    solutionsTitle: "SOLUCIONES DE AUTOMATIZACIÓN",
    solutionsSubtitle: "Tecnología integrada en un solo control",
    solutions: [
      { number: "01", title: "Control centralizado" },
      { number: "02", title: "Automatización de salas" },
      { number: "03", title: "Audio y video" },
      { number: "04", title: "Iluminación y dispositivos" },
    ],
    solutionCard: {
      title: "Un solo control para cada espacio",
      accentWord: "cada espacio",
      description: "Tecnología integrada para una gestión más simple e intuitiva.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    ctaTitle: "¿QUIERES SIMPLIFICAR EL CONTROL DE TU ESPACIO?",
    ctaSubtitle:
      "Conversamos sobre tu proyecto y encontramos la mejor forma de integrar tus sistemas en una sola solución.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "control integrado",
      "sala automatizada",
      "automatización",
      "control centralizado",
      "AV control",
    ],
  },

  /* ---------------------------------------------------------------------- 6 */
  {
    slug: "sistemas-de-iluminacion",
    title: "Sistemas de iluminación comercial, arquitectónica y de escenarios",
    titleLead: "SISTEMAS DE",
    titleAccent: "ILUMINACIÓN COMERCIAL, ARQUITECTÓNICA Y DE ESCENARIOS",
    order: 6,
    isFeatured: true,
    areaLabel: "ILUMINACIÓN",
    areaDescription:
      "Sistemas de Iluminación Comercial, Arquitectónica y de Escenarios",
    summary:
      "Iluminación y control para crear ambientes, destacar arquitectura y generar experiencias visuales.",
    paragraphs: [
      {
        text: "En oficinas, edificios, monumentos, teatros o escenarios múltiples, podemos ofrecer todos los equipos y controladores necesarios para estas aplicaciones.",
      },
      {
        text: "Desarrollamos soluciones de iluminación adaptadas a las características y necesidades de cada proyecto, combinando equipos, sistemas de control y tecnologías que permiten crear ambientes funcionales, destacar elementos arquitectónicos y generar diferentes experiencias visuales.",
      },
      {
        text: "Cada solución puede configurarse de acuerdo con el espacio y su aplicación, permitiendo gestionar intensidad, distribución, escenas y programas de diferentes dispositivos, tanto en instalaciones permanentes como en montajes temporales.",
      },
      {
        text: "Desde espacios comerciales y corporativos hasta proyectos arquitectónicos, teatros y escenarios, buscamos integrar iluminación y control de manera eficiente, facilitando su operación y adaptación a diferentes situaciones.",
      },
    ],
    imageKeys: ["iluminacion-1"],
    solutionsEyebrow: "SOLUCIONES DE ILUMINACIÓN",
    solutionsTitle: "SOLUCIONES DE ILUMINACIÓN",
    solutionsSubtitle: "Tecnología y control para transformar cada espacio.",
    solutions: [
      { number: "01", title: "Iluminación comercial" },
      { number: "02", title: "Iluminación arquitectónica" },
      { number: "03", title: "Iluminación para escenarios" },
      { number: "04", title: "Control de iluminación" },
    ],
    solutionCard: {
      title: "Iluminación que transforma cada espacio",
      accentWord: "cada espacio",
      description:
        "Tecnología y control para crear diferentes ambientes y experiencias.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    ctaTitle: "¿ILUMINAMOS TU PRÓXIMO PROYECTO?",
    ctaSubtitle:
      "Cuéntanos las características de tu espacio y desarrollamos una solución de iluminación adaptada a tus necesidades.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "iluminación comercial",
      "iluminación arquitectónica",
      "iluminación de escenarios",
      "control de iluminación",
      "DMX",
    ],
  },

  /* ---------------------------------------------------------------------- 7 */
  {
    slug: "sistemas-de-videoproyeccion-y-pantallas",
    title: "Sistemas de videoproyección y pantallas",
    titleLead: "SISTEMAS DE",
    titleAccent: "VIDEOPROYECCIÓN Y PANTALLAS",
    order: 7,
    isFeatured: true,
    areaLabel: "VIDEO",
    areaDescription: "Sistemas de Videoproyección y Pantallas",
    summary:
      "Videoproyección, pantallas profesionales, video walls y digital signage para cada tipo de contenido.",
    paragraphs: [
      {
        text: "Proyección de presentaciones en salas pequeñas, video en otra dimensión, alta fidelidad, pantallas modulares, video walls, pantallas LED; todo en relación a la comunicación gráfica y corporativa, complementadas para una visualización clara del mensaje que se quiere mostrar.",
      },
      {
        text: "Desarrollamos e implementamos soluciones de visualización adaptadas a cada espacio, integrando distintas alternativas de proyección, pantallas profesionales y sistemas de video para lograr imágenes claras, definidas y alineadas al objetivo del proyecto.",
      },
      {
        text: "Cada proyecto se configura considerando aspectos como formato, resolución, luminosidad, distancia de visualización y tipo de contenido, garantizando una experiencia visual eficiente para aplicaciones corporativas, comerciales, publicitarias y de escenario.",
      },
    ],
    imageKeys: ["video-1", "video-2"],
    solutionsEyebrow:
      "Tecnología diseñada para que cada mensaje tenga el impacto que necesita.",
    solutionsTitle: "SOLUCIONES DE VISUALIZACIÓN",
    solutionsSubtitle:
      "Tecnología diseñada para que cada mensaje tenga el impacto que necesita.",
    solutions: [
      { number: "01", title: "Videoproyección" },
      { number: "02", title: "Pantallas profesionales" },
      { number: "03", title: "Video Walls" },
      { number: "04", title: "Digital Signage" },
    ],
    solutionCard: {
      title: "Visualización de alto impacto para cada espacio",
      accentWord: "cada espacio",
      description:
        "Tecnología que transforma cada mensaje en una experiencia visual.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    applicationsTitle: "¿DÓNDE SE PUEDE IMPLEMENTAR?",
    applications: [
      {
        title: "SALAS CORPORATIVAS",
        description:
          "Para reuniones, directorios, capacitaciones y presentaciones con sistemas de videoproyección.",
        side: "IZQUIERDA",
      },
      {
        title: "CENTROS COMERCIALES Y RETAIL",
        description:
          "Para publicidad, promociones, pantallas digitales, escaparates y comunicación visual dentro del centro.",
        side: "IZQUIERDA",
      },
      {
        title: "EVENTOS Y ESCENARIOS",
        description:
          "Para conciertos, activaciones, conexiones y eventos masivos mediante proyectores de alta potencia, pantallas modulares y video walls.",
        side: "IZQUIERDA",
      },
      {
        title: "AUDITORIOS Y CENTROS DE CONVENCIONES",
        description:
          "Para presentaciones, conferencias, clases y eventos donde se requieren pantallas de gran formato.",
        side: "DERECHA",
      },
    ],
    applicationHighlight: {
      title: "OPTIMIZANDO CADA EXPERIENCIA VISUAL",
      bullets: [
        "Brillo y luminosidad del equipo",
        "Claridad de la solución",
        "Implementación especializada",
      ],
    },
    ctaTitle: "¿QUIERES LLEVAR TU CONTENIDO A UNA PANTALLA MÁS GRANDE?",
    ctaSubtitle:
      "Cuéntanos qué necesitas comunicar y te asesoramos sobre la solución de visualización adecuada a tu espacio y proyecto.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "videoproyección",
      "pantallas LED",
      "video wall",
      "digital signage",
      "proyectores",
    ],
  },

  /* ---------------------------------------------------------------------- 8 */
  {
    slug: "circuito-cerrado-de-television-cctv",
    title: "Sistema de circuito cerrado de televisión (CCTV)",
    titleLead: "SISTEMA DE",
    titleAccent: "CIRCUITO CERRADO DE TELEVISIÓN (CCTV)",
    order: 8,
    isFeatured: true,
    areaLabel: "SEGURIDAD",
    areaDescription: "Sistemas de Circuito Cerrado de Televisión (CCTV)",
    summary:
      "Videovigilancia con cobertura, ubicación estratégica de cámaras y monitoreo adaptado a cada entorno.",
    paragraphs: [
      {
        text: "Sistemas de circuito cerrado para diferentes tipos de aplicaciones, tanto de seguridad como de registro de reuniones, salas de focus groups o para toda la infraestructura y el control de producción, con el análisis necesario para evitar el sobrecoste por malas ubicaciones de las cámaras.",
      },
      {
        text: "Ofrecemos soluciones de videovigilancia adaptadas a las características y necesidades de cada espacio, considerando cobertura, ubicación estratégica de cámaras, condiciones ambientales y requerimientos específicos de monitoreo. Una correcta planificación permite optimizar los recursos instalados, reducir puntos ciegos y obtener un sistema eficiente, escalable y preparado para diferentes escenarios de operación.",
      },
    ],
    imageKeys: ["cctv-1"],
    solutionsEyebrow:
      "Cobertura, control y tecnología integrados en una solución diseñada para cada entorno.",
    solutionsTitle: "¿QUÉ SOLUCIONES DE VIDEOVIGILANCIA OFRECEMOS?",
    solutionsSubtitle:
      "Cobertura, control y tecnología integrados en una solución diseñada para cada entorno.",
    solutions: [
      { number: "01", title: "Videovigilancia y seguridad" },
      { number: "02", title: "Registro y monitoreo de espacios" },
      { number: "03", title: "Cámaras para aplicaciones específicas" },
      { number: "04", title: "Diseño y selección estratégica" },
    ],
    solutionCard: {
      title: "Tecnología que amplía tu visión y protege cada espacio.",
      accentWord: "cada espacio",
      description:
        "Monitoreo inteligente diseñado para observar lo que realmente importa.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    scopeTitle: "DE LA VIGILANCIA PUNTUAL AL CONTROL INTEGRAL",
    scopeGroups: [
      {
        size: "PEQUENO",
        title: "Pequeños espacios",
        description: "Oficinas, salas de reuniones y ambientes de acceso controlado.",
      },
      {
        size: "MEDIANO",
        title: "Medianos espacios",
        description:
          "Tiendas, restaurantes, hoteles y establecimientos con monitoreo continuo.",
      },
      {
        size: "GRANDE",
        title: "Grandes instalaciones",
        description:
          "Colegios, plantas industriales y espacios que requieren amplia cobertura de videovigilancia.",
      },
    ],
    ctaTitle: "¿NECESITAS IMPLEMENTAR O MEJORAR TU SISTEMA DE VIDEOVIGILANCIA?",
    ctaSubtitle:
      "Asesoramos tu espacio para desarrollar una solución CCTV adaptada a tus necesidades.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "CCTV",
      "videovigilancia",
      "cámaras de seguridad",
      "circuito cerrado",
      "monitoreo",
    ],
  },

  /* ---------------------------------------------------------------------- 9 */
  {
    slug: "cableado-estructurado",
    title: "Cableado estructurado",
    titleLead: "CABLEADO",
    titleAccent: "ESTRUCTURADO",
    order: 9,
    isFeatured: true,
    areaLabel: "CABLEADO ESTRUCTURADO",
    areaDescription: "Cableado Estructurado",
    summary:
      "Infraestructura de cableado organizada, escalable y preparada para integrar todos los sistemas.",
    paragraphs: [
      {
        text: "Cableado de todos los sistemas necesarios en las aplicaciones presentes, siguiendo los estándares internacionales para una correcta y segura instalación de estos.",
      },
      {
        text: "Diseñamos e implementamos infraestructuras de cableado organizadas, escalables y preparadas para integrar diferentes sistemas de comunicación, datos, video y control en un solo entorno. Una correcta planificación permite optimizar la distribución de los servicios, mejorar el rendimiento y garantizar una instalación ordenada con capacidad de adaptarse a futuras ampliaciones.",
      },
    ],
    imageKeys: ["cableado-1", "cableado-2"],
    solutionsEyebrow:
      "Una infraestructura sólida para conectar, integrar y hacer crecer cada sistema.",
    solutionsTitle: "¿QUÉ SOLUCIONES DE CABLEADO IMPLEMENTAMOS?",
    solutionsSubtitle:
      "Una infraestructura sólida para conectar, integrar y hacer crecer cada sistema.",
    solutions: [
      { number: "01", title: "Canalizado de datos y telecomunicaciones" },
      { number: "02", title: "Cableado para voz, datos y video" },
      { number: "03", title: "Integración de sistemas" },
      { number: "04", title: "Organización y etiquetado" },
    ],
    solutionCard: {
      title: "La conexión que integra toda tu tecnología.",
      accentWord: "toda tu tecnología",
      description:
        "Infraestructura organizada para crecer sin límites, segura y preparada.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    ctaTitle: "¿NECESITAS UNA SOLUCIÓN DE CABLEADO?",
    ctaSubtitle:
      "Diseñamos una solución organizada y adaptada a las necesidades de cada instalación.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "cableado estructurado",
      "voz y datos",
      "fibra óptica",
      "rack",
      "certificación de cableado",
    ],
  },
];

export const servicesBySlug = new Map(services.map((s) => [s.slug, s]));
