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
import { ScriptView } from "@/components/views/script-view";
import NotesView from "@/components/views/notes-view";

export default function DashboardAppPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex flex-col h-full min-h-full">
      <ModuleNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 w-full max-w-full overflow-hidden">
        {activeTab === "dashboard" && (
          <div className="py-6">
            <DashboardView />
          </div>
        )}
        {activeTab === "invitados" && <div className="p-6"><GuestsView /></div>}
        {activeTab === "presupuesto" && <div className="p-6"><BudgetView /></div>}
        {activeTab === "tareas" && <div className="p-6"><TasksView /></div>}
        {activeTab === "web" && <div className="p-6"><WebView /></div>}
        {activeTab === "proveedores" && <div className="p-6"><SuppliersView /></div>}
        {activeTab === "plano-mesas" && <div className="p-6"><SeatingView /></div>}
        {activeTab === "calendario" && <div className="p-6"><CalendarView /></div>}
        {activeTab === "guion" && <div className="p-6"><ScriptView /></div>}
        {activeTab === "notas" && <div className="p-6"><NotesView /></div>}
      </div>
    </div>
  );
}
