"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ModuleNav } from "@/components/layout/module-nav";
import DashboardView from "@/components/views/dashboard-view";
import GuestsView from "@/components/views/guests-view";
import BudgetView from "@/components/views/budget-view";
import TasksView from "@/components/views/tasks-view";
import WebView from "@/components/views/web-view";
import SuppliersView from "@/components/views/suppliers-view";
import SeatingView from "@/components/views/seating-view";
import CalendarView from "@/components/views/calendar-view";
import ScriptView from "@/components/views/script-view";
import NotesView from "@/components/views/notes-view";

function AppContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  return (
    <>
      <ModuleNav />
      <div className="p-6 flex-1 w-full max-w-full overflow-hidden">
        {tab === "dashboard" && <DashboardView />}
        {tab === "invitados" && <GuestsView />}
        {tab === "presupuesto" && <BudgetView />}
        {tab === "tareas" && <TasksView />}
        {tab === "web" && <WebView />}
        {tab === "proveedores" && <SuppliersView />}
        {tab === "plano-mesas" && <SeatingView />}
        {tab === "calendario" && <CalendarView />}
        {tab === "guion" && <ScriptView />}
        {tab === "notas" && <NotesView />}
      </div>
    </>
  );
}

export default function AppPage() {
  return (
    <div className="flex flex-col h-full min-h-full">
      <Suspense fallback={
        <div className="p-6 text-brand">Cargando módulos...</div>
      }>
        <AppContent />
      </Suspense>
    </div>
  );
}
