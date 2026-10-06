"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { StatusBadge } from "./ui";
import { addLeadNote, updateLeadStatus } from "@/server/actions/admin";
import { cn } from "@/lib/utils";

const STATUSES = ["NUEVO", "EN_PROCESO", "ATENDIDO", "DESCARTADO"] as const;

type LeadKind = "mensaje" | "matricula" | "cotizacion";

/**
 * Controles de gestion de un prospecto: cambio de estado y notas internas.
 * El correo de respuesta se deja como enlace mailto para no depender de un
 * proveedor de correo desde el panel.
 */
export function LeadActions({
  kind,
  id,
  status,
  email,
  phone,
}: {
  kind: LeadKind;
  id: string;
  status: string;
  email: string;
  phone: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function changeStatus(next: string) {
    startTransition(async () => {
      const result = await updateLeadStatus(kind, id, next);
      setFeedback(result.message ?? null);
      router.refresh();
    });
  }

  function submitNote(event: React.FormEvent) {
    event.preventDefault();
    if (!note.trim()) return;

    startTransition(async () => {
      const result = await addLeadNote(kind, id, note);
      if (result.ok) setNote("");
      setFeedback(result.message ?? null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Estado */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-fog-500">
          Estado del prospecto
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUSES.map((option) => (
            <button
              key={option}
              type="button"
              disabled={pending}
              onClick={() => changeStatus(option)}
              aria-pressed={status === option}
              className={cn(
                "rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all disabled:opacity-50",
                status === option
                  ? "border-brand-600 bg-brand-600/15 text-brand-300"
                  : "border-hairline text-fog-400 hover:border-brand-600/50 hover:text-brand-400",
              )}
            >
              {option.replace("_", " ").toLowerCase()}
            </button>
          ))}
          {pending ? (
            <Loader2 className="mt-2 size-4 animate-spin text-fog-500" aria-hidden />
          ) : null}
        </div>
        <p className="mt-3 text-[11px] text-fog-500">
          Estado actual: <StatusBadge status={status} />
        </p>
      </div>

      {/* Respuesta rápida */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-fog-500">
          Responder
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <a
            href={`mailto:${email}?subject=${encodeURIComponent("Tu consulta a Sound Tech Perú")}`}
            className="inline-flex h-10 items-center rounded-full bg-gradient-brand px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-all hover:brightness-110"
          >
            Enviar correo
          </a>
          <a
            href={`https://wa.me/${phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-full border border-hairline px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-fog-300 transition-colors hover:border-brand-600/60 hover:text-brand-400"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Nota interna */}
      <form onSubmit={submitNote}>
        <label
          htmlFor="lead-note"
          className="text-[11px] uppercase tracking-[0.16em] text-fog-500"
        >
          Agregar nota interna
        </label>
        <textarea
          id="lead-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          placeholder="Llamado el 12/10, pidió propuesta para dos aulas…"
          className="mt-3 w-full resize-y rounded-xl border border-hairline bg-ink-900/70 px-4 py-3 text-sm text-white placeholder:text-fog-500 focus:border-brand-600/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !note.trim()}
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-full border border-hairline px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-fog-300 transition-colors hover:border-brand-600/60 hover:text-brand-400 disabled:opacity-40"
        >
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Send className="size-3.5" aria-hidden />
          )}
          Guardar nota
        </button>
      </form>

      {feedback ? (
        <p aria-live="polite" className="text-xs text-brand-400">
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
