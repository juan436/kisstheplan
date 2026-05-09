"use client";

import { Check, X, Pencil, UtensilsCrossed, AlertCircle, Bus } from "lucide-react";
import type { RsvpSession } from "./types";

interface RsvpSummaryProps {
  session: RsvpSession;
  colors: Record<string, string>;
  fontTitle: string;
  onModify: () => void;
}

function StatusBadge({ status, accent }: { status: string; accent: string }) {
  const confirmed = status === "confirmed";
  return (
    <span className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-0.5 rounded-full"
      style={{
        backgroundColor: confirmed ? accent + "20" : "#c47a7a20",
        color: confirmed ? accent : "#c47a7a",
      }}>
      {confirmed ? <Check size={11} /> : <X size={11} />}
      {confirmed ? "Confirmado" : "No asiste"}
    </span>
  );
}

function MemberCard({ member, accent }: {
  member: RsvpSession["guest"];
  accent: string;
}) {
  const confirmed = member.rsvpStatus === "confirmed";
  return (
    <div className="py-3 border-b last:border-0" style={{ borderColor: accent + "20" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] font-medium">{member.firstName} {member.lastName}</span>
        <StatusBadge status={member.rsvpStatus} accent={accent} />
      </div>
      {confirmed && (
        <div className="flex flex-wrap gap-3 text-[12px] opacity-60">
          {member.mealChoice && (
            <span className="flex items-center gap-1">
              <UtensilsCrossed size={11} />
              {member.mealChoice}
            </span>
          )}
          {member.allergies && (
            <span className="flex items-center gap-1">
              <AlertCircle size={11} />
              {member.allergies}
            </span>
          )}
          {member.transport && (
            <span className="flex items-center gap-1">
              <Bus size={11} />
              {member.transportPickupPoint || "Transporte solicitado"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function RsvpSummary({ session, colors, fontTitle, onModify }: RsvpSummaryProps) {
  const members = session.group ? session.group.members : [session.guest];
  const anyConfirmed = members.some((m) => m.rsvpStatus === "confirmed");

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: anyConfirmed ? colors.accent + "20" : "#c47a7a20" }}>
          {anyConfirmed
            ? <Check size={20} style={{ color: colors.accent }} />
            : <X size={20} style={{ color: "#c47a7a" }} />}
        </div>
        <div>
          <h3 className="text-[20px] leading-tight" style={{ fontFamily: fontTitle, fontStyle: "italic" }}>
            Ya tienes respuesta registrada
          </h3>
          <p className="text-[12px] opacity-50 mt-0.5">Puedes modificarla cuando quieras antes de la fecha límite</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl px-4 py-1" style={{ backgroundColor: colors.accent + "08" }}>
        {members.map((m) => (
          <MemberCard key={m.id} member={m} accent={colors.accent} />
        ))}
      </div>

      <button type="button" onClick={onModify}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 text-[14px] font-medium transition-all hover:opacity-80"
        style={{ borderColor: colors.accent, color: colors.accent }}>
        <Pencil size={15} />
        Modificar mi respuesta
      </button>
    </div>
  );
}
