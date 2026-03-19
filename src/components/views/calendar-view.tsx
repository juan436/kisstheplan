"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, Plus, Copy, Check,
  CalendarDays, CreditCard, Link2,
} from "lucide-react";
import type { Task, PaymentSchedule } from "@/types";
import type { CreateTaskData } from "@/services/api";

/* ─── Helpers ─────────────────────────────────────────────────── */

const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAYS_ES = ["L", "M", "X", "J", "V", "S", "D"];

function toYMD(date: Date) {
  return date.toISOString().split("T")[0];
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns 0=Mon … 6=Sun for first day of month */
function firstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay(); // 0=Sun
  return (d + 6) % 7; // convert to Mon=0
}

type ViewMode = "month" | "week" | "day";

/* ─── Component ───────────────────────────────────────────────── */

export default function CalendarioPage() {
  const { wedding } = useAuth();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDay, setSelectedDay] = useState<string>(toYMD(today));
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<PaymentSchedule[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [addTaskDate, setAddTaskDate] = useState<string>("");
  const [copiedIcal, setCopiedIcal] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // tasks with dueDate only (for calendar grid)
  const tasks = allTasks.filter((x) => x.dueDate);

  const load = useCallback(async () => {
    try {
      setLoadError(null);
      const [t, p] = await Promise.all([
        api.getTasks(),
        api.getPayments(),
      ]);
      setAllTasks(t);
      setPayments(p.filter((x) => x.dueDate));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Error cargando datos");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* Build event maps keyed by YYYY-MM-DD */
  const taskDays = new Map<string, Task[]>();
  for (const t of tasks) {
    if (!t.dueDate) continue;
    const k = t.dueDate.slice(0, 10);
    if (!taskDays.has(k)) taskDays.set(k, []);
    taskDays.get(k)!.push(t);
  }

  const paymentDays = new Map<string, PaymentSchedule[]>();
  for (const p of payments) {
    if (!p.dueDate) continue;
    const k = p.dueDate.slice(0, 10);
    if (!paymentDays.has(k)) paymentDays.set(k, []);
    paymentDays.get(k)!.push(p);
  }

  /* Upcoming (sidebar) */
  const todayStr = toYMD(today);
  // Show unpaid payments: overdue first (sorted asc so oldest overdue is top), then upcoming
  const overduePayments = [...payments]
    .filter((p) => p.dueDate < todayStr && !p.paid)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const futurePayments = [...payments]
    .filter((p) => p.dueDate >= todayStr && !p.paid)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const upcomingPayments = [...overduePayments, ...futurePayments].slice(0, 4);

  // Sidebar: tasks with future date first, then tasks with no date, exclude done
  const upcomingTasks = [
    ...allTasks
      .filter((t) => t.dueDate && t.dueDate >= todayStr && t.status !== "done")
      .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!)),
    ...allTasks
      .filter((t) => !t.dueDate && t.status !== "done")
      .slice(0, 3),
  ].slice(0, 5);

  /* iCal URL */
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const icalUrl = `${apiBase}/calendar/ical/${wedding?.slug || "boda"}`;

  const handleCopyIcal = () => {
    navigator.clipboard.writeText(icalUrl);
    setCopiedIcal(true);
    setTimeout(() => setCopiedIcal(false), 2000);
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const handleDayClick = (ymd: string) => {
    setSelectedDay(ymd);
    if (viewMode === "month") setViewMode("day");
  };

  const handleAddTaskFromDay = (ymd: string) => {
    setAddTaskDate(ymd);
    setShowAddTask(true);
  };

  return (
    <div className="flex flex-col gap-4 max-w-[1300px] mx-auto" style={{ minHeight: "calc(100vh - 160px)" }}>
      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-2.5 rounded-xl">
          Error cargando datos: {loadError}
        </div>
      )}
    <div className="flex gap-5 flex-1">

      {/* ── MAIN CALENDAR ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <Button
            variant="primary"
            size="sm"
            className="gap-1.5"
            style={{ backgroundColor: "#866857" }}
            onClick={() => { setAddTaskDate(""); setShowAddTask(true); }}
          >
            <Plus size={14} />
            Añadir tarea
          </Button>

          {/* Month nav + view toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="w-7 h-7 rounded-full hover:bg-bg2 flex items-center justify-center text-brand transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="font-display text-[18px] italic text-text min-w-[180px] text-center">
                {MONTHS_ES[month]} {year}
              </span>
              <button onClick={nextMonth} className="w-7 h-7 rounded-full hover:bg-bg2 flex items-center justify-center text-brand transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* View options */}
            <div className="flex items-center bg-bg2 rounded-lg p-0.5 border border-border">
              {(["month", "week", "day"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all capitalize ${
                    viewMode === v ? "bg-white shadow-sm text-text" : "text-brand hover:text-text"
                  }`}
                >
                  {v === "month" ? "Mes" : v === "week" ? "Semana" : "Día"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar body */}
        <div className="bg-white rounded-2xl shadow-card flex-1 overflow-hidden">
          {viewMode === "month" && (
            <MonthView
              year={year}
              month={month}
              today={todayStr}
              selectedDay={selectedDay}
              taskDays={taskDays}
              paymentDays={paymentDays}
              onDayClick={handleDayClick}
            />
          )}
          {viewMode === "week" && (
            <WeekView
              selectedDay={selectedDay}
              taskDays={taskDays}
              paymentDays={paymentDays}
              onDayClick={handleDayClick}
              onPrev={() => {
                const d = new Date(selectedDay);
                d.setDate(d.getDate() - 7);
                setSelectedDay(toYMD(d));
                setMonth(d.getMonth());
                setYear(d.getFullYear());
              }}
              onNext={() => {
                const d = new Date(selectedDay);
                d.setDate(d.getDate() + 7);
                setSelectedDay(toYMD(d));
                setMonth(d.getMonth());
                setYear(d.getFullYear());
              }}
            />
          )}
          {viewMode === "day" && (
            <DayView
              day={selectedDay}
              tasks={taskDays.get(selectedDay) || []}
              payments={paymentDays.get(selectedDay) || []}
              onAddTask={() => handleAddTaskFromDay(selectedDay)}
              onPrev={() => {
                const d = new Date(selectedDay);
                d.setDate(d.getDate() - 1);
                setSelectedDay(toYMD(d));
                setMonth(d.getMonth());
                setYear(d.getFullYear());
              }}
              onNext={() => {
                const d = new Date(selectedDay);
                d.setDate(d.getDate() + 1);
                setSelectedDay(toYMD(d));
                setMonth(d.getMonth());
                setYear(d.getFullYear());
              }}
            />
          )}
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4">

        {/* Upcoming payments */}
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={14} className="text-cta" />
            <span className="text-[12px] font-bold text-brand uppercase tracking-wider">Próximos pagos</span>
          </div>
          {upcomingPayments.length === 0 ? (
            <p className="text-[12px] text-brand text-center py-3">Sin pagos próximos</p>
          ) : (
            <div className="space-y-2.5">
              {upcomingPayments.map((p) => {
                const isOverdue = p.dueDate < todayStr;
                return (
                  <div key={p.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-text truncate">
                        {p.vendorName || p.concept || "Pago"}
                      </p>
                      <p className={`text-[11px] font-medium ${isOverdue ? "text-red-500" : "text-brand"}`}>
                        {isOverdue ? "⚠ " : ""}
                        {new Date(p.dueDate + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                        {isOverdue ? " (vencido)" : ""}
                      </p>
                    </div>
                    <span className="text-[12px] font-semibold text-cta flex-shrink-0">{formatCurrency(p.amount)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming tasks */}
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={14} style={{ color: "#866857" }} />
            <span className="text-[12px] font-bold text-brand uppercase tracking-wider">Próximas tareas</span>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-[12px] text-brand text-center py-3">Sin tareas próximas</p>
          ) : (
            <div className="space-y-2.5">
              {upcomingTasks.map((t) => (
                <div key={t.id} className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: "#D4BFB0" }}
                  />
                  <div className="min-w-0">
                    <p className="text-[12px] text-text leading-tight truncate">{t.title}</p>
                    {t.dueDate && (
                      <p className="text-[11px] text-brand">
                        {new Date(t.dueDate + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* iCal sync */}
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 size={14} className="text-brand" />
            <span className="text-[12px] font-bold text-brand uppercase tracking-wider">Sincronizar</span>
          </div>
          <p className="text-[11px] text-brand mb-3 leading-relaxed">
            Añade tus eventos a Google Calendar, Apple Calendar u Outlook.
          </p>
          <button
            onClick={handleCopyIcal}
            className="w-full flex items-center justify-center gap-1.5 text-[12px] font-medium text-white py-2 rounded-lg transition-all"
            style={{ backgroundColor: copiedIcal ? "#4A773C" : "#8c6f5f" }}
          >
            {copiedIcal ? <Check size={13} /> : <Copy size={13} />}
            {copiedIcal ? "¡Copiado!" : "Copiar enlace iCal"}
          </button>
          <p className="text-[10px] text-brand mt-2 break-all opacity-60">{icalUrl}</p>
        </div>

      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTaskModal
          initialDate={addTaskDate}
          onClose={() => setShowAddTask(false)}
          onCreated={() => { setShowAddTask(false); load(); }}
        />
      )}
    </div>
    </div>
  );
}

/* ─── Month View ──────────────────────────────────────────────── */

function MonthView({
  year, month, today, selectedDay, taskDays, paymentDays, onDayClick,
}: {
  year: number;
  month: number;
  today: string;
  selectedDay: string;
  taskDays: Map<string, Task[]>;
  paymentDays: Map<string, PaymentSchedule[]>;
  onDayClick: (ymd: string) => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);

  // Build grid cells: 6 rows × 7 cols = 42 cells
  const cells: { ymd: string; current: boolean }[] = [];

  for (let i = 0; i < firstDay; i++) {
    const d = daysInPrevMonth - firstDay + 1 + i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ ymd: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      ymd: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      current: true,
    });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    cells.push({ ymd: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, current: false });
  }

  return (
    <div className="p-5 h-full flex flex-col">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_ES.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-brand uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: "repeat(6, 1fr)" }}>
        {cells.map((cell, i) => {
          const dayNum = cell.ymd.slice(8);
          const isToday = cell.ymd === today;
          const isSelected = cell.ymd === selectedDay;
          const hasTasks = taskDays.has(cell.ymd);
          const hasPayments = paymentDays.has(cell.ymd);

          return (
            <button
              key={i}
              onClick={() => onDayClick(cell.ymd)}
              className={`relative flex flex-col items-center p-1 rounded-xl transition-all group ${
                !cell.current ? "opacity-30" : "hover:bg-bg2"
              } ${isSelected && cell.current ? "bg-bg3" : ""}`}
            >
              {/* Day number */}
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-medium transition-all ${
                  isToday
                    ? "text-white font-bold"
                    : isSelected
                    ? "text-text"
                    : "text-text"
                }`}
                style={isToday ? { backgroundColor: "#CBA978" } : undefined}
              >
                {dayNum.startsWith("0") ? dayNum.slice(1) : dayNum}
              </span>

              {/* Event dots */}
              {(hasTasks || hasPayments) && (
                <div className="flex gap-0.5 mt-0.5">
                  {hasTasks && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#D4BFB0" }} />
                  )}
                  {hasPayments && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#CBA978" }} />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-3 border-t border-border mt-2">
        <span className="flex items-center gap-1.5 text-[11px] text-brand">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#D4BFB0" }} />
          Tareas
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-brand">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#CBA978" }} />
          Pagos
        </span>
      </div>
    </div>
  );
}

/* ─── Week View ───────────────────────────────────────────────── */

function WeekView({
  selectedDay, taskDays, paymentDays, onDayClick, onPrev, onNext,
}: {
  selectedDay: string;
  taskDays: Map<string, Task[]>;
  paymentDays: Map<string, PaymentSchedule[]>;
  onDayClick: (ymd: string) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  // Get Monday of selected week
  const sel = new Date(selectedDay + "T00:00:00");
  const dow = (sel.getDay() + 6) % 7; // Mon=0
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
      {/* Week nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="w-7 h-7 rounded-full hover:bg-bg2 flex items-center justify-center text-brand">
          <ChevronLeft size={15} />
        </button>
        <span className="text-[13px] text-brand">
          {weekDays[0].num} — {weekDays[6].num} {MONTHS_ES[monday.getMonth()]}
        </span>
        <button onClick={onNext} className="w-7 h-7 rounded-full hover:bg-bg2 flex items-center justify-center text-brand">
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {weekDays.map(({ ymd, label, num }) => {
          const isToday = ymd === todayStr;
          const isSelected = ymd === selectedDay;
          const dayTasks = taskDays.get(ymd) || [];
          const dayPayments = paymentDays.get(ymd) || [];

          return (
            <button
              key={ymd}
              onClick={() => onDayClick(ymd)}
              className={`flex flex-col rounded-xl p-2 transition-all text-left ${
                isSelected ? "bg-bg3 ring-1 ring-border" : "hover:bg-bg2"
              }`}
            >
              <span className="text-[10px] font-bold text-brand uppercase tracking-wider">{label}</span>
              <span
                className="w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-medium mt-0.5 mb-2"
                style={isToday ? { backgroundColor: "#CBA978", color: "white" } : { color: "#4A3C32" }}
              >
                {num}
              </span>
              <div className="space-y-1 flex-1 overflow-hidden">
                {dayTasks.map((t) => (
                  <div key={t.id} className="text-[10px] text-text bg-[#D4BFB030] rounded px-1.5 py-0.5 truncate leading-tight">
                    {t.title}
                  </div>
                ))}
                {dayPayments.map((p) => (
                  <div key={p.id} className="text-[10px] text-text bg-[#CBA97825] rounded px-1.5 py-0.5 truncate leading-tight">
                    {formatCurrency(p.amount)}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Day View ────────────────────────────────────────────────── */

function DayView({
  day, tasks, payments, onAddTask, onPrev, onNext,
}: {
  day: string;
  tasks: Task[];
  payments: PaymentSchedule[];
  onAddTask: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const d = new Date(day + "T00:00:00");
  const todayStr = toYMD(new Date());
  const isToday = day === todayStr;

  const formatted = d.toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Day nav */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onPrev} className="w-8 h-8 rounded-full hover:bg-bg2 flex items-center justify-center text-brand">
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <p className={`font-display text-[22px] italic ${isToday ? "" : "text-text"}`}
            style={isToday ? { color: "#CBA978" } : undefined}>
            {d.getDate()}
          </p>
          <p className="text-[13px] text-brand capitalize">{formatted.split(",").slice(0).join(",")}</p>
        </div>
        <button onClick={onNext} className="w-8 h-8 rounded-full hover:bg-bg2 flex items-center justify-center text-brand">
          <ChevronRight size={16} />
        </button>
      </div>

      {tasks.length === 0 && payments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-[14px] text-brand">Sin eventos este día</p>
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 text-[12px] font-medium text-white px-4 py-2 rounded-full"
            style={{ backgroundColor: "#866857" }}
          >
            <Plus size={13} />
            Añadir tarea
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {tasks.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-2">Tareas</p>
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2"
                  style={{ backgroundColor: "#D4BFB020", borderLeft: "3px solid #D4BFB0" }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                    style={{
                      borderColor: t.status === "done" ? "#4A773C" : "#D4C9B8",
                      backgroundColor: t.status === "done" ? "#4A773C" : "transparent",
                    }}
                  >
                    {t.status === "done" && <Check size={9} className="text-white" />}
                  </div>
                  <div>
                    <p className={`text-[13px] font-medium ${t.status === "done" ? "line-through text-brand" : "text-text"}`}>
                      {t.title}
                    </p>
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
                <div
                  key={p.id}
                  className="flex items-center justify-between px-4 py-3 rounded-xl mb-2"
                  style={{ backgroundColor: "#CBA97815", borderLeft: "3px solid #CBA978" }}
                >
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

/* ─── Add Task Modal ──────────────────────────────────────────── */

function AddTaskModal({
  initialDate,
  onClose,
  onCreated,
}: {
  initialDate: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(initialDate);
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    const data: CreateTaskData = {
      title: title.trim(),
      dueDate: dueDate || undefined,
      category: category.trim() || undefined,
    };
    await api.createTask(data);
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(74,60,50,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-elevated w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-[20px] italic text-text mb-5">Nueva tarea</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-1">Tarea</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="¿Qué hay que hacer?"
              className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-cta transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-1">Fecha</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-cta transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-1">Categoría (opcional)</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Catering, Flores..."
              className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-cta transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button
            variant="cta"
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex-1"
          >
            {saving ? "Guardando..." : "Añadir"}
          </Button>
        </div>
      </div>
    </div>
  );
}
