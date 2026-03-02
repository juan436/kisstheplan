import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { UserPlus } from "lucide-react";

export default function ColaboradoresPage() {
  return (
    <ModulePlaceholder
      icon={UserPlus}
      title="Colaboradores"
      description="Invita a tu pareja o wedding planner para que colaboren contigo en la planificación."
    />
  );
}
