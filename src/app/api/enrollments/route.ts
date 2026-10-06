import { enrollmentSchema } from "@/lib/validations";
import { createLeadHandler } from "@/server/actions/leads";

/** POST /api/enrollments — formulario de matrícula de /cursos */
export const POST = createLeadHandler({
  kind: "matricula",
  schema: enrollmentSchema,
});
