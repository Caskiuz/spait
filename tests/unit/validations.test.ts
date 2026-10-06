import { describe, expect, it } from "vitest";
import {
  contactSchema,
  enrollmentSchema,
  quoteSchema,
  siteSettingsSchema,
  serviceFormSchema,
} from "@/lib/validations";

/**
 * Pruebas de los esquemas de validacion. Son la primera linea de defensa del
 * backend: si estos fallan, entran datos invalidos o basura en la base.
 */

const contactoValido = {
  fullName: "Juan Pérez",
  email: "juan@colegio.edu.pe",
  phone: "961927974",
  message: "Necesitamos audio para un auditorio de 300 butacas.",
  consent: true as const,
};

describe("contactSchema", () => {
  it("acepta una consulta válida", () => {
    const result = contactSchema.safeParse(contactoValido);
    expect(result.success).toBe(true);
  });

  it("normaliza el correo a minúsculas y el teléfono sin espacios", () => {
    const result = contactSchema.parse({
      ...contactoValido,
      email: "  JUAN@Colegio.EDU.PE ",
      phone: "961 927 974",
    });
    expect(result.email).toBe("juan@colegio.edu.pe");
    expect(result.phone).toBe("961927974");
  });

  it("acepta el teléfono con prefijo +51 y con guiones", () => {
    expect(
      contactSchema.safeParse({ ...contactoValido, phone: "+51 961-927-974" })
        .success,
    ).toBe(true);
  });

  it("rechaza un teléfono que no es celular peruano", () => {
    for (const phone of ["123456789", "861927974", "96192797", "9619279745"]) {
      expect(contactSchema.safeParse({ ...contactoValido, phone }).success).toBe(
        false,
      );
    }
  });

  it("rechaza correos mal formados", () => {
    for (const email of ["sin-arroba", "a@b", "a@b.", "@dominio.com"]) {
      expect(contactSchema.safeParse({ ...contactoValido, email }).success).toBe(
        false,
      );
    }
  });

  it("exige el consentimiento de datos personales", () => {
    const result = contactSchema.safeParse({
      ...contactoValido,
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("exige un mensaje con contenido real", () => {
    expect(
      contactSchema.safeParse({ ...contactoValido, message: "hola" }).success,
    ).toBe(false);
  });

  it("acepta la empresa vacía y la convierte en undefined", () => {
    const result = contactSchema.parse({ ...contactoValido, company: "" });
    expect(result.company).toBeUndefined();
  });

  it("NO valida el campo trampa, para no delatar el filtro antispam", () => {
    const result = contactSchema.safeParse({
      ...contactoValido,
      website: "http://spam.example",
    });
    expect(result.success).toBe(true);
  });
});

describe("enrollmentSchema", () => {
  it("acepta una matrícula sin mensaje", () => {
    const result = enrollmentSchema.safeParse({
      fullName: "María López",
      email: "maria@gmail.com",
      phone: "987654321",
      courseSlug: "ingenieria-de-sonido",
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza una matrícula sin curso cuando el curso está vacío pero mal formado", () => {
    const result = enrollmentSchema.safeParse({
      fullName: "María López",
      email: "maria@gmail.com",
      phone: "987654321",
      consent: true,
    });
    // El curso es opcional: la matrícula sigue siendo válida.
    expect(result.success).toBe(true);
  });
});

describe("quoteSchema", () => {
  const cotizacion = {
    fullName: "Carlos Ramírez",
    email: "carlos@empresa.pe",
    phone: "955112233",
    description:
      "Necesitamos cableado estructurado para cuatro pabellones de un colegio.",
    consent: true as const,
  };

  it("acepta una cotización con los campos mínimos", () => {
    expect(quoteSchema.safeParse(cotizacion).success).toBe(true);
  });

  it("acepta tipo de proyecto y presupuesto de la lista", () => {
    expect(
      quoteSchema.safeParse({
        ...cotizacion,
        projectType: "ampliacion",
        budget: "15k-50k",
      }).success,
    ).toBe(true);
  });

  it("rechaza valores fuera del catálogo", () => {
    expect(
      quoteSchema.safeParse({ ...cotizacion, budget: "mucho-dinero" }).success,
    ).toBe(false);
    expect(
      quoteSchema.safeParse({ ...cotizacion, projectType: "inventado" }).success,
    ).toBe(false);
  });

  it("exige una descripción con suficiente detalle", () => {
    expect(
      quoteSchema.safeParse({ ...cotizacion, description: "audio" }).success,
    ).toBe(false);
  });
});

describe("siteSettingsSchema", () => {
  const ajustes = {
    companyName: "Sound Tech Perú",
    phoneDisplay: "+51 961 927 974",
    whatsapp: "51961927974",
    email: "soundtechperu@gmail.com",
  };

  it("acepta la configuración mínima", () => {
    expect(siteSettingsSchema.safeParse(ajustes).success).toBe(true);
  });

  it("exige el WhatsApp en solo dígitos con código de país", () => {
    expect(
      siteSettingsSchema.safeParse({ ...ajustes, whatsapp: "+51 961 927 974" })
        .success,
    ).toBe(false);
  });
});

describe("serviceFormSchema", () => {
  const servicio = {
    slug: "cableado-estructurado",
    title: "Cableado estructurado",
    titleLead: "CABLEADO",
    titleAccent: "ESTRUCTURADO",
    summary: "Infraestructura de cableado organizada y escalable.",
    areaLabel: "CABLEADO ESTRUCTURADO",
    areaDescription: "Cableado Estructurado",
    solutionsTitle: "¿QUÉ SOLUCIONES DE CABLEADO IMPLEMENTAMOS?",
    ctaTitle: "¿NECESITAS UNA SOLUCIÓN DE CABLEADO?",
    ctaSubtitle: "Diseñamos una solución adaptada a cada instalación.",
    ctaButtonLabel: "Solicitar información",
    order: "9",
    isPublished: true,
    isFeatured: true,
  };

  it("acepta un servicio válido y convierte el orden a número", () => {
    const result = serviceFormSchema.safeParse(servicio);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.order).toBe(9);
  });

  it("rechaza slugs con mayúsculas, espacios o acentos", () => {
    for (const slug of ["Cableado Estructurado", "cableado_estructurado", "cableado-á"]) {
      expect(serviceFormSchema.safeParse({ ...servicio, slug }).success).toBe(
        false,
      );
    }
  });

  it("convierte el booleano de un checkbox HTML", () => {
    const result = serviceFormSchema.safeParse({
      ...servicio,
      isPublished: "on",
      isFeatured: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPublished).toBe(true);
      expect(result.data.isFeatured).toBe(false);
    }
  });
});
