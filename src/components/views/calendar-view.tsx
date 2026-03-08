import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { Calendar } from "lucide-react";

export default function CalendarioPage() {
  return (
    <ModulePlaceholder
      icon={Calendar}
      title="Calendario"
      description="Visualiza todas las fechas clave: reuniones, pagos, pruebas y el gran día."
    />
  );
}
