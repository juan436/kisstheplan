import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  mode: "invite" | "manual";
  setMode: (m: "invite" | "manual") => void;
  inviteEmail: string;
  setInviteEmail: (v: string) => void;
  inviteError: string;
  setInviteError: (v: string) => void;
  inviting: boolean;
  handleInvite: () => void;
  manualName: string;
  setManualName: (v: string) => void;
  manualEmail: string;
  setManualEmail: (v: string) => void;
  manualPassword: string;
  setManualPassword: (v: string) => void;
  manualError: string;
  setManualError: (v: string) => void;
  creating: boolean;
  handleCreateManual: () => void;
}

export function AddCollaboratorForm(p: Props) {
  return (
    <div>
      <p className="text-[11px] text-text/40 uppercase tracking-widest mb-4">
        Añadir colaborador
      </p>

      <div className="flex gap-1 bg-[#f2efe9] rounded-xl p-1 mb-6">
        <button
          onClick={() => p.setMode("invite")}
          className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-all ${
            p.mode === "invite" ? "bg-white text-text shadow-sm" : "text-text/40 hover:text-text/60"
          }`}
        >
          Invitar por email
        </button>
        <button
          onClick={() => p.setMode("manual")}
          className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-all ${
            p.mode === "manual" ? "bg-white text-text shadow-sm" : "text-text/40 hover:text-text/60"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      {p.mode === "invite" && (
        <div className="space-y-4">
          <p className="text-[12px] text-text/50 leading-relaxed">
            Le llegará un email con un enlace para que acepte la invitación y cree o vincule su cuenta.
          </p>
          <Input
            type="email"
            placeholder="Email del colaborador"
            value={p.inviteEmail}
            onChange={(e) => { p.setInviteEmail(e.target.value); p.setInviteError(""); }}
            onKeyDown={(e) => e.key === "Enter" && p.handleInvite()}
            className="bg-[#f2efe9] border-none h-12 rounded-xl text-text"
          />
          {p.inviteError && <p className="text-[12px] text-danger">{p.inviteError}</p>}
          <div className="flex justify-end">
            <Button
              onClick={p.handleInvite}
              disabled={p.inviting}
              className="px-8 py-4 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              <span className="text-[13px] font-bold tracking-[2px] uppercase">
                {p.inviting ? "Enviando..." : "Invitar"}
              </span>
            </Button>
          </div>
        </div>
      )}

      {p.mode === "manual" && (
        <div className="space-y-4">
          <p className="text-[12px] text-text/50 leading-relaxed">
            Crea tú mismo las credenciales y compártelas con el colaborador.
          </p>
          <Input
            placeholder="Nombre"
            value={p.manualName}
            onChange={(e) => { p.setManualName(e.target.value); p.setManualError(""); }}
            className="bg-[#f2efe9] border-none h-12 rounded-xl text-text"
          />
          <Input
            type="email"
            placeholder="Email"
            value={p.manualEmail}
            onChange={(e) => { p.setManualEmail(e.target.value); p.setManualError(""); }}
            className="bg-[#f2efe9] border-none h-12 rounded-xl text-text"
          />
          <Input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={p.manualPassword}
            onChange={(e) => { p.setManualPassword(e.target.value); p.setManualError(""); }}
            onKeyDown={(e) => e.key === "Enter" && p.handleCreateManual()}
            className="bg-[#f2efe9] border-none h-12 rounded-xl text-text"
          />
          {p.manualError && <p className="text-[12px] text-danger">{p.manualError}</p>}
          <div className="flex justify-end">
            <Button
              onClick={p.handleCreateManual}
              disabled={p.creating}
              className="px-8 py-4 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              <span className="text-[13px] font-bold tracking-[2px] uppercase">
                {p.creating ? "Creando..." : "Crear cuenta"}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
