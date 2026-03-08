"use client";

import { useState } from "react";
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

export default function DashboardAppPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex flex-col h-full min-h-full">
      <ModuleNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="p-6 flex-1 w-full max-w-full overflow-hidden">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "invitados" && <GuestsView />}
        {activeTab === "presupuesto" && <BudgetView />}
        {activeTab === "tareas" && <TasksView />}
        {activeTab === "web" && <WebView />}
        {activeTab === "proveedores" && <SuppliersView />}
        {activeTab === "plano-mesas" && <SeatingView />}
        {activeTab === "calendario" && <CalendarView />}
        {activeTab === "guion" && <ScriptView />}
        {activeTab === "notas" && <NotesView />}
      </div>
    </div>
  );
}
