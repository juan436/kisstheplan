import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface TasksPanelProps {
  tasks: Task[];
}

export function TasksPanel({ tasks }: TasksPanelProps) {
  return (
    <Card>
      <h3 className="text-[11px] font-bold text-accent uppercase tracking-[1px] mb-4">
        Próximas tareas
      </h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3">
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center",
                task.status === "done"
                  ? "bg-cta border-cta"
                  : "border-border"
              )}
            >
              {task.status === "done" && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-[13px] leading-tight",
                  task.status === "done"
                    ? "text-brand line-through"
                    : "text-text"
                )}
              >
                {task.title}
              </p>
              {task.dueDate && (
                <p className="text-[11px] text-brand mt-0.5">
                  {new Date(task.dueDate).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
