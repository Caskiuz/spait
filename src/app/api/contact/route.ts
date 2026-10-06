import { contactSchema } from "@/lib/validations";
import { createLeadHandler } from "@/server/actions/leads";

/** POST /api/contact — formulario de contacto de /contactenos */
export const POST = createLeadHandler({
  kind: "contacto",
  schema: contactSchema,
});
