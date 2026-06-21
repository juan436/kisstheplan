"use client";

const STATUS_LABEL: Record<string, string> = {
  trial: 'Trial',
  active: 'Activa',
  expired: 'Expirada',
  cancelled: 'Cancelada',
};

const STATUS_COLOR: Record<string, string> = {
  trial: 'text-cta bg-cta/10',
  active: 'text-success bg-success/10',
  expired: 'text-danger bg-danger/10',
  cancelled: 'text-brand bg-border',
};

export interface AdminWedding {
  id: string;
  name: string;
  date: string;
  ownerName: string;
  ownerEmail: string;
  plan: 'trial' | 'annual' | null;
  status: 'trial' | 'active' | 'expired' | 'cancelled' | null;
  trialEndDate: string | null;
  currentPeriodEnd: string | null;
  amount: number | null;
}

export function WeddingsTable({ weddings }: { weddings: AdminWedding[] }) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-border">
      <table className="w-full text-[13px]">
        <thead className="bg-bg2 border-b border-border">
          <tr>
            {['Boda', 'Owner', 'Plan', 'Estado', 'Expira'].map((h) => (
              <th key={h} className="text-left px-4 py-3 font-semibold text-text/70">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weddings.map((w, i) => (
            <tr key={w.id} className={i % 2 === 0 ? 'bg-white' : 'bg-bg'}>
              <td className="px-4 py-3">
                <div className="font-semibold text-text">{w.name}</div>
                <div className="text-[11px] text-brand">{w.date}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-text">{w.ownerName}</div>
                <div className="text-[11px] text-brand">{w.ownerEmail}</div>
              </td>
              <td className="px-4 py-3 text-brand capitalize">{w.plan ?? '—'}</td>
              <td className="px-4 py-3">
                {w.status ? (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[w.status]}`}>
                    {STATUS_LABEL[w.status]}
                  </span>
                ) : '—'}
              </td>
              <td className="px-4 py-3 text-brand">
                {w.trialEndDate
                  ? new Date(w.trialEndDate).toLocaleDateString('es-ES')
                  : w.currentPeriodEnd
                  ? new Date(w.currentPeriodEnd).toLocaleDateString('es-ES')
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {weddings.length === 0 && (
        <div className="text-center py-12 text-brand text-[13px]">Sin bodas registradas</div>
      )}
    </div>
  );
}
