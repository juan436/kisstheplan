"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import type { Task, PaymentSchedule } from "@/types";
import { toYMD, type ViewMode } from "./calendar-helpers";

export function useCalendar() {
  const { wedding } = useAuth();
  const today = new Date();
  const todayStr = toYMD(today);

  const [year,        setYear]        = useState(today.getFullYear());
  const [month,       setMonth]       = useState(today.getMonth());
  const [viewMode,    setViewMode]    = useState<ViewMode>("month");
  const [selectedDay, setSelectedDay] = useState<string>(todayStr);
  const [allTasks,    setAllTasks]    = useState<Task[]>([]);
  const [payments,    setPayments]    = useState<PaymentSchedule[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [addTaskDate, setAddTaskDate] = useState<string>("");
  const [copiedIcal,  setCopiedIcal]  = useState(false);
  const [loadError,   setLoadError]   = useState<string | null>(null);

  const tasks = allTasks.filter((x) => x.dueDate);

  const load = useCallback(async () => {
    try {
      setLoadError(null);
      const [t, p] = await Promise.all([api.getTasks(), api.getPayments()]);
      setAllTasks(t);
      setPayments(p.filter((x) => x.dueDate));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Error cargando datos");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

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

  const overduePayments = [...payments].filter((p) => p.dueDate < todayStr && !p.paid).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const futurePayments  = [...payments].filter((p) => p.dueDate >= todayStr && !p.paid).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const upcomingPayments = [...overduePayments, ...futurePayments].slice(0, 4);

  const upcomingTasks = [
    ...allTasks.filter((t) => t.dueDate && t.dueDate >= todayStr && t.status !== "done").sort((a, b) => a.dueDate!.localeCompare(b.dueDate!)),
    ...allTasks.filter((t) => !t.dueDate && t.status !== "done").slice(0, 3),
  ].slice(0, 5);

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

  const navWeek = (delta: number) => {
    const d = new Date(selectedDay);
    d.setDate(d.getDate() + delta * 7);
    setSelectedDay(toYMD(d)); setMonth(d.getMonth()); setYear(d.getFullYear());
  };
  const navDay = (delta: number) => {
    const d = new Date(selectedDay);
    d.setDate(d.getDate() + delta);
    setSelectedDay(toYMD(d)); setMonth(d.getMonth()); setYear(d.getFullYear());
  };

  return {
    year, month, viewMode, setViewMode, selectedDay, todayStr,
    taskDays, paymentDays, upcomingPayments, upcomingTasks,
    showAddTask, setShowAddTask, addTaskDate, setAddTaskDate,
    copiedIcal, icalUrl, handleCopyIcal,
    prevMonth, nextMonth, handleDayClick, handleAddTaskFromDay,
    navWeek, navDay, load, loadError,
    MONTHS_ES: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  };
}
