/**
 * TextEditor
 *
 * Qué hace: editor de texto enriquecido para notas de tipo texto (negrita, cursiva, subrayado, fuente, listas).
 * Recibe:   note (Note), onSave, onClose callbacks.
 * Provee:   export { TextEditor } — usado por NotesView al abrir una nota de tipo "text".
 */

import { useState, useEffect, useRef } from "react";
import { X, Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import type { Note } from "@/types";

const FONTS = [
  { label: "Quicksand", value: "Quicksand, sans-serif" },
  { label: "Playfair", value: "'Playfair Display', serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
];

interface TextEditorProps {
  note: Note;
  onSave: (content: string, title: string) => void;
  onClose: () => void;
}

export function TextEditor({ note, onSave, onClose }: TextEditorProps) {
  const [title, setTitle] = useState(note.title);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
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

  const saveSelection = () => {
    const sel = window.getSelection();
    savedRangeRef.current = sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
  };

  const applyFont = (font: string) => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) { sel.removeAllRanges(); sel.addRange(savedRangeRef.current); }
    }
    exec("fontName", font);
  };

  const handleSave = () => {
    onSave(editorRef.current?.innerHTML || "", title);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const imageItem = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
    if (!imageItem) return;
    e.preventDefault();
    const file = imageItem.getAsFile();
    if (!file) return;
    try {
      const url = await uploadImage(file);
      exec("insertImage", url);
    } catch { /* silent */ }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 600 }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors"><X size={18} /></button>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-transparent font-playfair text-lg text-[var(--color-text)] focus:outline-none" placeholder="Título..." />
        <button onClick={handleSave} className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: saved ? "#7db87d" : "#866857" }}>
          {saved ? "Guardado ✓" : "Guardar"}
        </button>
      </div>

      <div className="flex items-center gap-1 px-6 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-2)] flex-wrap">
        <select onMouseDown={saveSelection} onChange={(e) => { applyFont(e.target.value); (e.target as HTMLSelectElement).value = ""; }}
          defaultValue=""
          className="text-xs border border-[var(--color-border)] rounded px-1.5 py-0.5 bg-white text-[var(--color-text)]/60 cursor-pointer mr-1">
          <option value="" disabled>Fuente</option>
          {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        {[
          { icon: <Bold size={14} />, cmd: "bold", title: "Negrita" },
          { icon: <Italic size={14} />, cmd: "italic", title: "Cursiva" },
          { icon: <Underline size={14} />, cmd: "underline", title: "Subrayado" },
        ].map(({ icon, cmd, title: t }) => (
          <button key={cmd} onMouseDown={(e) => { e.preventDefault(); exec(cmd); }} title={t}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--color-fill)] text-[var(--color-text)]/60 hover:text-[var(--color-text)] transition-colors">
            {icon}
          </button>
        ))}
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        {[{ label: "S", size: "2" }, { label: "M", size: "3" }, { label: "L", size: "4" }, { label: "XL", size: "5" }].map(({ label, size }) => (
          <button key={label} onMouseDown={(e) => { e.preventDefault(); exec("fontSize", size); }}
            className="px-2 py-0.5 text-xs rounded hover:bg-[var(--color-fill)] text-[var(--color-text)]/60 hover:text-[var(--color-text)] transition-colors font-medium">
            {label}
          </button>
        ))}
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        {["#4A3C32", "#866857", "#c7a977", "#7db87d", "#c47a7a", "#5b7fa6"].map((color) => (
          <button key={color} onMouseDown={(e) => { e.preventDefault(); exec("foreColor", color); }}
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
            style={{ backgroundColor: color }} />
        ))}
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        <button onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }} title="Lista de viñetas"
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--color-fill)] text-[var(--color-text)]/60 hover:text-[var(--color-text)] transition-colors">
          <List size={14} />
        </button>
        <button onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }} title="Lista numerada"
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--color-fill)] text-[var(--color-text)]/60 hover:text-[var(--color-text)] transition-colors">
          <ListOrdered size={14} />
        </button>
      </div>

      <div ref={editorRef} contentEditable suppressContentEditableWarning
        className="flex-1 px-8 py-6 overflow-y-auto focus:outline-none text-[var(--color-text)] leading-relaxed"
        style={{ fontFamily: "Quicksand, sans-serif", fontSize: 15, minHeight: 420 }}
        data-placeholder="Empieza a escribir aquí..."
        onPaste={handlePaste} />
    </div>
  );
}
