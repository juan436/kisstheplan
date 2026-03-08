import { ModulePlaceholder } from "@/components/ui/module-placeholder";
import { StickyNote } from "lucide-react";

export default function NotasPage() {
  return (
    <ModulePlaceholder
      icon={StickyNote}
      title="Notas"
      description="Apunta ideas, recordatorios e inspiración. Tu cuaderno digital para la boda."
    />
  );
}
