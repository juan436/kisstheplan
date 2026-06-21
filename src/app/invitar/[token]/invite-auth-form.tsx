import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CollaboratorInviteInfo } from "@/types";
import type { AuthMode } from "./use-invite-accept";

function GoogleSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

interface Props {
  info: CollaboratorInviteInfo;
  authMode: AuthMode;
  setAuthMode: (m: AuthMode) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  error: string;
  submitting: boolean;
  handleAuth: () => void;
  handleGoogleLogin: () => void;
}

export function InviteAuthForm({ info, authMode, setAuthMode, email, setEmail, password, setPassword, name, setName, error, submitting, handleAuth, handleGoogleLogin }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] text-text/40 uppercase tracking-widest mb-2">Invitación</p>
        <h1 className="font-display text-[22px] text-text mb-4">
          {info.partner1Name} & {info.partner2Name}
        </h1>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setAuthMode("login")}
          className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors ${authMode === "login" ? "bg-[#f2efe9] text-text" : "text-text/40 hover:text-text"}`}
        >
          Ya tengo cuenta
        </button>
        <button
          onClick={() => setAuthMode("register")}
          className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors ${authMode === "register" ? "bg-[#f2efe9] text-text" : "text-text/40 hover:text-text"}`}
        >
          Crear cuenta
        </button>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 bg-white border border-border rounded-xl h-12 text-[13px] text-text font-medium hover:bg-bg2 transition-colors"
      >
        <GoogleSvg />
        Continuar con Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-text/30">o con email</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {authMode === "register" && (
        <Input
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#f2efe9] border-none h-12 rounded-xl"
        />
      )}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-[#f2efe9] border-none h-12 rounded-xl"
      />
      <Input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAuth()}
        className="bg-[#f2efe9] border-none h-12 rounded-xl"
      />

      {error && <p className="text-[12px] text-danger">{error}</p>}

      <Button
        onClick={handleAuth}
        disabled={submitting}
        className="w-full py-4 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl font-bold tracking-widest uppercase text-[13px]"
      >
        {submitting ? "Entrando..." : authMode === "login" ? "Entrar y aceptar" : "Registrarme y aceptar"}
      </Button>
    </div>
  );
}
