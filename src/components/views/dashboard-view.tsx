"use client";

import { useEffect, useState } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { daysUntil } from "@/lib/utils";
import { WeddingCard } from "@/components/features/dashboard/wedding-card";
import { CountdownSection } from "@/components/features/dashboard/countdown-section";
import { TasksPanel } from "@/components/features/dashboard/tasks-panel";
import { PaymentsPanel } from "@/components/features/dashboard/payments-panel";
import type { GuestStats, BudgetSummary, Task, PaymentSchedule } from "@/types";

export default function DashboardPage() {
  const { wedding } = useAuth();
  const [guestStats, setGuestStats] = useState<GuestStats | null>(null);
  const [budget, setBudget] = useState<BudgetSummary | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<PaymentSchedule[]>([]);

  useEffect(() => {
    api.getGuestStats().then(setGuestStats);
    api.getBudgetSummary().then(setBudget);
    api.getUpcomingTasks().then(setTasks);
    api.getUpcomingPayments().then(setPayments);
  }, []);

  if (!wedding || !guestStats || !budget) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-brand text-[14px]">Cargando...</div>
      </div>
    );
  }

  const daysLeft = daysUntil(wedding.date);

  return (
    <div className="max-w-[1100px] mx-auto">
      <h1 className="font-display text-[36px] italic text-text mb-6">
        {wedding.partner1Name} & {wedding.partner2Name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1px_1fr_1px_280px] gap-0 lg:gap-5">
        {/* Left */}
        <div>
          <WeddingCard wedding={wedding} budget={budget} />
        </div>

        {/* Divider */}
        <div className="hidden lg:block bg-border/60 self-stretch" />

        {/* Center */}
        <div>
          <CountdownSection daysLeft={daysLeft} guestStats={guestStats} budget={budget} />
        </div>

        {/* Divider */}
        <div className="hidden lg:block bg-border/60 self-stretch" />

        {/* Right */}
        <div className="space-y-5">
          <TasksPanel tasks={tasks} />
          <PaymentsPanel payments={payments} />
        </div>
      </div>
    </div>
  );
}
