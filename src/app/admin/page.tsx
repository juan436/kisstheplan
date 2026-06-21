"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api/http-client";
import { WeddingsTable, type AdminWedding } from "./weddings-table";

interface AdminStats {
  totalUsers: number;
  totalWeddings: number;
  trial: number;
  active: number;
  expired: number;
  cancelled: number;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-[14px] border border-border px-5 py-4">
      <div className="text-2xl font-title font-semibold text-text">{value}</div>
      <div className="text-[12px] text-brand mt-0.5">{label}</div>
    </div>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [weddings, setWeddings] = useState<AdminWedding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true";
    if (!useRealApi) { setLoading(false); return; }

    Promise.all([
      apiFetch("/admin/stats") as Promise<AdminStats>,
      apiFetch("/admin/weddings") as Promise<AdminWedding[]>,
    ])
      .then(([s, w]) => { setStats(s); setWeddings(w); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-brand text-[13px] pt-8">Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-title text-3xl text-text mb-1">Panel de administración</h1>
        <p className="text-[13px] text-brand">Vista global de KissthePlan</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Usuarios" value={stats.totalUsers} />
          <StatCard label="Bodas" value={stats.totalWeddings} />
          <StatCard label="Trial" value={stats.trial} />
          <StatCard label="Activas" value={stats.active} />
          <StatCard label="Expiradas" value={stats.expired} />
          <StatCard label="Canceladas" value={stats.cancelled} />
        </div>
      )}

      <div>
        <h2 className="font-title text-xl text-text mb-4">Bodas registradas</h2>
        <WeddingsTable weddings={weddings} />
      </div>
    </div>
  );
}
