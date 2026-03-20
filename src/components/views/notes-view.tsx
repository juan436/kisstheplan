"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, FileText, Image as ImageIcon, File,
  Trash2, Download, Bold, Italic, Underline,
  Check, Loader2, Palette,
} from "lucide-react";
import { api } from "@/services";
import { uploadImage, uploadPdf } from "@/lib/upload";
import type { Note, NoteType, Vendor, MoodboardCategory } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<NoteType, string> = {
  text: "Texto (Word)",
  pdf: "Subir archivo (PDF)",
  moodboard: "Moodboard",
};

const TYPE_ICONS: Record<NoteType, React.ReactNode> = {
  text: <FileText size={16} />,
  pdf: <File size={16} />,
  moodboard: <ImageIcon size={16} />,
};

const NOTE_BG: Record<NoteType, string> = {
  text: "#f5f0ea",
  pdf: "#eef0f5",
  moodboard: "#f5eaf0",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Create Note Modal ────────────────────────────────────────────────────────

interface CreateNoteModalProps {
  vendors: Vendor[];
  onClose: () => void;
  onCreate: (data: { type: NoteType; title: string; vendorId?: string }) => void;
}

function CreateNoteModal({ vendors, onClose, onCreate }: CreateNoteModalProps) {
  const [type, setType] = useState<NoteType>("text");
  const [title, setTitle] = useState("");
  const [vendorId, setVendorId] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-[var(--color-bg)] rounded-2xl p-6 w-full max-w-sm mx-4 z-10"
        style={{ boxShadow: "0 20px 60px rgba(74,60,50,0.18)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-playfair text-xl text-[var(--color-text)]">Añadir nota</h3>
          <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">Tipo de nota</label>
            <div className="space-y-2">
              {(["text", "pdf", "moodboard"] as NoteType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    type === t
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : "border-[var(--color-border)] text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/40"
                  }`}
                >
                  {TYPE_ICONS[t]}
                  {TYPE_LABELS[t]}
                  {type === t && <Check size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && title.trim()) { onCreate({ type, title: title.trim(), vendorId: vendorId || undefined }); onClose(); } }}
              placeholder="Nombre de la nota..."
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
            />
          </div>

          {vendors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">
                Asociar a proveedor <span className="font-normal opacity-50">(opcional)</span>
              </label>
              <select
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
              >
                <option value="">Sin proveedor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)]/60 hover:bg-[var(--color-bg-2)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => { if (!title.trim()) return; onCreate({ type, title: title.trim(), vendorId: vendorId || undefined }); onClose(); }}
            disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-40"
            style={{ backgroundColor: "#866857" }}
          >
            Crear nota
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Text Editor ──────────────────────────────────────────────────────────────

interface TextEditorProps {
  note: Note;
  onSave: (content: string, title: string) => void;
  onClose: () => void;
}

function TextEditor({ note, onSave, onClose }: TextEditorProps) {
  const [title, setTitle] = useState(note.title);
  const editorRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = note.content || "";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML || "";
    onSave(content, title);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 600 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
          <X size={18} />
        </button>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-transparent font-playfair text-lg text-[var(--color-text)] focus:outline-none"
          placeholder="Título..."
        />
        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: saved ? "#7db87d" : "#866857" }}
        >
          {saved ? "Guardado ✓" : "Guardar"}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-6 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-2)] flex-wrap">
        {[
          { icon: <Bold size={14} />, cmd: "bold", title: "Negrita" },
          { icon: <Italic size={14} />, cmd: "italic", title: "Cursiva" },
          { icon: <Underline size={14} />, cmd: "underline", title: "Subrayado" },
        ].map(({ icon, cmd, title: t }) => (
          <button
            key={cmd}
            onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
            title={t}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--color-fill)] text-[var(--color-text)]/60 hover:text-[var(--color-text)] transition-colors"
          >
            {icon}
          </button>
        ))}
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        {[{ label: "S", size: "2" }, { label: "M", size: "3" }, { label: "L", size: "4" }, { label: "XL", size: "5" }].map(({ label, size }) => (
          <button
            key={label}
            onMouseDown={(e) => { e.preventDefault(); exec("fontSize", size); }}
            className="px-2 py-0.5 text-xs rounded hover:bg-[var(--color-fill)] text-[var(--color-text)]/60 hover:text-[var(--color-text)] transition-colors font-medium"
          >
            {label}
          </button>
        ))}
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        {["#4A3C32", "#866857", "#c7a977", "#7db87d", "#c47a7a", "#5b7fa6"].map((color) => (
          <button
            key={color}
            onMouseDown={(e) => { e.preventDefault(); exec("foreColor", color); }}
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
          />
        ))}
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        <button
          onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }}
          title="Lista"
          className="px-2 py-0.5 text-xs rounded hover:bg-[var(--color-fill)] text-[var(--color-text)]/60 hover:text-[var(--color-text)] transition-colors"
        >
          Lista
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="flex-1 px-8 py-6 overflow-y-auto focus:outline-none text-[var(--color-text)] leading-relaxed"
        style={{ fontFamily: "Quicksand, sans-serif", fontSize: 15, minHeight: 420 }}
        data-placeholder="Empieza a escribir aquí..."
      />
    </div>
  );
}

// ─── PDF Viewer ───────────────────────────────────────────────────────────────

interface PdfViewerProps {
  note: Note;
  onSave: (content: string, title: string) => void;
  onClose: () => void;
}

function PdfViewer({ note, onSave, onClose }: PdfViewerProps) {
  const [title, setTitle] = useState(note.title);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string>(note.content || "");
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Subir archivo al servidor
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
    <div className="flex flex-col" style={{ minHeight: 600 }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
          <X size={18} />
        </button>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-transparent font-playfair text-lg text-[var(--color-text)] focus:outline-none"
          placeholder="Título..."
        />
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} disabled={uploading} />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: "#866857" }}
        >
          {uploading && <Loader2 size={14} className="animate-spin" />}
          {uploading ? "Subiendo..." : pdfUrl ? "Cambiar PDF" : "Subir PDF"}
        </button>
      </div>
      <div className="flex-1 bg-[var(--color-bg-2)]">
        {pdfUrl ? (
          <iframe src={pdfUrl} className="w-full border-0" style={{ minHeight: 520, height: "100%" }} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: 420 }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "#eef0f5" }}>
              <File size={32} style={{ color: "#7b8fb5" }} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-[var(--color-text)]/70 mb-1">Sin archivo PDF</p>
              <p className="text-sm text-[var(--color-text)]/40">Sube un PDF para visualizarlo aquí</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-6 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: "#866857" }}
            >
              {uploading && <Loader2 size={16} className="animate-spin" />}
              {uploading ? "Subiendo..." : "Subir PDF"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Moodboard ────────────────────────────────────────────────────────────────

const PREDEFINED_CATEGORIES = [
  "Ceremonia", "Aperitivo", "Cena", "Fiesta",
  "Vestido", "Peluquería y maquillaje", "Papelería",
];

interface MoodboardEditorProps {
  note: Note;
  onClose: () => void;
  onAddColor: (hex: string, name?: string) => void;
  onRemoveColor: (colorId: string) => void;
  onAddCategory: (name: string) => void;
  onRemoveCategory: (categoryId: string) => void;
  onAddImage: (categoryId: string, url: string, caption?: string) => void;
  onRemoveImage: (categoryId: string, imageId: string) => void;
  onSaveTitle: (title: string) => void;
}

function MoodboardEditor({
  note, onClose, onAddColor, onRemoveColor,
  onAddCategory, onRemoveCategory, onAddImage, onRemoveImage, onSaveTitle,
}: MoodboardEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [newColorHex, setNewColorHex] = useState("#c7a977");
  const [newColorName, setNewColorName] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCatInput, setShowCatInput] = useState(false);

  return (
    <div className="flex flex-col overflow-y-auto" style={{ minHeight: 600 }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]"
        style={{ position: "sticky", top: 0, zIndex: 10 }}
      >
        <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
          <X size={18} />
        </button>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => onSaveTitle(title)}
          className="flex-1 bg-transparent font-playfair text-xl text-[var(--color-text)] focus:outline-none"
          placeholder="Título del moodboard..."
        />
        <button
          onClick={() => alert("Exportar a PDF — próximamente")}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: "#866857" }}
        >
          <Download size={14} />
          Exportar PDF
        </button>
      </div>

      <div className="px-6 py-8 space-y-12">
        {/* Color palette */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-playfair text-lg text-[var(--color-text)]">Paleta de colores</h3>
            <button
              onClick={() => setShowColorPicker((v) => !v)}
              className="flex items-center gap-1.5 text-sm text-[var(--color-accent)] font-medium hover:underline"
            >
              <Plus size={14} />
              Añadir color
            </button>
          </div>

          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-end gap-3 mb-5 p-4 rounded-xl bg-[var(--color-bg-2)] border border-[var(--color-border)]"
              >
                <div>
                  <label className="block text-xs text-[var(--color-text)]/50 mb-1">Color</label>
                  <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className="w-10 h-10 rounded-lg border border-[var(--color-border)] cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-[var(--color-text)]/50 mb-1">Nombre (opcional)</label>
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="ej: Oro rosado"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
                  />
                </div>
                <button
                  onClick={() => { onAddColor(newColorHex, newColorName || undefined); setNewColorName(""); setShowColorPicker(false); }}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: "#866857" }}
                >
                  Añadir
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {note.colorPalette.length === 0 ? (
            <p className="text-sm text-[var(--color-text)]/40 italic">Sin colores aún. Añade colores para tu paleta.</p>
          ) : (
            <div className="flex flex-wrap gap-5">
              {note.colorPalette.map((color) => (
                <div key={color.id} className="flex flex-col items-center gap-1.5 group">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-4 border-white shadow-lg" style={{ backgroundColor: color.hexColor }} />
                    <button
                      onClick={() => onRemoveColor(color.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-danger)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
                      <X size={9} />
                    </button>
                  </div>
                  <span className="text-xs text-[var(--color-text)]/50 font-mono">{color.hexColor}</span>
                  {color.name && <span className="text-xs text-[var(--color-text)]/60 text-center" style={{ maxWidth: 64 }}>{color.name}</span>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Inspiration categories */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-playfair text-lg text-[var(--color-text)]">Inspiración</h3>
            <button
              onClick={() => setShowCatInput((v) => !v)}
              className="flex items-center gap-1.5 text-sm text-[var(--color-accent)] font-medium hover:underline"
            >
              <Plus size={14} />
              Nueva categoría
            </button>
          </div>

          <AnimatePresence>
            {showCatInput && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 rounded-xl bg-[var(--color-bg-2)] border border-[var(--color-border)]"
              >
                <p className="text-xs text-[var(--color-text)]/50 mb-3">Categorías predefinidas:</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {PREDEFINED_CATEGORIES.filter((p) => !note.categories.find((c) => c.name === p)).map((p) => (
                    <button
                      key={p}
                      onClick={() => { onAddCategory(p); setShowCatInput(false); }}
                      className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors bg-white"
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nombre personalizado..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newCategoryName.trim()) {
                        onAddCategory(newCategoryName.trim());
                        setNewCategoryName("");
                        setShowCatInput(false);
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
                  />
                  <button
                    onClick={() => { if (newCategoryName.trim()) { onAddCategory(newCategoryName.trim()); setNewCategoryName(""); setShowCatInput(false); } }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: "#866857" }}
                  >
                    Añadir
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-10">
            {note.categories.map((cat) => (
              <MoodboardCategorySection
                key={cat.id}
                category={cat}
                onUpload={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    // Subir imagen al servidor
                    const url = await uploadImage(file);
                    onAddImage(cat.id, url);
                  } catch (error) {
                    console.error("Error al subir imagen:", error);
                    alert("Error al subir la imagen. Por favor, intenta de nuevo.");
                  }
                }}
                onRemoveImage={(imgId) => onRemoveImage(cat.id, imgId)}
                onRemoveCategory={() => onRemoveCategory(cat.id)}
              />
            ))}
            {note.categories.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed"
                style={{ borderColor: "var(--color-border)" }}
              >
                <ImageIcon size={36} style={{ opacity: 0.2, color: "var(--color-text)" }} />
                <p className="mt-3 text-sm text-[var(--color-text)]/40">Añade categorías para organizar tu inspiración</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

interface MoodboardCategorySectionProps {
  category: MoodboardCategory;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (imageId: string) => void;
  onRemoveCategory: () => void;
}

function MoodboardCategorySection({ category, onUpload, onRemoveImage, onRemoveCategory }: MoodboardCategorySectionProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputId = `moodboard-file-${category.id}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-playfair text-base text-[var(--color-text)]">{category.name}</h4>
        <div className="flex items-center gap-3">
          <label
            htmlFor={fileInputId}
            className="flex items-center gap-1.5 text-xs text-[var(--color-accent)] font-medium hover:underline cursor-pointer"
          >
            <Plus size={12} />
            Añadir imagen
          </label>
          <input id={fileInputId} type="file" accept="image/*" className="hidden" onChange={onUpload} />
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={onRemoveCategory} className="text-xs text-[var(--color-danger)] font-medium">Eliminar</button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-[var(--color-text)]/40 ml-1">Cancelar</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="text-[var(--color-text)]/30 hover:text-[var(--color-danger)] transition-colors">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {category.images.length === 0 ? (
        <label
          htmlFor={fileInputId}
          className="flex flex-col items-center justify-center w-full py-12 rounded-xl border-2 border-dashed border-[var(--color-border)] gap-2 hover:border-[var(--color-accent)]/40 transition-colors group cursor-pointer"
        >
          <ImageIcon size={24} className="text-[var(--color-text)]/20 group-hover:text-[var(--color-accent)]/40 transition-colors" />
          <span className="text-sm text-[var(--color-text)]/40">Haz clic para añadir fotos de inspiración</span>
        </label>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {category.images.map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden break-inside-avoid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.caption || ""} className="w-full object-cover rounded-xl" style={{ display: "block" }} />
              {img.caption && (
                <p className="text-xs text-[var(--color-text)]/60 mt-1 px-1 pb-1">{img.caption}</p>
              )}
              <button
                onClick={() => onRemoveImage(img.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <label
            htmlFor={fileInputId}
            className="flex items-center justify-center w-full py-8 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-colors break-inside-avoid cursor-pointer"
          >
            <Plus size={18} className="text-[var(--color-text)]/30" />
          </label>
        </div>
      )}
    </div>
  );
}

// ─── Note Card ────────────────────────────────────────────────────────────────

interface NoteCardProps {
  note: Note;
  vendors: Vendor[];
  onOpen: () => void;
  onDelete: () => void;
}

function NoteCard({ note, vendors, onOpen, onDelete }: NoteCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const vendor = vendors.find((v) => v.id === note.vendorId);
  const previewImage = note.type === "moodboard"
    ? note.categories.flatMap((c) => c.images)[0]?.url
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative rounded-2xl border border-[var(--color-border)] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      style={{ background: NOTE_BG[note.type], boxShadow: "0 2px 12px rgba(74,60,50,0.06)" }}
      onClick={onOpen}
    >
      {previewImage ? (
        <div className="h-36 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewImage} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center" style={{ background: NOTE_BG[note.type] }}>
          <span style={{ opacity: 0.15, color: "var(--color-text)" }}>
            {TYPE_ICONS[note.type]}
          </span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-quicksand font-semibold text-sm text-[var(--color-text)] leading-tight line-clamp-2">{note.title}</h4>
          <span className="flex-shrink-0 text-[var(--color-text)]/25 mt-0.5">
            {TYPE_ICONS[note.type]}
          </span>
        </div>
        {vendor && (
          <p className="text-xs text-[var(--color-accent)] mb-1 font-medium">{vendor.name}</p>
        )}
        <p className="text-xs text-[var(--color-text)]/40">{formatDate(note.updatedAt)}</p>

        {note.type === "moodboard" && note.colorPalette.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {note.colorPalette.slice(0, 5).map((c) => (
              <div key={c.id} className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c.hexColor }} />
            ))}
          </div>
        )}
      </div>

      {/* Delete button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        {confirmDelete ? (
          <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 shadow-md border border-[var(--color-border)]">
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-xs text-[var(--color-danger)] font-medium">Eliminar</button>
            <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }} className="text-xs text-[var(--color-text)]/40 ml-1">×</button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
            className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm border border-[var(--color-border)] hover:bg-[var(--color-danger)]/10 transition-colors"
          >
            <Trash2 size={11} className="text-[var(--color-text)]/50 hover:text-[var(--color-danger)]" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function NotesView() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [openNote, setOpenNote] = useState<Note | null>(null);
  const [filterType, setFilterType] = useState<NoteType | "all">("all");

  useEffect(() => {
    Promise.all([api.getNotes(), api.getVendors()])
      .then(([n, v]) => { setNotes(n); setVendors(v); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (data: { type: NoteType; title: string; vendorId?: string }) => {
    const note = await api.createNote(data);
    setNotes((prev) => [note, ...prev]);
    setOpenNote(note);
  };

  const handleDelete = async (id: string) => {
    await api.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (openNote?.id === id) setOpenNote(null);
  };

  const handleSaveContent = useCallback(async (id: string, content: string, title: string) => {
    const updated = await api.updateNote(id, { content, title });
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    setOpenNote((prev) => (prev?.id === id ? updated : prev));
  }, []);

  const patchOpenNote = useCallback((updated: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    setOpenNote(updated);
  }, []);

  const filtered = filterType === "all" ? notes : notes.filter((n) => n.type === filterType);

  // ── Note editor overlay ──
  if (openNote) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden" style={{ minHeight: 600 }}>
        {openNote.type === "text" && (
          <TextEditor
            note={openNote}
            onSave={(content, title) => handleSaveContent(openNote.id, content, title)}
            onClose={() => setOpenNote(null)}
          />
        )}
        {openNote.type === "pdf" && (
          <PdfViewer
            note={openNote}
            onSave={(content, title) => handleSaveContent(openNote.id, content, title)}
            onClose={() => setOpenNote(null)}
          />
        )}
        {openNote.type === "moodboard" && (
          <MoodboardEditor
            note={openNote}
            onClose={() => setOpenNote(null)}
            onAddColor={async (hex, name) => patchOpenNote(await api.addNoteColor(openNote.id, { hexColor: hex, name }))}
            onRemoveColor={async (colorId) => patchOpenNote(await api.removeNoteColor(openNote.id, colorId))}
            onAddCategory={async (name) => patchOpenNote(await api.addNoteCategory(openNote.id, { name }))}
            onRemoveCategory={async (catId) => patchOpenNote(await api.removeNoteCategory(openNote.id, catId))}
            onAddImage={async (catId, url, caption) => patchOpenNote(await api.addNoteCategoryImage(openNote.id, catId, { url, caption }))}
            onRemoveImage={async (catId, imgId) => patchOpenNote(await api.removeNoteCategoryImage(openNote.id, catId, imgId))}
            onSaveTitle={(title) => handleSaveContent(openNote.id, openNote.content, title)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-playfair text-2xl text-[var(--color-text)]">Notas y Moodboards</h2>
          <p className="text-sm text-[var(--color-text)]/50 mt-0.5">
            {notes.length} nota{notes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-colors"
          style={{ backgroundColor: "#866857" }}
        >
          <Plus size={16} />
          Añadir nota
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          ["all", "Todas"],
          ["text", "Texto"],
          ["pdf", "PDF"],
          ["moodboard", "Moodboard"],
        ] as [NoteType | "all", string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              filterType === t
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/30"
            }`}
          >
            {label}
            {t !== "all" && (
              <span className="ml-1.5 text-xs opacity-60">
                ({notes.filter((n) => n.type === t).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[var(--color-text)]/30" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--color-fill)" }}>
            <FileText size={28} className="text-[var(--color-text)]/30" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[var(--color-text)]/60 mb-1">Sin notas aún</p>
            <p className="text-sm text-[var(--color-text)]/40">Crea tu primera nota, PDF o moodboard</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-5 py-2.5 rounded-xl text-white font-medium text-sm"
            style={{ backgroundColor: "#866857" }}
          >
            Crear nota
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
        >
          <AnimatePresence>
            {filtered.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                vendors={vendors}
                onOpen={() => setOpenNote(note)}
                onDelete={() => handleDelete(note.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateNoteModal
            vendors={vendors}
            onClose={() => setShowCreate(false)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
