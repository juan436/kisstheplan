import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface Step1Props {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  loading: boolean;
  onNext: () => void;
}

export function Step1({
  email, setEmail, password, setPassword, confirmPassword,
  setConfirmPassword, name, setName, loading, onNext,
}: Step1Props) {
  return (
    <Card variant="elevated" className="p-8 max-w-[500px] mx-auto">
      <h2 className="font-display text-[24px] text-text text-center mb-1">Crea tu cuenta</h2>
      <p className="text-[14px] text-brand text-center mb-8">Empieza a planificar en minutos</p>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-5">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" type="text" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
        </div>
        <div>
          <Label htmlFor="confirm">Confirmar contraseña</Label>
          <Input id="confirm" type="password" placeholder="Repite la contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
        </div>
        <Button type="submit" variant="cta" size="full" disabled={loading}>
          {loading ? "Creando cuenta..." : "Continuar"}
        </Button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[12px] text-brand">o</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Button variant="secondary" size="full" className="gap-3" disabled>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Registrarse con Google (próximamente)
      </Button>
    </Card>
  );
}
