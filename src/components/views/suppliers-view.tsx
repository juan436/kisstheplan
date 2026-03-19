"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/services";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Plus, ArrowLeft, Trash2, Check, CalendarDays, FileText,
  Paperclip, Send, List, LayoutGrid, ChevronDown,
} from "lucide-react";
import type { Vendor, VendorPayment, VendorStatus } from "@/types";
import type { CreateVendorData, CreateVendorPaymentData } from "@/services/api";

/* ─── Constants ──────────────────────────────────────────────── */

const VENDOR_CATEGORIES = [
  "Finca", "Catering", "Fotografía", "Vídeo", "Música",
  "Decoración", "Sonido", "Transporte", "Flores", "Belleza", "Papelería",
];

const STATUS_COLOR: Record<VendorStatus, string> = {
  confirmed: "#CBA978",
  considering: "#D4BFB0",
};

const STATUS_LABEL: Record<VendorStatus, string> = {
  confirmed: "Confirmado",
  considering: "Considerando",
};

type View = "grid" | "list" | "detail";

/* ─── Main component ──────────────────────────────────────────── */

export default function ProveedoresPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [view, setView] = useState<View>("grid");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await api.getVendors();
    setVendors(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openDetail = (v: Vendor) => { setSelectedVendor(v); setView("detail"); };

  const handleVendorCreated = async (vendor: Vendor) => {
    await load();
    setShowAddModal(false);
    setSelectedVendor(vendor);
    setView("detail");
  };

  const handleVendorUpdated = async (updated: Vendor) => {
    setSelectedVendor(updated);
    await load();
  };

  const handleDelete = async (id: string) => {
    await api.deleteVendor(id);
    await load();
    if (view === "detail") { setView("grid"); setSelectedVendor(null); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-brand text-[14px]">Cargando...</div>
      </div>
    );
  }

  if (view === "detail" && selectedVendor) {
    return (
      <DetailView
        vendor={selectedVendor}
        onBack={() => { setView("grid"); setSelectedVendor(null); }}
        onUpdate={handleVendorUpdated}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[26px] italic text-text">Proveedores</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            className="flex items-center gap-1.5 text-[13px] text-brand hover:text-text transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-accent"
          >
            {view === "grid" ? <List size={14} /> : <LayoutGrid size={14} />}
            {view === "grid" ? "Ver listado" : "Ver mosaico"}
          </button>
          <Button variant="cta" size="sm" className="gap-1.5" onClick={() => setShowAddModal(true)}>
            <Plus size={14} />
            Añadir proveedor
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <GridView vendors={vendors} onOpen={openDetail} onDelete={handleDelete} />
      ) : (
        <ListView vendors={vendors} onOpen={openDetail} />
      )}

      {showAddModal && (
        <QuickAddModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleVendorCreated}
        />
      )}
    </div>
  );
}

/* ─── Grid View ───────────────────────────────────────────────── */

