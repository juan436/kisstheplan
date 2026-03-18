import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ModulePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  showBackToDashboard?: boolean;
}

export function ModulePlaceholder({
  icon: Icon,
  title,
  description,
  showBackToDashboard = false,
}: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <Card variant="elevated" className="text-center max-w-[400px] py-10 px-8">
        <Icon size={48} className="text-cta mx-auto mb-4" />
        <h2 className="font-display text-[24px] text-text mb-2">{title}</h2>
        <p className="text-[14px] text-brand mb-5 leading-relaxed">{description}</p>
        <Badge>Próximamente</Badge>
      </Card>
      {showBackToDashboard && (
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-2 text-[13px] text-accent hover:text-cta transition-colors no-underline font-medium"
        >
          <ArrowLeft size={16} />
          Volver al dashboard
        </Link>
      )}
    </div>
  );
}
