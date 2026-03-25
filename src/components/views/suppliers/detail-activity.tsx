import { useRef } from "react";
import { Plus, Paperclip, Send } from "lucide-react";
import { api } from "@/services";
import type { Vendor } from "@/types";

interface DetailActivityProps {
  vendor: Vendor;
  chatInput: string;
  setChatInput: (v: string) => void;
  sending: boolean;
  activityEndRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onSendChat: () => void;
  onVendorUpdated: (v: Vendor) => void;
}

export function DetailActivity({
  vendor, chatInput, setChatInput, sending, activityEndRef,
  onBack, onSendChat, onVendorUpdated,
}: DetailActivityProps) {
  return (
    <div className="w-72 flex-shrink-0 flex flex-col bg-white rounded-xl shadow-card overflow-hidden"
      style={{ height: "calc(100vh - 140px)", position: "sticky", top: 0 }}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-2 flex-shrink-0">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-[12px] font-medium text-text px-3 py-1.5 rounded-full border border-border hover:bg-bg2 transition-colors">
          ← Atrás
        </button>
        <button
          onClick={() => {
            const note = prompt("Escribe tu nota:");
            if (note?.trim()) {
              api.addVendorActivity(vendor.id, { type: "note", content: note.trim() }).then((updated) => {
                onVendorUpdated(updated);
              });
            }
          }}
          className="flex items-center gap-1.5 text-[12px] font-medium text-white px-3 py-1.5 rounded-full transition-colors"
          style={{ backgroundColor: "#8c6f5f" }}>
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
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ backgroundColor: "#C4B7A6" }}>
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
                <p className="text-[12px] text-text leading-relaxed bg-bg2 rounded-lg px-3 py-2">{entry.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={activityEndRef} />
      </div>

      {/* Chat input */}
      <div className="p-3 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2 bg-bg2 rounded-xl px-3 py-2 border border-border focus-within:border-cta transition-colors">
          <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSendChat()}
            placeholder="Chat para escribir o subir documentación..."
            className="flex-1 bg-transparent text-[12px] text-text placeholder:text-brand outline-none" />
          <button onClick={onSendChat} disabled={sending || !chatInput.trim()}
            className="text-cta hover:text-accent transition-colors disabled:opacity-40">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
