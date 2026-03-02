import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { CheckSquare } from "lucide-react";

export default function TareasPage() {
  return (
    <ModulePlaceholder
      icon={CheckSquare}
      title="To Do List"
      description="Gestiona todas las tareas de tu boda. Asigna, prioriza y marca como completadas."
    />
  );
}
