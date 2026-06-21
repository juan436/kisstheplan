import { CheckCircle, Clock } from "lucide-react";
import type { Collaborator } from "@/types";

interface Props {
  collaborator: Collaborator;
  onRevoke: (id: string) => void;
}

export function CollaboratorCard({ collaborator: c, onRevoke }: Props) {
  return (
    <div className="flex items-center justify-between bg-[#f2efe9] rounded-xl px-4 py-3">
      <div className="flex items-center gap-3">
        {c.status === "accepted" ? (
          <CheckCircle size={15} className="text-success shrink-0" />
        ) : (
          <Clock size={15} className="text-text/30 shrink-0" />
        )}
        <div>
          <p className="text-[13px] text-text font-medium">{c.email}</p>
          <p className="text-[11px] text-text/40">
            {c.status === "accepted" ? "Acceso activo" : "Invitación pendiente"}
          </p>
        </div>
      </div>
      <button
        onClick={() => onRevoke(c.id)}
        className="text-[12px] text-[#866857] hover:text-danger transition-colors font-medium shrink-0"
      >
        Eliminar acceso
      </button>
    </div>
  );
}
