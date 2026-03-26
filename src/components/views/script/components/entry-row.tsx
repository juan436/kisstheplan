"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Trash2, Type } from "lucide-react";
import type { ScriptEntry } from "@/types";
import { TimePill } from "./time-pill";
import { StyleBar } from "./style-bar";

export function EntryRow({ entry, onUpdate, onDelete }: {
  entry: ScriptEntry;
  onUpdate: (id: string, data: Partial<ScriptEntry>) => void;
  onDelete: (id: string) => void;
}) {
  const [editTitle, setEditTitle] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [titleVal, setTitleVal] = useState(entry.title);
  const [descVal, setDescVal] = useState(entry.description ?? "");
  const [showStyle, setShowStyle] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setTitleVal(entry.title); }, [entry.title]);
  useEffect(() => { setDescVal(entry.description ?? ""); }, [entry.description]);

  const saveTitle = () => { if (titleVal.trim()) onUpdate(entry.id, { title: titleVal.trim() }); setEditTitle(false); };
  const saveDesc = () => { onUpdate(entry.id, { description: descVal }); setEditDesc(false); };
  const fsClass = { sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl" }[entry.style.fontSize ?? "base"];

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="group flex gap-3 items-start py-2.5 px-2 rounded-xl transition-colors hover:bg-[var(--color-bg-2)]">
      <div className="mt-2 opacity-0 group-hover:opacity-30 transition-opacity cursor-grab" style={{ color: "var(--color-border)" }}>
        <GripVertical size={15} />
      </div>
      <div className="flex flex-col items-center mt-2 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: "var(--color-accent)", background: "var(--color-bg)" }} />
        <div className="w-px flex-1 min-h-[36px] mt-1" style={{ background: "var(--color-fill)" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1"><TimePill entry={entry} onUpdate={(d) => onUpdate(entry.id, d)} /></div>
        {editTitle ? (
          <input ref={titleRef} value={titleVal} onChange={(e) => setTitleVal(e.target.value)}
            onBlur={saveTitle} onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setTitleVal(entry.title); setEditTitle(false); } }}
            className={`w-full bg-transparent outline-none border-b ${fsClass}`}
            style={{ color: entry.style.color ?? "var(--color-text)", fontWeight: entry.style.bold ? 700 : 600, borderColor: "var(--color-accent)" }} autoFocus />
        ) : (
          <div className={`${fsClass} cursor-text leading-snug`}
            style={{ color: entry.style.color ?? "var(--color-text)", fontWeight: entry.style.bold ? 700 : 600 }}
            onClick={() => { setEditTitle(true); setTimeout(() => titleRef.current?.focus(), 10); }}>
            {entry.title}
          </div>
        )}
        {editDesc ? (
          <textarea ref={descRef} value={descVal} onChange={(e) => setDescVal(e.target.value)}
            onBlur={saveDesc} onKeyDown={(e) => { if (e.key === "Escape") { setDescVal(entry.description ?? ""); setEditDesc(false); } }}
            className="w-full bg-transparent outline-none text-xs mt-0.5 resize-none border-b"
            style={{ color: "var(--color-accent)", borderColor: "var(--color-border)", minHeight: 36 }} rows={2} autoFocus />
        ) : (
          <div className="text-xs mt-0.5 cursor-text min-h-[16px]" style={{ color: "var(--color-accent)" }}
            onClick={() => { setEditDesc(true); setTimeout(() => descRef.current?.focus(), 10); }}>
            {entry.description || <span className="opacity-30">Añadir descripción…</span>}
          </div>
        )}
        <AnimatePresence>
          {showStyle && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <StyleBar style={entry.style} onChange={(s) => onUpdate(entry.id, { style: { ...entry.style, ...s } })} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2 flex-shrink-0">
        <button onClick={() => setShowStyle((v) => !v)} title="Estilo"
          className="p-1 rounded-lg transition-colors"
          style={{ color: showStyle ? "var(--color-accent)" : "var(--color-border)" }}>
          <Type size={13} />
        </button>
        <button onClick={() => onDelete(entry.id)} title="Eliminar"
          className="p-1 rounded-lg transition-colors hover:text-red-400"
          style={{ color: "var(--color-border)" }}>
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}
