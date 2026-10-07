import type { Metadata } from "next";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { mediaUrl } from "@/components/site/media-image";
import { Container, GlowBlob, Grain } from "@/components/ui/layout";
import { env } from "@/lib/env";
import { isAdminEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Acceso al panel",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const enabled = isAdminEnabled();

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden py-16">
      <Grain />
      <GlowBlob
        className="left-1/2 top-1/3 -translate-x-1/2 opacity-50"
        size={620}
        color="rgba(235,93,26,0.26)"
      />

      <Container className="relative max-w-md">
        <div className="flex flex-col items-center text-center">
          <Image
            src={mediaUrl("logo-soundtech", "/media/logo-soundtech.svg")}
            alt=""
            width={48}
            height={48}
            className="size-12"
          />
          <p className="eyebrow mt-5">Panel de administración</p>
          <h1 className="headline mt-3 text-2xl md:text-3xl">
            <span className="text-white">SOUND TECH </span>
            <span className="text-gradient-brand">PERÚ</span>
          </h1>
        </div>

        {!enabled ? (
          <div className="mt-9 rounded-card border border-amber-500/35 bg-amber-500/8 p-6">
            <p className="flex items-center gap-2.5 font-display text-sm font-extrabold uppercase tracking-wide text-amber-300">
              <AlertTriangle className="size-4" aria-hidden />
              Panel deshabilitado
            </p>
            <p className="mt-3 text-xs leading-relaxed text-fog-300">
              Para activar el panel de administración configura estas variables
              de entorno y vuelve a desplegar:
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-[11px] text-fog-400">
              <li className={env.hasDatabase ? "text-emerald-400" : ""}>
                <code className="rounded bg-ink-800 px-1.5 py-0.5">DATABASE_URL</code>{" "}
                — cadena de conexión de Neon
                {env.hasDatabase ? " ✓" : ""}
              </li>
              <li className={env.authSecret ? "text-emerald-400" : ""}>
                <code className="rounded bg-ink-800 px-1.5 py-0.5">AUTH_SECRET</code>{" "}
                — cadena aleatoria de 32+ caracteres
                {env.authSecret ? " ✓" : ""}
              </li>
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-fog-500">
              Genera el secreto con:{" "}
              <code className="rounded bg-ink-800 px-1.5 py-0.5">
                npx auth secret
              </code>
            </p>
          </div>
        ) : (
          <div className="mt-9 rounded-card-lg border border-hairline bg-ink-900/70 p-7 backdrop-blur">
            {error ? (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-500/35 bg-red-500/8 p-3.5 text-xs text-fog-200"
              >
                {error === "CredentialsSignin"
                  ? "El correo o la contraseña no son correctos."
                  : "No pudimos iniciar tu sesión. Inténtalo otra vez."}
              </p>
            ) : null}

            <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
          </div>
        )}

        <p className="mt-8 text-center text-[11px] text-fog-500">
          Acceso restringido. Todas las acciones quedan registradas.
        </p>
      </Container>
    </div>
  );
}
