import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container, Section } from "@/components/ui/layout";
import { getSiteSettings } from "@/server/repositories/content";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad y tratamiento de datos personales de Sound Tech Perú conforme a la Ley N.º 29733.",
  alternates: { canonical: "/politica-de-privacidad" },
};

export default async function PrivacidadPage() {
  const settings = await getSiteSettings();

  const sections: { title: string; body: string[] }[] = [
    {
      title: "1. Responsable del tratamiento",
      body: [
        `${settings.legalName}, con domicilio en ${settings.address}, es responsable del tratamiento de los datos personales que nos proporcionas a través de este sitio web, en cumplimiento de la Ley N.º 29733, Ley de Protección de Datos Personales, y su reglamento.`,
        `Para cualquier consulta relacionada con esta política puedes escribirnos a ${settings.email} o llamarnos al ${settings.phoneDisplay}.`,
      ],
    },
    {
      title: "2. Qué datos recopilamos",
      body: [
        "Recopilamos únicamente los datos que nos entregas voluntariamente en nuestros formularios: nombres y apellidos, correo electrónico, número de teléfono, nombre de la empresa (opcional), servicio de interés y el contenido de tu mensaje.",
        "Adicionalmente registramos la dirección IP y el agente de usuario de cada envío con la única finalidad de prevenir envíos automatizados y proteger nuestros formularios.",
      ],
    },
    {
      title: "3. Finalidad del tratamiento",
      body: [
        "Utilizamos tus datos para: (a) responder a tu consulta o solicitud de cotización; (b) elaborar y enviarte una propuesta comercial; (c) coordinar visitas técnicas y la ejecución de proyectos; y (d) mantener el registro histórico de la relación comercial.",
        "No utilizamos tus datos para enviarte publicidad de terceros ni los vendemos, alquilamos ni cedemos a empresas ajenas a la prestación de nuestros servicios.",
      ],
    },
    {
      title: "4. Base legal y consentimiento",
      body: [
        "El tratamiento se sustenta en el consentimiento que otorgas de forma libre, previa, expresa e informada al marcar la casilla de aceptación en nuestros formularios, y en el interés legítimo de atender las solicitudes que nos presentas.",
      ],
    },
    {
      title: "5. Plazo de conservación",
      body: [
        "Conservamos los datos mientras exista una relación comercial o un interés mutuo en mantener el contacto. Si solicitas la supresión, los eliminaremos salvo que exista una obligación legal de conservarlos.",
      ],
    },
    {
      title: "6. Derechos del titular",
      body: [
        "Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, cancelación, oposición, información y tratamiento objetivo, así como revocar el consentimiento otorgado.",
        `Para ejercerlos, envíanos una solicitud a ${settings.email} indicando tus nombres y apellidos, un documento que acredite tu identidad y la petición concreta. Responderemos en los plazos establecidos por la normativa vigente.`,
      ],
    },
    {
      title: "7. Seguridad de la información",
      body: [
        "Aplicamos medidas técnicas y organizativas razonables para proteger tus datos: cifrado en tránsito (HTTPS), acceso restringido a los registros mediante credenciales individuales, registro de auditoría de las acciones administrativas y copias de seguridad periódicas.",
      ],
    },
    {
      title: "8. Cookies y analítica",
      body: [
        "Este sitio utiliza únicamente cookies técnicas necesarias para su funcionamiento y métricas agregadas de rendimiento y visitas que no identifican a personas concretas. No utilizamos cookies de perfilado publicitario.",
      ],
    },
    {
      title: "9. Cambios en esta política",
      body: [
        "Podemos actualizar esta política para reflejar cambios normativos o de nuestros servicios. Publicaremos la versión vigente en esta misma página indicando la fecha de actualización.",
      ],
    },
  ];

  return (
    <>
      <PageHero
        titleLead="POLÍTICA DE"
        titleAccent="PRIVACIDAD"
        subtitle="Tratamiento de tus datos personales"
        imageKey="hero-legal"
        showScrollCue={false}
      />

      <Section className="pt-14 md:pt-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm leading-relaxed text-fog-400">
              En {settings.legalName} cuidamos la información que nos confías.
              Esta política explica qué datos recopilamos, para qué los usamos y
              cómo puedes ejercer tus derechos.
            </p>

            <div className="mt-12 flex flex-col gap-10">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-display text-base font-extrabold uppercase tracking-wide text-brand-500">
                    {section.title}
                  </h2>
                  <div className="mt-3 flex flex-col gap-3">
                    {section.body.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-sm leading-relaxed text-fog-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-14 border-t border-hairline pt-6 text-xs text-fog-500">
              Última actualización:{" "}
              {new Intl.DateTimeFormat("es-PE", {
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
