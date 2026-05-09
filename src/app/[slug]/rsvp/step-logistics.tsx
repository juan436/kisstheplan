"use client";

import { ChevronLeft, Check, Loader2 } from "lucide-react";
import type { RsvpSession, GuestResponse, GuestPublic } from "./types";

interface StepLogisticsProps {
  session: RsvpSession;
  responses: GuestResponse[];
  setResponses: (r: GuestResponse[]) => void;
  submitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
  colors: Record<string, string>;
  fontTitle: string;
}

function MemberTransport({ member, response, onChange, transportOptions, accent }: {
  member: GuestPublic;
  response: GuestResponse;
  onChange: (partial: Partial<GuestResponse>) => void;
  transportOptions: string[];
  accent: string;
}) {
  return (
    <div className="mb-5 pb-5 border-b last:border-0" style={{ borderColor: accent + "20" }}>
      <p className="text-[14px] font-semibold mb-3">{member.firstName} {member.lastName}</p>
      <label className="flex items-center gap-3 cursor-pointer select-none mb-3"
        onClick={() => onChange({ transport: !response.transport, transportPickupPoint: undefined })}>
        <div className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0"
          style={{ borderColor: response.transport ? accent : accent + "40", backgroundColor: response.transport ? accent : "transparent" }}>
          {response.transport && <Check size={12} className="text-white" />}
        </div>
        <span className="text-[14px]">Necesito transporte</span>
      </label>
      {response.transport && transportOptions.length > 0 && (
        <div>
          <label className="block text-[11px] uppercase tracking-widest opacity-40 mb-2">Punto de recogida</label>
          <div className="flex flex-wrap gap-2">
            {transportOptions.map((opt) => {
              const selected = response.transportPickupPoint === opt;
              return (
                <button key={opt} type="button"
                  onClick={() => onChange({ transportPickupPoint: selected ? undefined : opt })}
                  className="px-3 py-1.5 rounded-full text-[13px] font-medium border-[1.5px] transition-colors"
                  style={{
                    borderColor:     selected ? accent : accent + "40",
                    backgroundColor: selected ? accent : "transparent",
                    color:           selected ? "#fff"  : undefined,
                  }}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function StepLogistics({ session, responses, setResponses, submitting, onSubmit, onBack, colors, fontTitle }: StepLogisticsProps) {
  const allMembers   = session.group ? session.group.members : [session.guest];
  const confirmed    = allMembers.filter((m) => responses.find((r) => r.guestId === m.id)?.rsvpStatus === "confirmed");
  const hasTransport = session.wedding.transportOptions.length > 0;

  const update = (guestId: string, partial: Partial<GuestResponse>) => {
    setResponses(responses.map((r) => r.guestId === guestId ? { ...r, ...partial } : r));
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest opacity-40 mb-1">Paso 3 de 3</p>
      <h3 className="text-[22px] mb-1" style={{ fontFamily: fontTitle, fontStyle: "italic" }}>Logística</h3>
      <p className="text-[13px] opacity-50 mb-6">
        {hasTransport ? "¿Necesitáis transporte para llegar?" : "Ya casi hemos terminado"}
      </p>

      {hasTransport && confirmed.length > 0 ? (
        <div className="mb-6">
          {confirmed.map((member) => {
            const resp = responses.find((r) => r.guestId === member.id);
            if (!resp) return null;
            return (
              <MemberTransport key={member.id} member={member} response={resp}
                onChange={(partial) => update(member.id, partial)}
                transportOptions={session.wedding.transportOptions} accent={colors.accent} />
            );
          })}
        </div>
      ) : (
        <p className="text-[14px] opacity-50 mb-6">
          {confirmed.length > 0 ? "No hay opciones de transporte disponibles." : "Has indicado que no asistirás."}
        </p>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl border-2 text-[14px] font-medium hover:opacity-70 transition-opacity"
          style={{ borderColor: colors.accent + "40" }}>
          <ChevronLeft size={18} />Atrás
        </button>
        <button type="button" onClick={onSubmit} disabled={submitting}
          className="flex-1 py-3.5 rounded-xl text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: colors.accent }}>
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Enviar confirmación
        </button>
      </div>
    </div>
  );
}
