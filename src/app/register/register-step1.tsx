import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/ui/google-button";

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
          <PasswordInput id="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
        </div>
        <div>
          <Label htmlFor="confirm">Confirmar contraseña</Label>
          <PasswordInput id="confirm" placeholder="Repite la contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
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

      <GoogleButton />
    </Card>
  );
}
