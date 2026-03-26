"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, Copy, Check, CalendarDays, CreditCard, Link2 } from "lucide-react";
import type { ViewMode } from "./helpers/calendar.helpers";
import { MonthView } from "./components/month-view";
import { WeekView } from "./components/week-view";
import { DayView } from "./components/day-view";
import { AddTaskModal } from "./components/add-task-modal";
import { useCalendar } from "./hooks/use-calendar";

export default function CalendarioPage() {
  const {
    year, month, viewMode, setViewMode, selectedDay, todayStr,
    taskDays, paymentDays, upcomingPayments, upcomingTasks,
    showAddTask, setShowAddTask, addTaskDate, setAddTaskDate,
    copiedIcal, icalUrl, handleCopyIcal,
    prevMonth, nextMonth, handleDayClick, handleAddTaskFromDay,
    navWeek, navDay, load, loadError,
    MONTHS_ES,
  } = useCalendar();

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
          <div className="flex items-center justify-between">
            <Button variant="primary" size="sm" className="gap-1.5" style={{ backgroundColor: "#866857" }}
              onClick={() => { setAddTaskDate(""); setShowAddTask(true); }}>
              <Plus size={14} />Añadir tarea
            </Button>
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
              <div className="flex items-center bg-bg2 rounded-lg p-0.5 border border-border">
                {(["month", "week", "day"] as ViewMode[]).map((v) => (
                  <button key={v} onClick={() => setViewMode(v)}
                    className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all capitalize ${viewMode === v ? "bg-white shadow-sm text-text" : "text-brand hover:text-text"}`}>
                    {v === "month" ? "Mes" : v === "week" ? "Semana" : "Día"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-card flex-1 overflow-hidden">
            {viewMode === "month" && (
              <MonthView year={year} month={month} today={todayStr} selectedDay={selectedDay}
                taskDays={taskDays} paymentDays={paymentDays} onDayClick={handleDayClick} />
            )}
            {viewMode === "week" && (
              <WeekView selectedDay={selectedDay} taskDays={taskDays} paymentDays={paymentDays}
                onDayClick={handleDayClick} onPrev={() => navWeek(-1)} onNext={() => navWeek(1)} />
            )}
            {viewMode === "day" && (
              <DayView day={selectedDay} tasks={taskDays.get(selectedDay) || []}
                payments={paymentDays.get(selectedDay) || []}
                onAddTask={() => handleAddTaskFromDay(selectedDay)}
                onPrev={() => navDay(-1)} onNext={() => navDay(1)} />
            )}
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-4">
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
                        <p className="text-[12px] font-medium text-text truncate">{p.vendorName || p.concept || "Pago"}</p>
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
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#D4BFB0" }} />
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

          <div className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Link2 size={14} className="text-brand" />
              <span className="text-[12px] font-bold text-brand uppercase tracking-wider">Sincronizar</span>
            </div>
            <p className="text-[11px] text-brand mb-3 leading-relaxed">
              Añade tus eventos a Google Calendar, Apple Calendar u Outlook.
            </p>
            <button onClick={handleCopyIcal}
              className="w-full flex items-center justify-center gap-1.5 text-[12px] font-medium text-white py-2 rounded-lg transition-all"
              style={{ backgroundColor: copiedIcal ? "#4A773C" : "#8c6f5f" }}>
              {copiedIcal ? <Check size={13} /> : <Copy size={13} />}
              {copiedIcal ? "¡Copiado!" : "Copiar enlace iCal"}
            </button>
            <p className="text-[10px] text-brand mt-2 break-all opacity-60">{icalUrl}</p>
          </div>
        </div>

        {showAddTask && (
          <AddTaskModal initialDate={addTaskDate} onClose={() => setShowAddTask(false)}
            onCreated={() => { setShowAddTask(false); load(); }} />
        )}
      </div>
    </div>
  );
}
