import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { Task } from "@/types";

interface TasksPanelProps {
  tasks: Task[];
}

function timeRemaining(dueDate?: string, stage?: string): { label: string; urgent: boolean } {
  if (dueDate) {
    const diff = Math.ceil(
      (new Date(dueDate + "T12:00:00").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (diff < 0) return { label: "Vencida", urgent: true };
    if (diff === 0) return { label: "Hoy", urgent: true };
    if (diff === 1) return { label: "Mañana", urgent: true };
    if (diff <= 7) return { label: `${diff} días`, urgent: true };
    if (diff <= 30) return { label: `${Math.ceil(diff / 7)} semanas`, urgent: false };
    if (diff <= 60) return { label: "1 mes", urgent: false };
    return { label: `${Math.floor(diff / 30)} meses`, urgent: false };
  }
  if (stage) return { label: stage, urgent: false };
  return { label: "—", urgent: false };
}

export function TasksPanel({ tasks }: TasksPanelProps) {
  if (tasks.length === 0) return null;

  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      {/* Header fijo */}
      <div className="px-4 pt-4 pb-3 border-b border-border/50 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-accent uppercase tracking-[1px]">
            Próximas tareas
          </h3>
          <span className="text-[11px] text-brand font-medium">
            {tasks.length} pendiente{tasks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Lista scrollable */}
      <div className="overflow-y-auto max-h-[132px] px-4 py-3 space-y-3 scrollbar-thin">
        {tasks.map((task) => {
          const { label, urgent } = timeRemaining(task.dueDate, task.stage);
          const done = task.status === "done";

          return (
            <div key={task.id} className="flex items-center gap-2.5">
              {/* Checkbox no interactivo */}
              <div
                className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                style={{
                  borderColor: done ? "var(--color-accent)" : "var(--color-border)",
                  background: done ? "var(--color-accent)" : "transparent",
                }}
              >
                {done && <Check size={8} className="text-white" strokeWidth={3} />}
              </div>

              {/* Título */}
              <p
                className="flex-1 text-[13px] leading-tight truncate"
                style={{
                  color: done ? "var(--color-brand)" : "var(--color-text)",
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                {task.title}
              </p>

              {/* Tiempo restante */}
              <span
                className="text-[11px] shrink-0 font-medium"
                style={{
                  color: urgent ? "var(--color-danger)" : "var(--color-brand)",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
