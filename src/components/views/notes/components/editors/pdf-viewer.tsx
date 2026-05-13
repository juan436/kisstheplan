/**
 * PdfViewer
 *
 * Qué hace: visor/subidor de PDF para notas de tipo PDF; permite subir, previsualizar y renombrar el archivo.
 * Recibe:   note (Note), onSave, onClose callbacks.
 * Provee:   export { PdfViewer } — usado por NotesView al abrir una nota de tipo "pdf".
 */

import { useState, useRef, useEffect } from "react";
import { X, File, Loader2, AlertTriangle } from "lucide-react";
import { uploadPdf } from "@/lib/upload";
import type { Note } from "@/types";
import { getMediaUrl } from "@/lib/utils/media";

interface PdfViewerProps {
  note: Note;
  onSave: (content: string, title: string) => void;
  onClose: () => void;
}

export function PdfViewer({ note, onSave, onClose }: PdfViewerProps) {
  const [title, setTitle] = useState(note.title);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string>(note.content || "");
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [checking, setChecking] = useState(!!note.content);

  useEffect(() => {
    if (!pdfUrl) return;
    setChecking(true);
    setLoadError(false);
    fetch(getMediaUrl(pdfUrl), { method: "HEAD" })
      .then((res) => { if (!res.ok) setLoadError(true); })
      .catch(() => setLoadError(true))
      .finally(() => setChecking(false));
  }, [pdfUrl]);

  const saveTitle = (t: string) => {
    if (t.trim() && t.trim() !== note.title) onSave(pdfUrl, t.trim());
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setLoadError(false);
    try {
      const url = await uploadPdf(file);
      setPdfUrl(url);
      onSave(url, title);
    } catch (error) {
      console.error("Error al subir PDF:", error);
      alert("Error al subir el archivo. Por favor, intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "100%" }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors"><X size={18} /></button>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          onBlur={(e) => saveTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          className="flex-1 bg-transparent font-playfair text-lg text-[var(--color-text)] focus:outline-none" placeholder="Título..." />
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} disabled={uploading} />
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: "#866857" }}>
          {uploading && <Loader2 size={14} className="animate-spin" />}
          {uploading ? "Subiendo..." : pdfUrl ? "Cambiar PDF" : "Subir PDF"}
        </button>
      </div>

      <div className="flex-1 bg-[var(--color-bg-2)] flex flex-col overflow-hidden">
        {checking ? (
          <div className="flex items-center justify-center" style={{ minHeight: 420 }}>
            <Loader2 size={24} className="animate-spin text-[var(--color-text)]/30" />
          </div>
        ) : pdfUrl && !loadError ? (
          <iframe src={getMediaUrl(pdfUrl)} className="w-full border-0" style={{ flex: 1, minHeight: 0, height: "100%" }} />
        ) : pdfUrl && loadError ? (
          <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: 420 }}>
            <AlertTriangle size={32} style={{ color: "#c47a7a" }} />
            <div className="text-center">
              <p className="font-semibold text-[var(--color-text)]/70 mb-1">No se puede cargar el PDF</p>
              <p className="text-sm text-[var(--color-text)]/40 max-w-xs">El archivo puede haberse movido o el servidor no está disponible.</p>
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: "#866857" }}>
              Subir otro PDF
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: 420 }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "#eef0f5" }}>
              <File size={32} style={{ color: "#7b8fb5" }} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-[var(--color-text)]/70 mb-1">Sin archivo PDF</p>
              <p className="text-sm text-[var(--color-text)]/40">Sube un PDF para visualizarlo aquí</p>
            </div>
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="px-6 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: "#866857" }}>
              {uploading && <Loader2 size={16} className="animate-spin" />}
              {uploading ? "Subiendo..." : "Subir PDF"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
