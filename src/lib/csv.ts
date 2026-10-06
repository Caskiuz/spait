/**
 * Utilidades para exportar prospectos a CSV.
 *
 * Se aplica la regla de Excel: si un valor puede interpretarse como formula
 * (empieza por = + - @), se prefija con apostrofo para evitar inyeccion CSV.
 */

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";

  let text = value instanceof Date ? value.toISOString() : String(value);

  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  if (/[";\n\r]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function toCsv(
  headers: string[],
  rows: (string | number | Date | null | undefined)[][],
): string {
  const lines = [
    headers.map(cell).join(";"),
    ...rows.map((row) => row.map(cell).join(";")),
  ];

  // BOM para que Excel reconozca UTF-8 y muestre bien los acentos.
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

/** Nombre de archivo con la fecha de generacion. */
export function csvFilename(prefix: string): string {
  const stamp = new Date().toISOString().slice(0, 10);
  return `${prefix}-${stamp}.csv`;
}

/** Respuesta HTTP lista para descargar un CSV. */
export function csvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
