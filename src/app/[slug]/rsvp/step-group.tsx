"use client";

import { Check, X, ChevronRight, Loader2 } from "lucide-react";
import type { RsvpSession, GuestResponse, GuestPublic } from "./types";

interface StepGroupProps {
  session: RsvpSession;
  responses: GuestResponse[];
  setResponses: (r: GuestResponse[]) => void;
  onNext: () => void;
  submitting: boolean;
  colors: Record<string, string>;
  fontTitle: string;
}

function MemberRow({ member, response, onChange, accent }: {
  member: GuestPublic;
  response: GuestResponse;
  onChange: (r: GuestResponse) => void;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0"
      style={{ borderColor: accent + "20" }}>
      <span className="text-[15px]">{member.firstName} {member.lastName}</span>
      <div className="flex gap-2">
        {(["confirmed", "rejected"] as const).map((status) => (
          <button key={status} type="button" onClick={() => onChange({ ...response, rsvpStatus: status })}
            className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all"
            style={{
              borderColor: response.rsvpStatus === status ? accent : accent + "30",
              backgroundColor: response.rsvpStatus === status ? (status === "confirmed" ? accent : "#c47a7a") : "transparent",
              color: response.rsvpStatus === status ? "white" : accent,
            }}>
            {status === "confirmed" ? <Check size={16} /> : <X size={16} />}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepGroup({ session, responses, setResponses, onNext, submitting, colors, fontTitle }: StepGroupProps) {
  const members  = session.group ? session.group.members : [session.guest];
  const isGroup  = !!session.group;
  const allRejected = responses.every((r) => r.rsvpStatus === "rejected");

  const update = (guestId: string, partial: Partial<GuestResponse>) => {
    setResponses(responses.map((r) => r.guestId === guestId ? { ...r, ...partial } : r));
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest opacity-40 mb-1">Paso 1 de 3</p>
      <h3 className="text-[22px] mb-1" style={{ fontFamily: fontTitle, fontStyle: "italic" }}>
        {isGroup ? "¿Quién asistirá?" : "¿Confirmas tu asistencia?"}
      </h3>
      <p className="text-[13px] opacity-50 mb-6">
        {isGroup ? "Indica si cada miembro de tu grupo podrá asistir" : "Nos encantaría verte allí"}
      </p>

      {isGroup ? (
        <div className="mb-8">
          {members.map((member) => {
            const resp = responses.find((r) => r.guestId === member.id);
            if (!resp) return null;
            return (
              <MemberRow key={member.id} member={member} response={resp}
                onChange={(r) => update(member.id, r)} accent={colors.accent} />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {(["confirmed", "rejected"] as const).map((status) => {
            const active = responses[0]?.rsvpStatus === status;
            return (
              <button key={status} type="button" onClick={() => update(session.guest.id, { rsvpStatus: status })}
                className="py-4 rounded-xl border-2 text-[15px] font-medium transition-all"
                style={{
                  borderColor: active ? colors.accent : colors.accent + "30",
                  backgroundColor: active ? colors.accent + "15" : "transparent",
                  color: active ? colors.text : colors.text + "80",
                }}>
                {status === "confirmed" ? "Confirmo asistencia" : "No podré ir"}
              </button>
            );
          })}
        </div>
      )}

      <button type="button" onClick={onNext} disabled={submitting}
        className="w-full py-3.5 rounded-xl text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        style={{ backgroundColor: colors.accent }}>
        {submitting
          ? <Loader2 size={16} className="animate-spin" />
          : <>{allRejected ? "Enviar respuesta" : "Siguiente"}<ChevronRight size={18} /></>}
      </button>
    </div>
  );
}
