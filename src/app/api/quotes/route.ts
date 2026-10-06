import { quoteSchema } from "@/lib/validations";
import { createLeadHandler } from "@/server/actions/leads";

/** POST /api/quotes — formulario de cotización de /cotizar */
export const POST = createLeadHandler({
  kind: "cotizacion",
  schema: quoteSchema,
  limit: 4,
});
