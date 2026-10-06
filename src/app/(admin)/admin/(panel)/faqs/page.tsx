import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import {
  AdminForm,
  CheckboxInput,
  TextArea,
  TextInput,
} from "@/components/admin/admin-form";
import { saveFaqForm } from "@/server/actions/admin-forms";
import { requirePrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const prisma = requirePrisma();

  const faqs = await prisma.faq.findMany({
    where: { category: "general" },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <AdminPageHeader
        title="Preguntas frecuentes"
        description="Las preguntas que aparecen en la portada del sitio."
      />

      <div className="mt-6 flex flex-col gap-6">
        <AdminCard title="Agregar pregunta">
          <AdminForm action={saveFaqForm} submitLabel="Agregar pregunta" compact>
            <TextInput name="question" label="Pregunta" required />
            <TextArea name="answer" label="Respuesta" rows={3} required />
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput name="order" label="Orden" type="number" defaultValue={99} />
              <div className="flex items-end pb-1">
                <CheckboxInput
                  name="isVisible"
                  label="Visible en el sitio"
                  defaultChecked
                />
              </div>
            </div>
          </AdminForm>
        </AdminCard>

        <AdminCard
          title={`Preguntas registradas (${faqs.length})`}
          padded={false}
        >
          <ul className="divide-y divide-hairline">
            {faqs.map((faq) => (
              <li key={faq.id} className="p-5">
                <AdminForm
                  action={saveFaqForm}
                  hiddenFields={{ id: faq.id }}
                  submitLabel="Guardar"
                  compact
                >
                  <TextInput
                    name="question"
                    label="Pregunta"
                    defaultValue={faq.question}
                    required
                  />
                  <TextArea
                    name="answer"
                    label="Respuesta"
                    defaultValue={faq.answer}
                    rows={3}
                    required
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      name="order"
                      label="Orden"
                      type="number"
                      defaultValue={faq.order}
                    />
                    <div className="flex items-end pb-1">
                      <CheckboxInput
                        name="isVisible"
                        label="Visible en el sitio"
                        defaultChecked={faq.isVisible}
                      />
                    </div>
                  </div>
                </AdminForm>
              </li>
            ))}
            {faqs.length === 0 ? (
              <li className="px-5 py-12 text-center text-sm text-fog-500">
                Todavía no hay preguntas cargadas.
              </li>
            ) : null}
          </ul>
        </AdminCard>
      </div>
    </>
  );
}
