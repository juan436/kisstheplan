import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { HelpCircle } from "lucide-react";

export default function AyudaPage() {
  return (
    <ModulePlaceholder
      icon={HelpCircle}
      title="Ayuda"
      description="Guías, tutoriales y preguntas frecuentes para sacar el máximo partido a KissthePlan."
    />
  );
}
