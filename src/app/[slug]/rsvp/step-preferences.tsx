"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RsvpSession, GuestResponse, GuestPublic } from "./types";
import { RsvpChips } from "./rsvp-chips";

interface StepPreferencesProps {
  session: RsvpSession;
  responses: GuestResponse[];
  setResponses: (r: GuestResponse[]) => void;
  onNext: () => void;
  onBack: () => void;
  colors: Record<string, string>;
  fontTitle: string;
}

function MemberPrefs({ member, response, onChange, mealOptions, allergyOptions, accent }: {
  member: GuestPublic;
  response: GuestResponse;
  onChange: (partial: Partial<GuestResponse>) => void;
  mealOptions: string[];
  allergyOptions: string[];
  accent: string;
}) {
  return (
    <div className="mb-6 pb-6 border-b last:border-0" style={{ borderColor: accent + "20" }}>
      <p className="text-[14px] font-semibold mb-4">{member.firstName} {member.lastName}</p>

      {mealOptions.length > 0 && (
        <div className="mb-4">
          <label className="block text-[11px] uppercase tracking-widest opacity-40 mb-2">Plato</label>
          <RsvpChips
            options={mealOptions}
            value={response.mealChoice || ""}
            onChange={(v) => onChange({ mealChoice: v || undefined })}
            accent={accent}
          />
        </div>
      )}

      <div>
        <label className="block text-[11px] uppercase tracking-widest opacity-40 mb-2">
          Alergias o restricciones
        </label>
        <RsvpChips
          options={allergyOptions}
          value={response.allergies || ""}
          onChange={(v) => onChange({ allergies: v || undefined })}
          allowCustom
          accent={accent}
        />
      </div>
    </div>
  );
}

export function StepPreferences({ session, responses, setResponses, onNext, onBack, colors, fontTitle }: StepPreferencesProps) {
  const allMembers = session.group ? session.group.members : [session.guest];
  const confirmed  = allMembers.filter((m) => responses.find((r) => r.guestId === m.id)?.rsvpStatus === "confirmed");

  const update = (guestId: string, partial: Partial<GuestResponse>) => {
    setResponses(responses.map((r) => r.guestId === guestId ? { ...r, ...partial } : r));
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest opacity-40 mb-1">Paso 2 de 3</p>
      <h3 className="text-[22px] mb-1" style={{ fontFamily: fontTitle, fontStyle: "italic" }}>Preferencias</h3>
      <p className="text-[13px] opacity-50 mb-6">Indícanos tus opciones de menú y posibles alergias</p>

      <div className="mb-6">
        {confirmed.map((member) => {
          const resp = responses.find((r) => r.guestId === member.id);
          if (!resp) return null;
          return (
            <MemberPrefs key={member.id} member={member} response={resp}
              onChange={(partial) => update(member.id, partial)}
              mealOptions={session.wedding.mealOptions}
              allergyOptions={session.wedding.allergyOptions}
              accent={colors.accent} />
          );
        })}
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl border-2 text-[14px] font-medium hover:opacity-70 transition-opacity"
          style={{ borderColor: colors.accent + "40" }}>
          <ChevronLeft size={18} />Atrás
        </button>
        <button type="button" onClick={onNext}
          className="flex-1 py-3.5 rounded-xl text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: colors.accent }}>
          Siguiente <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
