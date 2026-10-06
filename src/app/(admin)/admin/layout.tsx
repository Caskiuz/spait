import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

/**
 * Plantilla raiz del area /admin.
 *
 * No comprueba la sesion a proposito: el formulario de acceso vive aqui y
 * hacerlo provocaria un bucle de redirecciones (el layout manda al login y el
 * login vuelve a cargar el layout). La comprobacion esta en el grupo (panel).
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-ink-950">{children}</div>;
}
