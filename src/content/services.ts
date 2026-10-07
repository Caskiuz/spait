import type { ServiceContent } from "./types";

/**
 * Las 9 fichas de servicio con los textos definitivos que envió el cliente en
 * `contenido text/*.pdf`.
 *
 * Los PDFs mandan sobre las capturas del diseño donde hay discrepancia. Se
 * corrigieron además las erratas del original: «parausos», «incluídos»,
 * «mas fácil», «aseguramos» tras punto y el espacio antes de coma.
 *
 * Cableado Estructurado no tiene PDF propio: el primer párrafo es del cliente
 * y el resto queda pendiente de confirmar.
 *
 * `areaOrder` controla el orden de la rejilla de áreas de /nosotros, que en el
 * diseño es distinto al de la lista de /servicios.
 */
export const services: ServiceContent[] = [
  /* ---------------------------------------------------------------------- 1 */
  {
    slug: "sistema-de-audio-profesional-y-comercial",
    title: "Sistema de audio profesional y comercial",
    titleLead: "SISTEMA DE AUDIO",
    titleAccent: "PROFESIONAL Y COMERCIAL",
    order: 1,
    areaOrder: 1,
    isFeatured: true,
    areaLabel: "AUDIO",
    areaDescription: "Sistemas de Audio Profesional y Comercial",
    summary:
      "Soluciones de audio para proyectos de pequeña, mediana y gran escala, con cobertura uniforme y experiencia sonora de calidad.",
    paragraphs: [
      {
        text: "Desde una pequeña sala de reuniones hasta un centro comercial, contamos con equipos y soluciones para desarrollar proyectos de diferentes dimensiones, desde pequeñas instalaciones hasta grandes sistemas de distribución de audio digital.",
      },
      {
        text: "Los sistemas de audio profesional y comercial permiten distribuir sonido de manera eficiente en diferentes tipos de ambientes, buscando una cobertura adecuada y una experiencia sonora uniforme.",
      },
      {
        text: "Nuestras soluciones pueden aplicarse en: Salas de reuniones · Oficinas · Locales comerciales · Restaurantes · Hoteles · Centros comerciales · Auditorios · Espacios corporativos",
        highlight: true,
      },
    ],
    imageKeys: ["servicio-audio"],
    solutionsTitle: "¿QUÉ PODEMOS ENCONTRAR EN ESTE TIPO DE SISTEMAS?",
    solutions: [
      {
        number: "01",
        title: "Sistemas de altavoces",
        description:
          "Soluciones de reproducción de audio adaptadas a diferentes espacios y necesidades.",
      },
      {
        number: "02",
        title: "Amplificación y control",
        description: "Equipamiento para gestionar y distribuir la señal de audio.",
      },
      {
        number: "03",
        title: "Distribución de audio",
        description:
          "Sistemas capaces de distribuir contenido sonoro en diferentes ambientes.",
      },
      {
        number: "04",
        title: "Audio multizona",
        description:
          "Permite gestionar diferentes áreas de manera independiente según las necesidades del proyecto.",
      },
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
      "audio multizona",
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
    areaOrder: 4,
    isFeatured: true,
    areaLabel: "ACÚSTICA",
    areaDescription: "Acondicionamiento y Aislamiento Acústico",
    summary:
      "Análisis, medición y solución acústica de recintos para alcanzar los niveles de inteligibilidad que cada proyecto necesita.",
    paragraphs: [
      {
        text: "Tanto en el análisis y modelado previo a una construcción como en la medición, análisis y solución de recintos ya construidos, tenemos la capacidad de poder acondicionarlos para que la difusión del audio pueda darse con los niveles de inteligibilidad necesarios para cada caso.",
      },
      {
        text: "Analizamos las características acústicas de cada recinto para identificar problemas de reverberación, reflexiones y transmisión de ruido, planteando soluciones que permitan mejorar la claridad y el comportamiento del sonido en el espacio.",
      },
      {
        text: "Esto está alineado con lo que normalmente comprende el análisis y tratamiento acústico: medición, control de reverberación, absorción, difusión y aislamiento.",
      },
    ],
    imageKeys: ["servicio-acustica"],
    solutionsEyebrow: "Soluciones acústicas para cada espacio",
    solutionsTitle: "SOLUCIONES ACÚSTICAS",
    solutionsSubtitle: "Soluciones acústicas para cada espacio.",
    solutions: [
      {
        number: "01",
        title: "Acondicionamiento acústico",
        description:
          "Tratamiento de superficies y espacios para controlar reflexiones y reverberación, buscando una reproducción sonora más clara y equilibrada.",
      },
      {
        number: "02",
        title: "Aislamiento acústico",
        description:
          "Soluciones orientadas a reducir la transmisión del sonido entre ambientes y controlar la entrada o salida de ruido.",
      },
      {
        number: "03",
        title: "Análisis y medición",
        description:
          "Evaluación de las condiciones acústicas del recinto para identificar problemas y determinar las soluciones necesarias.",
      },
      {
        number: "04",
        title: "Diseño acústico",
        description:
          "Planificación de soluciones acústicas desde la etapa de proyecto hasta la adecuación de espacios ya construidos.",
      },
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
          "Control de reverberación y reflexiones para mejorar la inteligibilidad y experiencia sonora.",
        side: "IZQUIERDA",
      },
      {
        title: "SALAS DE REUNIONES",
        description:
          "Tratamiento para favorecer la claridad de la voz y reducir reflexiones no deseadas.",
        side: "IZQUIERDA",
      },
      {
        title: "ESTUDIOS DE GRABACIÓN",
        description:
          "Control acústico para conseguir un entorno adecuado para grabación, mezcla y monitoreo.",
        side: "IZQUIERDA",
      },
      {
        title: "OFICINAS Y ESPACIOS CORPORATIVOS",
        description:
          "Soluciones para mejorar el confort acústico y reducir el ruido dentro de los ambientes.",
        side: "DERECHA",
      },
      {
        title: "CINES Y ESPACIOS DE ENTRETENIMIENTO",
        description:
          "Tratamiento acústico adaptado a las características y necesidades del recinto.",
        side: "DERECHA",
      },
      {
        title: "ESPACIOS COMERCIALES",
        description:
          "Control del comportamiento sonoro para generar ambientes más confortables.",
        side: "DERECHA",
      },
    ],
    applicationHighlight: {
      title: "DISEÑAMOS EL COMPORTAMIENTO DEL SONIDO",
      bullets: ["Análisis", "Diagnóstico", "Solución acústica"],
    },
    ctaTitle: "¿TU ESPACIO NECESITA UNA SOLUCIÓN ACÚSTICA?",
    ctaSubtitle:
      "Evaluamos las características del recinto para encontrar alternativas que permitan mejorar su comportamiento acústico y alcanzar las condiciones necesarias para cada proyecto.",
    ctaButtonLabel: "Solicitar asesoría",
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
    areaOrder: 7,
    isFeatured: true,
    areaLabel: "CONFERENCIA Y VOTACIÓN",
    areaDescription: "Sistemas de Conferencia y Votación",
    summary:
      "Reuniones ordenadas, grabadas y con identificación y votación para congresos, salas de directorio o salas de juzgados.",
    paragraphs: [
      {
        text: "Para el desarrollo de reuniones ordenadas, grabadas y con opción a identificación y votación, tales como congresos, salas de directorio o salas de juzgados, tenemos las soluciones para poder cumplir con cualquiera de sus requerimientos.",
      },
      {
        text: "Nuestras soluciones permiten gestionar la participación de los asistentes, facilitar el control de las intervenciones y registrar cada sesión, adaptándose a las características y necesidades de cada espacio.",
      },
    ],
    imageKeys: ["servicio-conferencia"],
    solutionsTitle: "SISTEMAS Y SOLUCIONES",
    solutions: [
      {
        number: "01",
        title: "Sistemas de conferencia",
        description:
          "Equipos para gestionar reuniones y facilitar la comunicación entre los participantes.",
      },
      {
        number: "02",
        title: "Identificación y control",
        description:
          "Soluciones para identificar participantes y gestionar sus intervenciones durante la sesión.",
      },
      {
        number: "03",
        title: "Grabación de reuniones",
        description:
          "Sistemas para registrar y conservar las sesiones de manera organizada y eficiente.",
      },
      {
        number: "04",
        title: "Sistemas de votación",
        description:
          "Herramientas para realizar votaciones electrónicas y obtener resultados de forma rápida y ordenada.",
      },
    ],
    solutionCard: {
      title: "Tecnología adaptada a cada espacio",
      accentWord: "cada espacio",
      description: "Comunicación y control en cada reunión.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    ctaTitle: "¿NECESITA UNA SOLUCIÓN PARA SU SALA?",
    ctaSubtitle:
      "Cuéntenos sobre su proyecto y le ayudaremos a encontrar el sistema de conferencia y votación más adecuado para sus necesidades.",
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
    titleAccent: "TELECONFERENCIA",
    order: 4,
    areaOrder: 9,
    isFeatured: true,
    areaLabel: "TELECONFERENCIA",
    areaDescription: "Comunicación a través de medios audiovisuales",
    summary:
      "Videoconferencia, audio, cámaras y conectividad integrados para reuniones remotas en salas fijas y móviles.",
    paragraphs: [
      {
        text: "Comunicación a través de medios audiovisuales para reuniones remotas tanto en salas fijas como móviles.",
      },
      {
        text: "Nuestras soluciones permiten conectar equipos y participantes de manera eficiente, facilitando reuniones virtuales, presentaciones y comunicaciones a distancia con una experiencia audiovisual profesional.",
      },
    ],
    imageKeys: ["servicio-teleconferencia"],
    solutionsTitle: "SOLUCIONES DE TELECONFERENCIA",
    solutionsSubtitle: "Comunicación sin límites.",
    solutions: [
      {
        number: "01",
        title: "Videoconferencia",
        description:
          "Soluciones audiovisuales para realizar reuniones remotas con comunicación en tiempo real.",
      },
      {
        number: "02",
        title: "Audio y micrófonos",
        description:
          "Sistemas para garantizar una comunicación clara y una correcta captación de las voces.",
      },
      {
        number: "03",
        title: "Cámaras y visualización",
        description:
          "Equipos para una adecuada captura de imagen y visualización de los participantes y contenidos.",
      },
      {
        number: "04",
        title: "Integración y conectividad",
        description:
          "Integración de los diferentes equipos para crear sistemas funcionales y adaptados a cada espacio.",
      },
    ],
    solutionCard: {
      title: "Conectividad audiovisual para cada espacio",
      accentWord: "cada espacio",
      description: "Tecnología para una comunicación sin límites.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    ctaTitle: "¿LISTO PARA CONECTAR TU ESPACIO?",
    ctaSubtitle: "Cuéntenos sobre su proyecto y encontremos la solución ideal.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "teleconferencia",
      "videoconferencia",
      "salas de reuniones",
      "cámaras",
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
    areaOrder: 2,
    isFeatured: true,
    areaLabel: "CONTROL INTEGRADO",
    areaDescription: "Sistemas de Control Integrado para Salas Automatizadas",
    summary:
      "Todo el audiovisual y la tecnología de un espacio centralizados en un solo control.",
    paragraphs: [
      {
        text: "La integración de salas en caso se tengan varios sistemas que quieran centralizarse en un solo comando y hacer un uso más fácil de las tecnologías instaladas.",
      },
      {
        text: "Nuestras soluciones permiten centralizar y controlar diferentes sistemas audiovisuales y tecnológicos desde una única interfaz, facilitando el manejo de los equipos y mejorando la experiencia de los usuarios.",
      },
      {
        text: "La automatización puede adaptarse a diferentes tipos de espacios, permitiendo controlar de manera sencilla funciones como audio, video, iluminación, pantallas y otros dispositivos integrados.",
      },
      {
        text: "Además, configuramos cada sistema de acuerdo con las necesidades del proyecto, buscando que la interacción con la tecnología sea más intuitiva, rápida y eficiente, reduciendo la complejidad de operar múltiples equipos por separado.",
      },
    ],
    imageKeys: ["servicio-control"],
    solutionsTitle: "SOLUCIONES DE AUTOMATIZACIÓN",
    solutionsSubtitle: "Tecnología integrada en un solo control.",
    solutions: [
      {
        number: "01",
        title: "Control centralizado",
        description:
          "Gestiona diferentes sistemas desde una única interfaz de control.",
      },
      {
        number: "02",
        title: "Automatización de salas",
        description:
          "Simplifica el uso de las tecnologías mediante configuraciones automatizadas.",
      },
      {
        number: "03",
        title: "Audio y video",
        description:
          "Control integrado de equipos audiovisuales para una experiencia más eficiente.",
      },
      {
        number: "04",
        title: "Iluminación y dispositivos",
        description:
          "Integra iluminación y otros sistemas tecnológicos dentro de una misma solución.",
      },
    ],
    solutionCard: {
      title: "Un solo control para cada espacio",
      accentWord: "cada espacio",
      description: "Tecnología integrada para una gestión más simple e intuitiva.",
      badgeValue: "10 años",
      badgeLabel: "de experiencia",
    },
    ctaTitle: "¿HABLAMOS DE TU PROYECTO?",
    ctaSubtitle:
      "Conversamos sobre tu proyecto y encontramos la mejor forma de integrar tus sistemas en una sola solución.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "control integrado",
      "sala automatizada",
      "automatización",
      "control centralizado",
    ],
  },

  /* ---------------------------------------------------------------------- 6 */
  {
    slug: "sistemas-de-iluminacion",
    title: "Sistemas de iluminación comercial, arquitectónica y de escenarios",
    titleLead: "SISTEMAS DE",
    titleAccent: "ILUMINACIÓN COMERCIAL, ARQUITECTÓNICA Y DE ESCENARIOS",
    order: 6,
    areaOrder: 5,
    isFeatured: true,
    areaLabel: "ILUMINACIÓN",
    areaDescription:
      "Sistemas de Iluminación Comercial, Arquitectónica y de Escenarios",
    summary:
      "Iluminación y control para crear ambientes, destacar arquitectura y generar experiencias visuales.",
    paragraphs: [
      {
        text: "En oficinas, edificios, monumentos, teatros o escenarios móviles, podemos ofrecer todos los equipos y controladores necesarios para estas aplicaciones.",
      },
      {
        text: "Desarrollamos soluciones de iluminación adaptadas a las características y necesidades de cada proyecto, combinando equipos, sistemas de control y tecnologías que permiten crear ambientes funcionales, destacar elementos arquitectónicos y generar diferentes experiencias visuales.",
      },
      {
        text: "Cada solución puede configurarse de acuerdo con el espacio y su aplicación, permitiendo gestionar intensidad, distribución, escenas y diferentes configuraciones de iluminación, tanto en instalaciones permanentes como en montajes temporales.",
      },
      {
        text: "Desde espacios comerciales y corporativos hasta proyectos arquitectónicos, teatros y escenarios, buscamos integrar iluminación y control de manera eficiente, facilitando su operación y adaptación a diferentes situaciones.",
      },
    ],
    imageKeys: ["servicio-iluminacion"],
    solutionsTitle: "SOLUCIONES DE ILUMINACIÓN",
    solutionsSubtitle: "Tecnología y control para transformar cada espacio.",
    solutions: [
      {
        number: "01",
        title: "Iluminación comercial",
        description:
          "Soluciones para oficinas, tiendas y espacios comerciales, adaptadas a las necesidades de cada ambiente.",
      },
      {
        number: "02",
        title: "Iluminación arquitectónica",
        description:
          "Sistemas diseñados para destacar fachadas, edificios, monumentos y elementos arquitectónicos.",
      },
      {
        number: "03",
        title: "Iluminación para escenarios",
        description:
          "Equipos y soluciones para teatros, espectáculos, eventos y escenarios fijos o móviles.",
      },
      {
        number: "04",
        title: "Control de iluminación",
        description:
          "Sistemas de control para gestionar escenas, intensidad y diferentes configuraciones de iluminación.",
      },
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
      "Cuéntanos las características de tu espacio y desarrollaremos una solución de iluminación adaptada a tus necesidades.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "iluminación comercial",
      "iluminación arquitectónica",
      "iluminación de escenarios",
      "control de iluminación",
    ],
  },

  /* ---------------------------------------------------------------------- 7 */
  {
    slug: "sistemas-de-videoproyeccion-y-pantallas",
    title: "Sistemas de videoproyección y pantallas",
    titleLead: "SISTEMAS DE",
    titleAccent: "VIDEOPROYECCIÓN Y PANTALLAS",
    order: 7,
    areaOrder: 3,
    isFeatured: true,
    areaLabel: "VIDEO",
    areaDescription: "Sistemas de Videoproyección y Pantallas",
    summary:
      "Proyección, pantallas profesionales, video walls y digital signage para que cada mensaje tenga el impacto que necesita.",
    paragraphs: [
      {
        text: "Proyección de presentaciones en salas pequeñas, video en alta definición, digital signage, pantallas modulares, video walls, proyectores de alta potencia y los procesadores de video correspondientes para una visualización clara del mensaje que se quiera mostrar.",
      },
      {
        text: "Diseñamos e implementamos soluciones de visualización adaptadas a cada espacio, integrando sistemas de proyección, pantallas profesionales y procesamiento de video para lograr imágenes claras, definidas y de alto impacto.",
      },
      {
        text: "Cada proyecto se configura considerando aspectos como tamaño, resolución, luminosidad, distancia de visualización y tipo de contenido, garantizando una experiencia visual eficiente para aplicaciones corporativas, comerciales, publicitarias y eventos.",
      },
    ],
    imageKeys: ["servicio-video"],
    solutionsTitle: "SOLUCIONES DE VISUALIZACIÓN",
    solutionsSubtitle:
      "Tecnología diseñada para que cada mensaje tenga el impacto que necesita.",
    solutions: [
      {
        number: "01",
        title: "Videoproyección",
        description:
          "Proyectores y sistemas de alta definición adaptados a diferentes tamaños y condiciones de cada espacio.",
      },
      {
        number: "02",
        title: "Pantallas profesionales",
        description:
          "Soluciones de visualización para presentaciones, información, publicidad y contenidos multimedia.",
      },
      {
        number: "03",
        title: "Video Walls",
        description:
          "Configuraciones de múltiples pantallas para crear superficies visuales de gran formato y alto impacto.",
      },
      {
        number: "04",
        title: "Digital Signage",
        description:
          "Sistemas para mostrar y gestionar contenidos digitales informativos, comerciales o publicitarios.",
      },
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
        number: "01",
        title: "SALAS CORPORATIVAS",
        description:
          "Para reuniones, directorios, capacitaciones y presentaciones mediante pantallas o sistemas de videoproyección.",
        side: "IZQUIERDA",
      },
      {
        number: "02",
        title: "CENTROS COMERCIALES Y RETAIL",
        description:
          "Para publicidad, promociones, directorios digitales, escaparates y comunicación mediante digital signage.",
        side: "IZQUIERDA",
      },
      {
        number: "03",
        title: "AUDITORIOS Y CENTROS EDUCATIVOS",
        description:
          "Para presentaciones, conferencias, clases y contenidos audiovisuales que requieren grandes formatos de visualización.",
        side: "DERECHA",
      },
      {
        number: "04",
        title: "EVENTOS Y ESPACIOS DE GRAN FORMATO",
        description:
          "Para escenarios, ferias, convenciones y eventos mediante proyectores de alta potencia, pantallas modulares y video walls.",
        side: "DERECHA",
      },
    ],
    ctaTitle: "¿QUIERES LLEVAR TU CONTENIDO A UNA PANTALLA MÁS GRANDE?",
    ctaSubtitle:
      "Cuéntanos qué necesitas comunicar y diseñaremos una solución de visualización adaptada a tu espacio y proyecto.",
    ctaButtonLabel: "Solicitar información",
    keywords: [
      "videoproyección",
      "pantallas profesionales",
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
    areaOrder: 8,
    isFeatured: true,
    areaLabel: "SEGURIDAD",
    areaDescription: "Sistemas de Circuito Cerrado de Televisión (CCTV)",
    summary:
      "Videovigilancia con cobertura, ubicación estratégica de cámaras y monitoreo adaptado a cada entorno.",
    paragraphs: [
      {
        text: "Sistemas de circuito cerrado para diferentes tipos de aplicaciones, tanto de seguridad como de registro de reuniones, salas de focus groups o para usos industriales y específicos (con protección para intemperie o con procesadores de sensado de fuego incluidos) con el análisis para evitar el sobrecosto por mala ubicación de las cámaras.",
      },
      {
        text: "Diseñamos soluciones de videovigilancia adaptadas a las características y necesidades de cada espacio, considerando cobertura, ubicación estratégica de cámaras, condiciones ambientales y requerimientos específicos de monitoreo. Una correcta planificación permite optimizar los recursos instalados, reducir puntos ciegos y obtener un sistema eficiente, escalable y preparado para diferentes escenarios de operación.",
      },
    ],
    imageKeys: ["servicio-cctv"],
    solutionsTitle: "SOLUCIONES INTEGRALES DE VIDEOVIGILANCIA",
    solutionsSubtitle:
      "Cobertura, control y tecnología integrados en una solución diseñada para cada entorno.",
    solutions: [
      {
        number: "01",
        title: "Videovigilancia y seguridad",
        description:
          "Sistemas de cámaras para supervisión continua de oficinas, edificios, instalaciones comerciales y diferentes áreas de acceso.",
      },
      {
        number: "02",
        title: "Registro y monitoreo de espacios",
        description:
          "Soluciones para salas de reuniones, focus groups y ambientes donde se requiere visualizar, supervisar o registrar actividades.",
      },
      {
        number: "03",
        title: "Cámaras para aplicaciones especiales",
        description:
          "Equipamiento seleccionado según las condiciones del proyecto, incluyendo soluciones para exteriores, ambientes industriales y aplicaciones específicas.",
      },
      {
        number: "04",
        title: "Diseño y ubicación estratégica",
        description:
          "Análisis técnico para determinar cantidad, posición y cobertura de las cámaras, reduciendo puntos ciegos y evitando instalaciones innecesarias o sobrecostos.",
      },
    ],
    solutionCard: {
      title: "Tecnología que amplía tu visión y protege cada espacio",
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
        description:
          "Oficinas, salas de reuniones y ambientes de acceso controlado.",
      },
      {
        size: "MEDIANO",
        title: "Espacios comerciales",
        description:
          "Tiendas, restaurantes, hoteles y establecimientos con monitoreo continuo.",
      },
      {
        size: "GRANDE",
        title: "Grandes instalaciones",
        description:
          "Edificios, plantas industriales y espacios que requieren amplia cobertura de videovigilancia.",
      },
    ],
    ctaTitle: "¿NECESITAS IMPLEMENTAR O MEJORAR TU SISTEMA DE VIDEOVIGILANCIA?",
    ctaSubtitle:
      "Analizamos tu espacio para desarrollar una solución CCTV adecuada a tus necesidades.",
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
    areaOrder: 6,
    isFeatured: true,
    areaLabel: "CABLEADO ESTRUCTURADO",
    areaDescription: "Cableado Estructurado",
    summary:
      "Infraestructura de cableado organizada, escalable y preparada para integrar todos los sistemas.",
    paragraphs: [
      {
        text: "Cableado de todas las señales necesarias en las aplicaciones anteriores siguiendo los estándares internacionales para la correcta y segura instalación de estos.",
      },
      {
        text: "Diseñamos e implementamos infraestructuras de cableado organizadas, escalables y preparadas para integrar diferentes sistemas de comunicación, datos, video y control en un solo entorno. Una correcta planificación permite optimizar la distribución de los servicios, mejorar el rendimiento y garantizar una instalación ordenada con capacidad de adaptarse a futuras ampliaciones.",
      },
    ],
    imageKeys: ["servicio-cableado"],
    solutionsTitle: "¿QUÉ SOLUCIONES DE CABLEADO IMPLEMENTAMOS?",
    solutions: [
      {
        number: "01",
        title: "Canalizado de datos y telecomunicaciones",
        description:
          "Rutas y canalizaciones planificadas para conducir el cableado de forma segura y ordenada.",
      },
      {
        number: "02",
        title: "Cableado para voz, datos y video",
        description:
          "Tendido de cableado certificado para los servicios de comunicación del proyecto.",
      },
      {
        number: "03",
        title: "Integración de sistemas",
        description:
          "Unificación de los distintos sistemas sobre una misma infraestructura de red.",
      },
      {
        number: "04",
        title: "Organización y etiquetado",
        description:
          "Identificación y documentación de cada punto para facilitar el mantenimiento futuro.",
      },
    ],
    solutionCard: {
      title: "La conexión que integra toda tu tecnología",
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
      "certificación de cableado",
      "rack",
      "redes",
    ],
  },
];

export const servicesBySlug = new Map(services.map((s) => [s.slug, s]));

/** Servicios ordenados para la rejilla de áreas de /nosotros. */
export const servicesByArea = [...services].sort(
  (a, b) => a.areaOrder - b.areaOrder,
);
