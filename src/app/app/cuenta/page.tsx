import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { User } from "lucide-react";

export default function CuentaPage() {
  return (
    <ModulePlaceholder
      icon={User}
      title="Mi Cuenta"
      description="Gestiona tu perfil, suscripción y preferencias de notificaciones."
    />
  );
}
