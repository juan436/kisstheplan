"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/services";
import type { Note, NoteType, Vendor } from "@/types";

export function useNotes() {
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

  return {
    notes, vendors, loading, filtered,
    showCreate, setShowCreate,
    openNote, setOpenNote,
    filterType, setFilterType,
    handleCreate, handleDelete, handleSaveContent, patchOpenNote,
  };
}
