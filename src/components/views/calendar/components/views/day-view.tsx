import { ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Task, PaymentSchedule } from "@/types";
import { toYMD } from "../../helpers/calendar.helpers";

interface DayViewProps {
  day: string; tasks: Task[]; payments: PaymentSchedule[];
  onAddTask: () => void; onPrev: () => void; onNext: () => void;
}

export function DayView({ day, tasks, payments, onAddTask, onPrev, onNext }: DayViewProps) {
  const d = new Date(day + "T00:00:00");
  const isToday = day === toYMD(new Date());
  const formatted = d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onPrev} className="w-8 h-8 rounded-full hover:bg-bg2 flex items-center justify-center text-brand"><ChevronLeft size={16} /></button>
        <div className="text-center">
          <p className="font-display text-[22px] italic" style={isToday ? { color: "#CBA978" } : { color: "var(--color-text)" }}>{d.getDate()}</p>
          <p className="text-[13px] text-brand capitalize">{formatted.split(",").slice(0).join(",")}</p>
        </div>
        <button onClick={onNext} className="w-8 h-8 rounded-full hover:bg-bg2 flex items-center justify-center text-brand"><ChevronRight size={16} /></button>
      </div>

      {tasks.length === 0 && payments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-[14px] text-brand">Sin eventos este día</p>
          <button onClick={onAddTask} className="flex items-center gap-1.5 text-[12px] font-medium text-white px-4 py-2 rounded-full" style={{ backgroundColor: "#866857" }}>
            <Plus size={13} />Añadir tarea
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {tasks.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-2">Tareas</p>
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2"
                  style={{ backgroundColor: "#D4BFB020", borderLeft: "3px solid #D4BFB0" }}>
                  <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                    style={{ borderColor: t.status === "done" ? "#4A773C" : "#D4C9B8", backgroundColor: t.status === "done" ? "#4A773C" : "transparent" }}>
                    {t.status === "done" && <Check size={9} className="text-white" />}
                  </div>
                  <div>
                    <p className={`text-[13px] font-medium ${t.status === "done" ? "line-through text-brand" : "text-text"}`}>{t.title}</p>
                    {t.category && <p className="text-[11px] text-brand">{t.category}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {payments.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-2">Pagos</p>
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3 rounded-xl mb-2"
                  style={{ backgroundColor: "#CBA97815", borderLeft: "3px solid #CBA978" }}>
                  <div>
                    <p className="text-[13px] font-medium text-text">{p.vendorName}</p>
                    {p.concept && <p className="text-[11px] text-brand">{p.concept}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-semibold text-cta">{formatCurrency(p.amount)}</p>
                    {p.paid && <p className="text-[10px] text-[#4A773C]">Pagado</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
