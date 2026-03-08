import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { Store } from "lucide-react";

export default function ProveedoresPage() {
  return (
    <ModulePlaceholder
      icon={Store}
      title="Proveedores"
      description="Tu directorio de proveedores con contactos, presupuestos y estado de contratación."
    />
  );
}
