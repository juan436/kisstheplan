import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { FileText } from "lucide-react";

export default function GuionPage() {
  return (
    <ModulePlaceholder
      icon={FileText}
      title="Guión del Día"
      description="Planifica el timeline completo de tu boda: ceremonias, discursos, bailes y más."
    />
  );
}
