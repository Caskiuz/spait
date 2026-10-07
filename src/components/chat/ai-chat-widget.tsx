"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, MessageSquare, Send, X } from "lucide-react";
import { WhatsappIcon } from "@/components/site/social-icon";
import { mediaUrl } from "@/components/site/media-image";
import { cn, whatsappLink } from "@/lib/utils";

/* ==========================================================================
   Asistente virtual flotante (esquina inferior izquierda).

   Habla con /api/chat, que responde con Gemini en el servidor. El boton de
   WhatsApp es fijo en la cabecera: no se pierde aunque el historial se
   desplace. El avatar usa el simbolo real del logo y los colores de la marca.
   ========================================================================== */

type Rol = "user" | "assistant";

interface Mensaje {
  id: number;
  role: Rol;
  text: string;
  /** El saludo inicial lleva el enlace directo a WhatsApp. */
  esSaludo?: boolean;
}

const CHIPS = [
  "¿Qué servicios ofrecen?",
  "¿Cómo me matriculo?",
  "¿Cuánto dura la carrera?",
  "¿Dónde están ubicados?",
];

export function AiChatWidget({
  companyName,
  whatsapp,
  phoneDisplay,
}: {
  companyName: string;
  whatsapp: string;
  phoneDisplay: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [burbuja, setBurbuja] = useState(true);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: 0,
      role: "assistant",
      text: `Hola 👋, soy el asistente virtual de ${companyName}. ¿En qué puedo ayudarte hoy?`,
      esSaludo: true,
    },
  ]);
  const [historial, setHistorial] = useState<
    { role: Rol; text: string }[]
  >([]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const listaRef = useRef<HTMLDivElement>(null);
  const entradaRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);

  const enlaceWa = whatsappLink(
    whatsapp,
    "Hola, vengo de la web de Sound Tech Perú 👋",
  );

  const abrir = () => {
    setAbierto(true);
    setBurbuja(false);
  };

  // La burbuja de saludo se oculta sola si nadie abre el chat.
  useEffect(() => {
    if (!burbuja || abierto) return;
    const timer = setTimeout(() => setBurbuja(false), 9000);
    return () => clearTimeout(timer);
  }, [burbuja, abierto]);

  // Escape cierra el chat; al abrir, el foco va al campo de texto.
  useEffect(() => {
    if (!abierto) return;
    entradaRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  // El historial siempre queda visible: se desplaza al ultimo mensaje.
  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    lista.scrollTo({ top: lista.scrollHeight, behavior: "smooth" });
  }, [mensajes, pensando]);

  async function enviar(contenido: string) {
    const limpio = contenido.trim();
    if (!limpio || pensando) return;

    setAviso(null);
    setTexto("");
    setMensajes((previos) => [
      ...previos,
      { id: idRef.current++, role: "user", text: limpio },
    ]);
    setPensando(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: limpio, history: historial }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };

      if (!res.ok || !data.reply) {
        throw new Error(data.error ?? "Sin respuesta del asistente");
      }

      setHistorial((previos) => [
        ...previos.slice(-9),
        { role: "user", text: limpio },
        { role: "assistant", text: data.reply as string },
      ]);
      setMensajes((previos) => [
        ...previos,
        { id: idRef.current++, role: "assistant", text: data.reply as string },
      ]);
    } catch (error) {
      const motivo =
        error instanceof Error && error.message ? error.message : "fallo";
      setAviso(
        motivo === "Demasiadas consultas. Espera unos minutos, por favor."
          ? motivo
          : null,
      );
      setMensajes((previos) => [
        ...previos,
        {
          id: idRef.current++,
          role: "assistant",
          text: `No pude conectar con el asistente en este momento. Inténtalo de nuevo en un momento, escríbenos por WhatsApp con el botón verde o llámanos al ${phoneDisplay}. 🙏`,
        },
      ]);
    } finally {
      setPensando(false);
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2.5">
      {abierto ? (
        <div
          role="dialog"
          aria-label="Asistente virtual de Sound Tech Perú"
          className="flex h-[min(34rem,calc(100dvh-5rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-hairline-strong bg-ink-950/95 shadow-2xl backdrop-blur-xl"
        >
          {/* Cabecera fija: el boton de WhatsApp nunca se pierde. */}
          <header className="flex items-center gap-2.5 border-b border-hairline bg-ink-925/80 px-4 py-3">
            <Avatar3D compacto />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[13px] font-black uppercase tracking-wide text-white">
                Asistente virtual
              </p>
              <p className="flex items-center gap-1.5 text-[11px] text-fog-400">
                <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
                En línea · responde al instante
              </p>
            </div>

            <a
              href={enlaceWa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hablar por WhatsApp"
              title="Hablar por WhatsApp"
              className="flex h-9 items-center gap-2 rounded-full bg-[#25D366] px-3 text-white shadow-lg shadow-[#25D366]/20 transition-transform hover:scale-105"
            >
              <WhatsappIcon className="size-4" />
              <span className="hidden text-xs font-bold md:inline">WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar el asistente"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-hairline text-fog-400 transition-colors hover:text-white"
            >
              <X className="size-4" />
            </button>
          </header>

          {/* Conversacion */}
          <div
            ref={listaRef}
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                className={cn(
                  "flex",
                  mensaje.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed",
                    mensaje.role === "user"
                      ? "rounded-br-md bg-gradient-brand text-white"
                      : "rounded-bl-md border border-hairline bg-ink-900 text-fog-100",
                  )}
                >
                  <p className="whitespace-pre-line">{mensaje.text}</p>

                  {mensaje.esSaludo ? (
                    <a
                      href={enlaceWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                      <WhatsappIcon className="size-3.5" />
                      ¿Prefieres WhatsApp? Escríbenos aquí
                    </a>
                  ) : null}
                </div>
              </div>
            ))}

            {pensando ? (
              <div className="flex justify-start">
                <span className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-hairline bg-ink-900 px-4 py-3.5">
                  <span aria-hidden className="eq-bar" />
                  <span
                    aria-hidden
                    className="eq-bar"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    aria-hidden
                    className="eq-bar"
                    style={{ animationDelay: "0.3s" }}
                  />
                  <span className="sr-only">El asistente está escribiendo</span>
                </span>
              </div>
            ) : null}

            {aviso ? (
              <p className="text-center text-[11px] text-amber-400">{aviso}</p>
            ) : null}
          </div>

          {/* Sugerencias: se ocultan cuando la conversacion avanza. */}
          {mensajes.length <= 2 ? (
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => enviar(chip)}
                  className="shrink-0 rounded-full border border-hairline-strong bg-ink-900 px-3.5 py-2 text-[11.5px] font-semibold text-fog-200 transition-colors hover:border-brand-600/60 hover:text-white"
                >
                  {chip}
                </button>
              ))}
            </div>
          ) : null}

          {/* Entrada de texto */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void enviar(texto);
            }}
            className="flex items-center gap-2 border-t border-hairline bg-ink-925/80 p-3"
          >
            <input
              ref={entradaRef}
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              placeholder="Escribe tu consulta…"
              maxLength={2000}
              aria-label="Escribe tu consulta"
              className="min-w-0 flex-1 rounded-full border border-hairline bg-ink-950 px-4 py-2.5 text-sm text-white placeholder:text-fog-500 focus:border-brand-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!texto.trim() || pensando}
              aria-label="Enviar mensaje"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-brand text-white transition-opacity disabled:opacity-40"
            >
              {pensando ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </form>
        </div>
      ) : (
        <>
          {burbuja ? (
            <button
              type="button"
              onClick={abrir}
              className="animate-float-slow rounded-2xl rounded-bl-md border border-hairline-strong bg-ink-925/90 px-4 py-2.5 text-[13px] font-semibold text-white shadow-xl backdrop-blur"
            >
              Hola 👋 ¿En qué puedo ayudarte?
            </button>
          ) : null}

          <button
            type="button"
            onClick={abrir}
            aria-label="Abrir el asistente virtual"
            className="group relative block animate-float-slow transition-transform duration-300 hover:scale-105 motion-reduce:animate-none motion-reduce:transition-none"
          >
            <Avatar3D />
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-brand-600 ring-2 ring-ink-950"
            >
              <MessageSquare className="size-3 text-white" />
            </span>
          </button>
        </>
      )}
    </div>
  );
}

/* ==========================================================================
   Avatar: el simbolo del logo en un orbe con dos anillos que giran en 3D.
   ========================================================================== */

function Avatar3D({ compacto = false }: { compacto?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "chat-avatar relative block shrink-0",
        compacto ? "size-9" : "size-16",
      )}
    >
      <span className="chat-avatar-glow absolute -inset-1.5 rounded-full" />
      <span className="chat-avatar-orbit absolute inset-0 rounded-full" />
      <span className="chat-avatar-orbit-b absolute inset-[12%] rounded-full" />
      <span className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-ink-950 ring-1 ring-white/15">
        <Image
          src={mediaUrl("logo-soundtech-simbolo", "/media/logo-soundtech-simbolo.png")}
          alt=""
          width={96}
          height={96}
          className="size-[76%] object-contain"
        />
      </span>
    </span>
  );
}
