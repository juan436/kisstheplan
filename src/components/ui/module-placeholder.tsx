import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface ModulePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ModulePlaceholder({
  icon: Icon,
  title,
  description,
}: ModulePlaceholderProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <Card variant="elevated" className="text-center max-w-[400px] py-10 px-8">
        <Icon size={48} className="text-cta mx-auto mb-4" />
        <h2 className="font-display text-[24px] text-text mb-2">{title}</h2>
        <p className="text-[14px] text-brand mb-5 leading-relaxed">{description}</p>
        <Badge>Próximamente</Badge>
      </Card>
    </div>
  );
}
