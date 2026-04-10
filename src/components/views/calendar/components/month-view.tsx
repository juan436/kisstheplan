import type { Task, PaymentSchedule } from "@/types";
import { DAYS_ES } from "../constants/calendar.constants";
import { getDaysInMonth, firstDayOfMonth } from "../helpers/calendar.helpers";

interface MonthViewProps {
  year: number; month: number; today: string; selectedDay: string;
  taskDays: Map<string, Task[]>; paymentDays: Map<string, PaymentSchedule[]>;
  onDayClick: (ymd: string) => void;
}

export function MonthView({ year, month, today, selectedDay, taskDays, paymentDays, onDayClick }: MonthViewProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);

  const cells: { ymd: string; current: boolean }[] = [];
  for (let i = 0; i < firstDay; i++) {
    const d = daysInPrevMonth - firstDay + 1 + i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ ymd: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ ymd: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    cells.push({ ymd: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, current: false });
  }

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="grid grid-cols-7 mb-2">
        {DAYS_ES.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-brand uppercase tracking-wider py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: "repeat(6, 1fr)" }}>
        {cells.map((cell, i) => {
          const dayNum = cell.ymd.slice(8);
          const isToday = cell.ymd === today;
          const isSelected = cell.ymd === selectedDay;
          const hasTasks = taskDays.has(cell.ymd);
          const hasPayments = paymentDays.has(cell.ymd);
          return (
            <button key={i} onClick={() => onDayClick(cell.ymd)}
              className={`relative flex flex-col items-center p-1 rounded-xl transition-all group ${!cell.current ? "opacity-30" : "hover:bg-bg2"} ${isSelected && cell.current ? "bg-bg3" : ""}`}>
              <span className={`w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-medium transition-all ${isToday ? "text-white font-bold" : "text-text"}`}
                style={isToday ? { backgroundColor: "#CBA978" } : undefined}>
                {dayNum.startsWith("0") ? dayNum.slice(1) : dayNum}
              </span>
              {(hasTasks || hasPayments) && (
                <div className="flex gap-0.5 mt-0.5">
                  {hasTasks    && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#D4BFB0" }} />}
                  {hasPayments && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#CBA978" }} />}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 pt-3 border-t border-border mt-2">
        <span className="flex items-center gap-1.5 text-[11px] text-brand"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#D4BFB0" }} />Tareas</span>
        <span className="flex items-center gap-1.5 text-[11px] text-brand"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#CBA978" }} />Pagos</span>
      </div>
    </div>
  );
}
