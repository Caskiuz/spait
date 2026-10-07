import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { mediaUrl } from "@/components/site/media-image";
import { getSession, isAdminEnabled } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

/**
 * Plantilla de las paginas protegidas del panel.
 *
 * Aqui —y no en /admin/layout.tsx— se exige la sesion, para que el formulario
 * de acceso quede fuera de la comprobacion y no se produzca un bucle de
 * redirecciones.
 */
export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdminEnabled()) redirect("/admin/login");

  const session = await getSession();
  if (!session?.user) redirect("/admin/login");

  // Prospectos sin atender, para el aviso de la barra lateral.
  let pending = 0;
  const prisma = getPrisma();
  if (prisma) {
    try {
      const [messages, enrollments, quotes] = await Promise.all([
        prisma.contactMessage.count({ where: { status: "NUEVO" } }),
        prisma.enrollment.count({ where: { status: "NUEVO" } }),
        prisma.quoteRequest.count({ where: { status: "NUEVO" } }),
      ]);
      pending = messages + enrollments + quotes;
    } catch {
      pending = 0;
    }
  }

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <AdminSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        }}
        logoUrl={mediaUrl("logo-soundtech", "/media/logo-soundtech.png")}
        alerts={pending}
      />

      <main className="min-w-0 flex-1 px-5 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
