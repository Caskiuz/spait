import { describe, expect, it } from "vitest";
import { toCsv } from "@/lib/csv";
import { slugify, truncate, whatsappLink, pad2, deaccent } from "@/lib/utils";
import { services, servicesBySlug } from "@/content/services";
import { media } from "@/content/media";

describe("toCsv", () => {
  it("usa punto y coma como separador y añade BOM para Excel", () => {
    const csv = toCsv(["Nombre", "Correo"], [["Ana", "ana@test.com"]]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("Nombre;Correo");
    expect(csv).toContain("Ana;ana@test.com");
  });

  it("entrecomilla valores con separador, comillas o salto de línea", () => {
    const csv = toCsv(["Mensaje"], [['Dijo "hola"; luego se fue\nsegunda línea']]);
    expect(csv).toContain('"Dijo ""hola""; luego se fue\nsegunda línea"');
  });

  it("neutraliza intentos de inyección de fórmulas", () => {
    const csv = toCsv(["Campo"], [["=1+1"], ["+SUM(A1)"], ["-2+3"], ["@hola"]]);
    expect(csv).toContain("'=1+1");
    expect(csv).toContain("'+SUM(A1)");
    expect(csv).toContain("'-2+3");
    expect(csv).toContain("'@hola");
  });

  it("convierte fechas a ISO y vacíos a celda vacía", () => {
    const csv = toCsv(
      ["Fecha", "Empresa"],
      [[new Date("2026-03-15T10:00:00Z"), null]],
    );
    expect(csv).toContain("2026-03-15T10:00:00.000Z;");
  });
});

describe("slugify", () => {
  it("quita acentos y normaliza a minúsculas con guiones", () => {
    expect(slugify("Acondicionamiento y Aislamiento Acústico")).toBe(
      "acondicionamiento-y-aislamiento-acustico",
    );
    expect(slugify("Videoproyección & Pantallas")).toBe(
      "videoproyeccion-pantallas",
    );
  });

  it("no deja guiones repetidos ni al final", () => {
    expect(slugify("Audio --- Profesional  ")).toBe("audio-profesional");
  });
});

describe("truncate", () => {
  it("corta respetando palabras completas", () => {
    const text = "Necesitamos audio para un auditorio de trescientas butacas";
    const result = truncate(text, 30);
    expect(result.length).toBeLessThanOrEqual(31);
    expect(result.endsWith("…")).toBe(true);
    expect(result).not.toContain("auditori…");
  });

  it("deja intacto un texto que ya cabe", () => {
    expect(truncate("Corto", 30)).toBe("Corto");
  });
});

describe("whatsappLink", () => {
  it("limpia el formato del teléfono", () => {
    expect(whatsappLink("+51 961-927-974")).toBe("https://wa.me/51961927974");
  });

  it("añade el mensaje cuando se indica", () => {
    expect(whatsappLink("51961927974", "Hola")).toBe(
      "https://wa.me/51961927974?text=Hola",
    );
  });
});

describe("pad2 / deaccent", () => {
  it("rellena a dos dígitos", () => {
    expect(pad2(1)).toBe("01");
    expect(pad2(12)).toBe("12");
  });

  it("quita los acentos conservando las letras", () => {
    expect(deaccent("Acústico Iluminación")).toBe("Acustico Iluminacion");
  });
});

describe("contenido de servicios", () => {
  it("declara exactamente los nueve servicios de las capturas", () => {
    expect(services).toHaveLength(9);
  });

  it("no repite slugs", () => {
    expect(servicesBySlug.size).toBe(services.length);
  });

  it("cada servicio tiene cuatro soluciones numeradas 01 a 04", () => {
    for (const service of services) {
      expect(service.solutions).toHaveLength(4);
      expect(service.solutions.map((s) => s.number)).toEqual([
        "01",
        "02",
        "03",
        "04",
      ]);
    }
  });

  it("cada bloque opcional está completo o ausente, nunca a medias", () => {
    for (const service of services) {
      if (service.applications) {
        expect(service.applications.length).toBeGreaterThan(0);
        for (const application of service.applications) {
          expect(["IZQUIERDA", "DERECHA"]).toContain(application.side);
        }
      }
      if (service.scopeGroups) {
        expect(service.scopeGroups).toHaveLength(3);
      }
      // El bloque destacado de aplicaciones solo aparece si hay aplicaciones.
      if (service.applicationHighlight) {
        expect(service.applications).toBeDefined();
      }
    }
  });

  it("todas las imágenes referenciadas existen en el manifiesto de medios", () => {
    const missing: string[] = [];
    for (const service of services) {
      for (const key of service.imageKeys) {
        if (!(key in media)) missing.push(`${service.slug} -> ${key}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("los slugs son válidos para URL", () => {
    for (const service of services) {
      expect(service.slug).toMatch(/^[a-z0-9-]+$/);
      expect(slugify(service.title)).toBeTruthy();
    }
  });
});
