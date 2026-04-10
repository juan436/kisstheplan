import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Task, PaymentSchedule } from "@/types";
import { MONTHS_ES, DAYS_ES } from "../constants/calendar.constants";
import { toYMD } from "../helpers/calendar.helpers";

interface WeekViewProps {
  selectedDay: string;
  taskDays: Map<string, Task[]>; paymentDays: Map<string, PaymentSchedule[]>;
  onDayClick: (ymd: string) => void;
  onPrev: () => void; onNext: () => void;
}

export function WeekView({ selectedDay, taskDays, paymentDays, onDayClick, onPrev, onNext }: WeekViewProps) {
  const sel = new Date(selectedDay + "T00:00:00");
  const dow = (sel.getDay() + 6) % 7;
  const monday = new Date(sel);
  monday.setDate(sel.getDate() - dow);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { ymd: toYMD(d), label: DAYS_ES[i], num: d.getDate() };
  });

  const todayStr = toYMD(new Date());

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="w-7 h-7 rounded-full hover:bg-bg2 flex items-center justify-center text-brand"><ChevronLeft size={15} /></button>
        <span className="text-[13px] text-brand">{weekDays[0].num} — {weekDays[6].num} {MONTHS_ES[monday.getMonth()]}</span>
        <button onClick={onNext} className="w-7 h-7 rounded-full hover:bg-bg2 flex items-center justify-center text-brand"><ChevronRight size={15} /></button>
      </div>
      <div className="grid grid-cols-7 gap-2 flex-1">
        {weekDays.map(({ ymd, label, num }) => {
          const isToday = ymd === todayStr;
          const isSelected = ymd === selectedDay;
          const dayTasks = taskDays.get(ymd) || [];
          const dayPayments = paymentDays.get(ymd) || [];
          return (
            <button key={ymd} onClick={() => onDayClick(ymd)}
              className={`flex flex-col rounded-xl p-2 transition-all text-left ${isSelected ? "bg-bg3 ring-1 ring-border" : "hover:bg-bg2"}`}>
              <span className="text-[10px] font-bold text-brand uppercase tracking-wider">{label}</span>
              <span className="w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-medium mt-0.5 mb-2"
                style={isToday ? { backgroundColor: "#CBA978", color: "white" } : { color: "#4A3C32" }}>{num}</span>
              <div className="space-y-1 flex-1 overflow-hidden">
                {dayTasks.map((t) => (
                  <div key={t.id} className="text-[10px] text-text bg-[#D4BFB030] rounded px-1.5 py-0.5 truncate leading-tight">{t.title}</div>
                ))}
                {dayPayments.map((p) => (
                  <div key={p.id} className="text-[10px] text-text bg-[#CBA97825] rounded px-1.5 py-0.5 truncate leading-tight">{formatCurrency(p.amount)}</div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