function GridView({
  vendors, onOpen, onDelete,
}: {
  vendors: Vendor[];
  onOpen: (v: Vendor) => void;
  onDelete: (id: string) => void;
}) {
  // Group by first category
  const grouped: Record<string, Vendor[]> = {};
  for (const v of vendors) {
    const cat = v.categories[0] || "Sin categoría";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(v);
  }

  if (vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-bg2 flex items-center justify-center mb-4">
          <FileText size={24} className="text-brand" />
        </div>
        <p className="text-text font-medium text-[15px]">Sin proveedores aún</p>
        <p className="text-brand text-[13px] mt-1">Añade tu primer proveedor para empezar</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([cat, catVendors]) => (
        <div key={cat}>
          <h3 className="text-[13px] font-semibold text-brand uppercase tracking-wider mb-3">{cat}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {catVendors.map((v) => (
              <VendorCard key={v.id} vendor={v} onOpen={onOpen} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function VendorCard({
  vendor, onOpen, onDelete,
}: {
  vendor: Vendor;
  onOpen: (v: Vendor) => void;
  onDelete: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const total = vendor.payments.reduce((s, p) => s + p.amount, 0);
  const paid = vendor.payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
  const next = vendor.payments
    .filter((p) => !p.paid && p.dueDate)
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))[0];

  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-elevated bg-white relative"
      style={{ boxShadow: "0 4px 16px rgba(74,60,50,0.08)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirming(false); }}
      onClick={() => onOpen(vendor)}
    >
      {/* Status bar */}
      <div
        className="h-2"
        style={{ backgroundColor: STATUS_COLOR[vendor.status] }}
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-semibold text-text text-[14px] leading-tight">{vendor.name}</p>
            <p className="text-[11px] text-brand mt-0.5">{vendor.categories.join(", ")}</p>
          </div>
          <span
            className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${STATUS_COLOR[vendor.status]}30`,
              color: vendor.status === "confirmed" ? "#8c6b30" : "#7a6a5a",
            }}
          >
            {STATUS_LABEL[vendor.status]}
          </span>
        </div>

        {total > 0 && (
          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between text-[12px]">
              <span className="text-brand">Total</span>
              <span className="font-semibold text-text">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-brand">Pagado</span>
              <span className="text-[#4A773C] font-medium">{formatCurrency(paid)}</span>
            </div>
            {next && (
              <div className="flex justify-between text-[12px]">
                <span className="text-brand">Próximo pago</span>
                <span className="text-text">{formatCurrency(next.amount)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete — always visible for considering, hover for confirmed */}
      {(hovered || vendor.status === "considering") && (
        <div
          className="absolute bottom-3 right-3"
          onClick={(e) => e.stopPropagation()}
        >
          {confirming ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(vendor.id)}
                className="text-[11px] bg-danger text-white px-2 py-0.5 rounded-md hover:bg-danger/80"
              >
                Eliminar
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-[11px] text-brand hover:text-text px-1"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="w-7 h-7 rounded-full bg-bg2 flex items-center justify-center text-brand hover:text-danger hover:bg-danger/10 transition-all"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── List View ───────────────────────────────────────────────── */

function ListView({ vendors, onOpen }: { vendors: Vendor[]; onOpen: (v: Vendor) => void }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button className="flex items-center gap-1.5 text-[13px] font-semibold text-white px-4 py-2 rounded-full"
          style={{ backgroundColor: "#8c6f5f" }}>
          <FileText size={14} />
          Exportar PDF
        </button>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Proveedor", "Categoría", "Persona de contacto", "Teléfono", "E-mail", "Menú Staff"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-brand uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendors.map((v, i) => (
              <tr
                key={v.id}
                onClick={() => onOpen(v)}
                className={`cursor-pointer hover:bg-bg2 transition-colors ${i !== vendors.length - 1 ? "border-b border-border/50" : ""}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLOR[v.status] }} />
                    <span className="text-[13px] font-semibold text-text">{v.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-brand">{v.categories.join(", ")}</td>
                <td className="px-4 py-3 text-[13px] text-text">{v.contactName || "—"}</td>
                <td className="px-4 py-3 text-[13px] text-text">{v.phone || "—"}</td>
                <td className="px-4 py-3 text-[13px] text-text">{v.email || "—"}</td>
                <td className="px-4 py-3 text-[13px] text-text">
                  {v.needsStaffMenu ? `Sí, ${v.staffCount || "?"}` : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vendors.length === 0 && (
          <div className="text-center py-12 text-brand text-[13px]">Sin proveedores</div>
        )}
      </div>
    </div>
  );
}

/* ─── Quick Add Modal ─────────────────────────────────────────── */

function QuickAddModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (v: Vendor) => void;
}) {
  const [name, setName] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [status, setStatus] = useState<VendorStatus>("considering");
  const [saving, setSaving] = useState(false);

  const toggleCat = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleAdd = async () => {
    if (!name.trim() || selectedCats.length === 0) return;
    setSaving(true);
    const vendor = await api.createVendor({
      name: name.trim(), categories: selectedCats, status,
    } as CreateVendorData);
    onCreate(vendor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(74,60,50,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-elevated w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-[20px] italic text-text mb-5">Nuevo proveedor</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-brand uppercase tracking-wider block mb-1">Nombre</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Ej: Finca Tagamanent"
              className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-cta transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand uppercase tracking-wider block mb-2">Categorías</label>
            <div className="flex flex-wrap gap-1.5">
              {VENDOR_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCat(cat)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all ${
                    selectedCats.includes(cat)
                      ? "bg-accent text-white border-accent"
                      : "bg-bg2 text-text border-border hover:border-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand uppercase tracking-wider block mb-2">Estado</label>
            <div className="flex gap-3">
              {(["confirmed", "considering"] as VendorStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="flex items-center gap-2 text-[13px] font-medium text-text"
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: status === s ? STATUS_COLOR[s] : "#D4C9B8",
                      backgroundColor: status === s ? STATUS_COLOR[s] : "transparent",
                    }}
                  >
                    {status === s && <Check size={11} className="text-white" />}
                  </div>
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button
            variant="cta"
            onClick={handleAdd}
            disabled={saving || !name.trim() || selectedCats.length === 0}
            className="flex-1"
          >
            {saving ? "Añadiendo..." : "AÑADIR"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail View ─────────────────────────────────────────────── */

function DetailView({
  vendor: initialVendor,
  onBack,
  onUpdate,
  onDelete,
}: {
  vendor: Vendor;
  onBack: () => void;
  onUpdate: (v: Vendor) => void;
  onDelete: (id: string) => void;
}) {
  const [vendor, setVendor] = useState(initialVendor);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<CreateVendorPaymentData>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const activityEndRef = useRef<HTMLDivElement>(null);

  const save = async (data: Parameters<typeof api.updateVendor>[1]) => {
    const updated = await api.updateVendor(vendor.id, data);
    setVendor(updated);
    onUpdate(updated);
  };

  const handleFieldBlur = (field: string, value: string | boolean | number) => {
    save({ [field]: value });
  };

  const handleTogglePaid = async (payment: VendorPayment) => {
    const updated = await api.updateVendorPayment(vendor.id, payment.id, { paid: !payment.paid });
    setVendor(updated);
    onUpdate(updated);
  };

  const handleAddPayment = async () => {
    if (!newPayment.amount) return;
    const updated = await api.addVendorPayment(vendor.id, {
      amount: newPayment.amount,
      dueDate: newPayment.dueDate || null,
      notes: newPayment.notes || "",
    });
    setVendor(updated);
    onUpdate(updated);
    setNewPayment({});
    setAddingPayment(false);
  };

  const handleDeletePayment = async (paymentId: string) => {
    const updated = await api.deleteVendorPayment(vendor.id, paymentId);
    setVendor(updated);
    onUpdate(updated);
  };

  const handleSendChat = async () => {
    const text = chatInput.trim();
    if (!text) return;
    setSending(true);
    const updated = await api.addVendorActivity(vendor.id, { type: "note", content: text });
    setVendor(updated);
    onUpdate(updated);
    setChatInput("");
    setSending(false);
    setTimeout(() => activityEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const total = vendor.payments.reduce((s, p) => s + p.amount, 0);
  const barColor = STATUS_COLOR[vendor.status];

  return (
    <div className="flex gap-0 h-full" style={{ maxHeight: "calc(100vh - 140px)" }}>

      {/* ── LEFT COLUMN — scrollable ── */}
      <div className="flex-1 overflow-y-auto pr-6 min-w-0">

        {/* Header bar */}
        <div
          className="rounded-xl mb-6 px-5 py-3 flex items-center justify-between"
          style={{ backgroundColor: barColor }}
        >
          <span className="font-bold text-white text-[16px] tracking-wide">{vendor.name}</span>
          <span className="text-white/80 text-[13px] font-medium">{vendor.categories.join(" · ")}</span>
        </div>

        {/* Status toggle */}
        <div className="flex gap-3 mb-6">
          {(["confirmed", "considering"] as VendorStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => save({ status: s })}
              className="flex items-center gap-2 text-[13px] font-medium text-text"
            >
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: vendor.status === s ? STATUS_COLOR[s] : "#D4C9B8",
                  backgroundColor: vendor.status === s ? STATUS_COLOR[s] : "transparent",
                }}
              >
                {vendor.status === s && <Check size={11} className="text-white" />}
              </div>
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {/* Contact details */}
        <div className="bg-white rounded-xl p-5 mb-5 shadow-card space-y-3">
          <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest mb-3">Datos de contacto</h3>
          {[
            { label: "NOMBRE DEL CONTACTO", field: "contactName", value: vendor.contactName },
            { label: "E-MAIL", field: "email", value: vendor.email },
            { label: "TELÉFONO", field: "phone", value: vendor.phone },
            { label: "WEB", field: "web", value: vendor.web },
            { label: "RRSS", field: "social", value: vendor.social },
          ].map(({ label, field, value }) => (
            <div key={field} className="flex items-baseline gap-3">
              <span className="text-[10px] font-bold text-brand uppercase tracking-widest w-36 flex-shrink-0">{label}</span>
              <input
                defaultValue={value || ""}
                onBlur={(e) => handleFieldBlur(field, e.target.value)}
                placeholder="—"
                className="flex-1 bg-transparent border-b border-border/50 text-[13px] text-text outline-none focus:border-cta pb-0.5 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Payment calendar */}
        <div className="bg-white rounded-xl p-5 mb-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest">Calendario de pagos</h3>
            {total > 0 && (
              <span className="font-display text-[18px] italic text-text">{formatCurrency(total)}</span>
            )}
          </div>

          {vendor.payments.length === 0 && !addingPayment ? (
            <p className="text-[13px] text-brand text-center py-4">Sin pagos registrados</p>
          ) : (
            <table className="w-full mb-3">
              <thead>
                <tr className="border-b border-border">
                  {["Cantidad", "A pagar el", "Pagado", "Notas", ""].map((h) => (
                    <th key={h} className="text-left text-[10px] font-bold text-brand uppercase tracking-wider pb-2 pr-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendor.payments.map((p) => (
                  <tr key={p.id} className="border-b border-border/40">
                    <td className="py-2 pr-3 text-[13px] text-text font-medium">{formatCurrency(p.amount)}</td>
                    <td className="py-2 pr-3">
                      {p.dueDate ? (
                        <input
                          type="date"
                          defaultValue={p.dueDate}
                          onBlur={(e) => api.updateVendorPayment(vendor.id, p.id, { dueDate: e.target.value }).then(setVendor)}
                          className="text-[12px] text-text bg-transparent border-b border-border/50 outline-none focus:border-cta"
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <CalendarDays size={13} className="text-brand" />
                          <input
                            type="date"
                            onBlur={(e) => e.target.value && api.updateVendorPayment(vendor.id, p.id, { dueDate: e.target.value }).then(setVendor)}
                            className="text-[12px] text-brand bg-transparent outline-none w-0 opacity-0 focus:w-auto focus:opacity-100 transition-all"
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <button
                        onClick={() => handleTogglePaid(p)}
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: p.paid ? "#4A773C" : "#D4C9B8",
                          backgroundColor: p.paid ? "#4A773C" : "transparent",
                        }}
                      >
                        {p.paid && <Check size={11} className="text-white" />}
                      </button>
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        defaultValue={p.notes || ""}
                        onBlur={(e) => api.updateVendorPayment(vendor.id, p.id, { notes: e.target.value }).then(setVendor)}
                        placeholder="Notas..."
                        className="text-[12px] text-text bg-transparent border-b border-border/40 outline-none focus:border-cta w-full"
                      />
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDeletePayment(p.id)}
                        className="text-brand hover:text-danger transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}

                {addingPayment && (
                  <tr className="border-b border-border/40">
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        placeholder="0"
                        value={newPayment.amount || ""}
                        onChange={(e) => setNewPayment((p) => ({ ...p, amount: Number(e.target.value) }))}
                        className="w-20 text-[13px] text-text bg-bg2 border border-border rounded px-2 py-1 outline-none focus:border-cta"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="date"
                        value={newPayment.dueDate || ""}
                        onChange={(e) => setNewPayment((p) => ({ ...p, dueDate: e.target.value }))}
                        className="text-[12px] text-text bg-bg2 border border-border rounded px-2 py-1 outline-none focus:border-cta"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <div className="w-6 h-6 rounded-full border-2 border-border" />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        placeholder="Notas..."
                        value={newPayment.notes || ""}
                        onChange={(e) => setNewPayment((p) => ({ ...p, notes: e.target.value }))}
                        className="text-[12px] text-text bg-bg2 border border-border rounded px-2 py-1 outline-none focus:border-cta w-full"
                      />
                    </td>
                    <td className="py-2 flex gap-1">
                      <button onClick={handleAddPayment} className="text-[11px] bg-accent text-white px-2 py-0.5 rounded">OK</button>
                      <button onClick={() => { setAddingPayment(false); setNewPayment({}); }} className="text-[11px] text-brand hover:text-danger">✕</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {!addingPayment && (
            <button
              onClick={() => setAddingPayment(true)}
              className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors"
            >
              <Plus size={12} />
              Añadir pago
            </button>
          )}
        </div>

        {/* Contract + Staff */}
        <div className="bg-white rounded-xl p-5 mb-5 shadow-card space-y-4">
          <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest">Gestión técnica</h3>

          {/* Contract */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => save({ contractUrl: vendor.contractUrl ? "" : "pending" })}
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
              style={{
                borderColor: vendor.contractUrl ? "#4A773C" : "#D4C9B8",
                backgroundColor: vendor.contractUrl ? "#4A773C" : "transparent",
              }}
            >
              {vendor.contractUrl && <Check size={10} className="text-white" />}
            </button>
            <span className="text-[13px] text-text">Contrato firmado</span>
            <button className="flex items-center gap-1 text-[12px] text-cta hover:underline ml-auto">
              <Paperclip size={12} />
              {vendor.contractUrl ? "Ver contrato" : "Adjuntar"}
            </button>
          </div>

          {/* Staff menu */}
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => save({ needsStaffMenu: !vendor.needsStaffMenu })}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  borderColor: vendor.needsStaffMenu ? STATUS_COLOR.confirmed : "#D4C9B8",
                  backgroundColor: vendor.needsStaffMenu ? STATUS_COLOR.confirmed : "transparent",
                }}
              >
                {vendor.needsStaffMenu && <Check size={10} className="text-white" />}
              </button>
              <span className="text-[13px] text-text">Necesita menú staff</span>
            </div>

            {vendor.needsStaffMenu && (
              <div className="mt-3 pl-8 space-y-2">
                <div className="flex items-center gap-3">
                  <label className="text-[11px] font-bold text-brand uppercase tracking-wider w-32">¿Cuántas personas?</label>
                  <input
                    type="number"
                    defaultValue={vendor.staffCount || ""}
                    onBlur={(e) => handleFieldBlur("staffCount", Number(e.target.value))}
                    className="w-16 bg-bg2 border border-border rounded px-2 py-1 text-[13px] text-text outline-none focus:border-cta"
                  />
                </div>
                <div className="flex items-start gap-3">
                  <label className="text-[11px] font-bold text-brand uppercase tracking-wider w-32 pt-1">Alergias / Restricciones</label>
                  <input
                    defaultValue={vendor.staffAllergies || ""}
                    onBlur={(e) => handleFieldBlur("staffAllergies", e.target.value)}
                    placeholder="Ej: Gluten (2), Lactosa (1)..."
                    className="flex-1 bg-bg2 border border-border rounded px-2 py-1 text-[13px] text-text outline-none focus:border-cta"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl p-5 mb-5 shadow-card">
          <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest mb-3">Notas</h3>
          <textarea
            defaultValue={vendor.notes || ""}
            onBlur={(e) => handleFieldBlur("notes", e.target.value)}
            placeholder="Área para escribir anotaciones..."
            rows={5}
            className="w-full bg-bg2 rounded-lg px-3 py-2.5 text-[13px] text-text placeholder:text-brand outline-none focus:ring-1 focus:ring-cta/40 resize-none transition-all"
          />
        </div>

        {/* Danger zone */}
        <div className="pb-8">
          {confirmDelete ? (
            <div className="flex items-center gap-3 bg-danger/10 border border-danger/30 rounded-xl px-4 py-3">
              <span className="text-[13px] text-text flex-1">¿Eliminar este proveedor?</span>
              <button onClick={() => onDelete(vendor.id)} className="text-[12px] bg-danger text-white px-3 py-1 rounded-lg">Eliminar</button>
              <button onClick={() => setConfirmDelete(false)} className="text-[12px] text-brand hover:text-text">Cancelar</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-[12px] text-brand hover:text-danger transition-colors"
            >
              <Trash2 size={13} />
              Eliminar proveedor
            </button>
          )}
        </div>
      </div>

      {/* ── RIGHT COLUMN — fixed sidebar ── */}
      <div
        className="w-72 flex-shrink-0 flex flex-col bg-white rounded-xl shadow-card overflow-hidden"
        style={{ height: "calc(100vh - 140px)", position: "sticky", top: 0 }}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-border flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[12px] font-medium text-text px-3 py-1.5 rounded-full border border-border hover:bg-bg2 transition-colors"
          >
            <ArrowLeft size={13} />
            Atrás
          </button>
          <button
            onClick={() => {
              const note = prompt("Escribe tu nota:");
              if (note?.trim()) {
                api.addVendorActivity(vendor.id, { type: "note", content: note.trim() }).then((updated) => {
                  setVendor(updated);
                  onUpdate(updated);
                });
              }
            }}
            className="flex items-center gap-1.5 text-[12px] font-medium text-white px-3 py-1.5 rounded-full transition-colors"
            style={{ backgroundColor: "#8c6f5f" }}
          >
            <Plus size={13} />
            Añadir nota
          </button>
        </div>

        {/* Activity feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-2">Actividad</p>

          {vendor.activity.length === 0 && (
            <p className="text-[12px] text-brand text-center py-6">Sin actividad aún</p>
          )}

          {vendor.activity.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: "#C4B7A6" }}
                >
                  {entry.author.charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] font-semibold text-text">{entry.author}</span>
                <span className="text-[10px] text-brand ml-auto">
                  {new Date(entry.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                </span>
              </div>
              <div className="ml-7.5 pl-[30px]">
                {entry.type === "file" ? (
                  <a href={entry.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[12px] text-cta hover:underline">
                    <Paperclip size={11} />
                    {entry.fileName || "Archivo adjunto"}
                  </a>
                ) : (
                  <p className="text-[12px] text-text leading-relaxed bg-bg2 rounded-lg px-3 py-2">
                    {entry.content}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={activityEndRef} />
        </div>

        {/* Chat input */}
        <div className="p-3 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-2 bg-bg2 rounded-xl px-3 py-2 border border-border focus-within:border-cta transition-colors">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendChat()}
              placeholder="Chat para escribir o subir documentación..."
              className="flex-1 bg-transparent text-[12px] text-text placeholder:text-brand outline-none"
            />
            <button
              onClick={handleSendChat}
              disabled={sending || !chatInput.trim()}
              className="text-cta hover:text-accent transition-colors disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
