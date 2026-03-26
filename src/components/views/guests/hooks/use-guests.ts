"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import type { Guest, GuestGroup, GuestStats } from "@/types";
import type { CreateGuestData, UpdateGuestData } from "@/services/api";
import type { ColKey } from "../constants/guests.constants";
import { buildGuestUpdate } from "../helpers/guests.helpers";

export function useGuests() {
  const { wedding } = useAuth();

  const [guests,   setGuests]   = useState<Guest[]>([]);
  const [groups,   setGroups]   = useState<GuestGroup[]>([]);
  const [stats,    setStats]    = useState<GuestStats | null>(null);
  const [showAddModal,    setShowAddModal]    = useState(false);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [rsvpFilter,   setRsvpFilter]   = useState("");
  const [groupFilter,  setGroupFilter]  = useState("");
  const [editingCell,  setEditingCell]  = useState<{ guestId: string; field: string } | null>(null);
  const [editValue,    setEditValue]    = useState("");
  const [deletingId,   setDeletingId]   = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [showColMenu,  setShowColMenu]  = useState(false);
  const [hiddenCols,   setHiddenCols]   = useState<Set<ColKey>>(new Set(["address", "role", "group"]));
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickName,    setQuickName]    = useState("");
  const [quickGroupId, setQuickGroupId] = useState("");
  const [quickSaving,  setQuickSaving]  = useState(false);
  const [mealOptions,     setMealOptions]     = useState(["Carne", "Pescado", "Vegetariano", "Infantil"]);
  const [allergyOptions,  setAllergyOptions]  = useState(["Gluten", "Lactosa", "Frutos secos", "Marisco"]);
  const [transportPoints, setTransportPoints] = useState<string[]>([]);
  const [importingExcel,  setImportingExcel]  = useState(false);
  const [importError,     setImportError]     = useState("");

  const colMenuRef   = useRef<HTMLDivElement>(null);
  const quickAddRef  = useRef<HTMLDivElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const show = (col: ColKey) => !hiddenCols.has(col);
  const toggleCol = (col: ColKey) =>
    setHiddenCols((prev) => { const n = new Set(prev); n.has(col) ? n.delete(col) : n.add(col); return n; });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) setShowColMenu(false);
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) setShowQuickAdd(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const loadGroups = useCallback(async () => { setGroups(await api.getGuestGroups()); }, []);

  const loadData = useCallback(async () => {
    const filters: Record<string, string> = {};
    if (rsvpFilter) filters.rsvp = rsvpFilter;
    if (searchQuery.trim()) filters.search = searchQuery.trim();
    const [guestData, statsData] = await Promise.all([api.getGuests(filters), api.getGuestStats()]);
    setGuests(guestData);
    setStats(statsData);
  }, [rsvpFilter, searchQuery]);

  useEffect(() => { if (!wedding) return; loadData(); loadGroups(); }, [wedding, loadData, loadGroups]);

  const handleAddGuest = async (data: CreateGuestData) => { await api.createGuest(data); await loadData(); };

  const handleExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.match(/\.xlsx?$/i)) { setImportError("Solo se admiten archivos .xlsx o .xls"); return; }
    setImportingExcel(true); setImportError("");
    try {
      const result = await api.importGuestsExcel(file);
      await loadData();
      if (result.imported === 0) setImportError("No se encontraron invitados en el archivo.");
    } catch { setImportError("Error al importar. Revisa el formato del archivo."); }
    finally { setImportingExcel(false); if (excelInputRef.current) excelInputRef.current.value = ""; }
  };

  const handleQuickAdd = async () => {
    const name = quickName.trim();
    if (!name) return;
    setQuickSaving(true);
    const parts = name.split(" ");
    await api.createGuest({ firstName: parts[0], lastName: parts.slice(1).join(" "), rsvpStatus: "pending", listName: "A", groupId: quickGroupId || undefined });
    setQuickName(""); setQuickGroupId(""); setQuickSaving(false);
    await loadData();
  };

  const startEdit = (guestId: string, field: string, val: string) => { setEditingCell({ guestId, field }); setEditValue(val); };
  const cancelEdit = () => { setEditingCell(null); setEditValue(""); };
  const isEditing  = (guestId: string, field: string) => editingCell?.guestId === guestId && editingCell?.field === field;

  const saveEdit = async () => {
    if (!editingCell) return;
    const { guestId, field } = editingCell;
    try { await api.updateGuest(guestId, buildGuestUpdate(field, editValue)); await loadData(); } catch { /**/ }
    cancelEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); saveEdit(); }
    else if (e.key === "Escape") cancelEdit();
  };

  const handleDelete = async (id: string) => {
    try { await api.deleteGuest(id); setDeletingId(null); await loadData(); } catch { /**/ }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    await api.createGuestGroup(newGroupName.trim()); setNewGroupName(""); await loadGroups();
  };

  const handleDeleteGroup = async (id: string) => {
    await api.deleteGuestGroup(id); setDeletingGroupId(null);
    await Promise.all([loadGroups(), loadData()]);
  };

  const handleAssignGroup = async (guestId: string, groupId: string) => {
    setEditingCell(null);
    await api.updateGuest(guestId, { groupId: groupId || undefined } as UpdateGuestData);
    await loadData();
  };

  const filteredGuests = groupFilter ? guests.filter((g) => g.groupId === groupFilter) : guests;
  const groupMap = new Map(groups.map((g) => [g.id, g.name]));
  const getFirst = (g: Guest) => g.name.split(" ")[0] ?? g.name;
  const getLast  = (g: Guest) => g.lastName ?? g.name.split(" ").slice(1).join(" ");

  return {
    guests, filteredGuests, groups, stats, groupMap, getFirst, getLast, loadData,
    showAddModal, setShowAddModal, showGroupsModal, setShowGroupsModal, showConfigModal, setShowConfigModal,
    searchQuery, setSearchQuery, rsvpFilter, setRsvpFilter, groupFilter, setGroupFilter,
    editingCell, editValue, setEditValue, isEditing, startEdit, cancelEdit, saveEdit, handleKeyDown,
    deletingId, setDeletingId, handleDelete,
    newGroupName, setNewGroupName, deletingGroupId, setDeletingGroupId,
    handleAddGuest, handleCreateGroup, handleDeleteGroup, handleAssignGroup,
    showColMenu, setShowColMenu, show, toggleCol, colMenuRef,
    showQuickAdd, setShowQuickAdd, quickName, setQuickName, quickGroupId, setQuickGroupId,
    quickSaving, handleQuickAdd, quickAddRef,
    mealOptions, setMealOptions, allergyOptions, setAllergyOptions, transportPoints, setTransportPoints,
    excelInputRef, importingExcel, importError, setImportError, handleExcelFile,
  };
}
