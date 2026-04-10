"use client";

import { useState, useCallback } from "react";

/**
 * Hook para manejar cambios pendientes por ID antes de guardar.
 * Patrón: editar localmente → guardar → limpiar entrada.
 *
 * Uso típico: notas, fechas o asignaciones pendientes en listas editables.
 *   const notes = usePendingMap<string>();
 *   notes.set(id, "texto");          // guardar cambio local
 *   notes.get(id, task.notes)        // obtener valor o fallback
 *   notes.remove(id)                 // limpiar tras guardar
 *   notes.map                        // Record<string, T> para leer en JSX
 */
export function usePendingMap<T = string>() {
  const [map, setMap] = useState<Record<string, T>>({});

  const set = useCallback((id: string, val: T) =>
    setMap(prev => ({ ...prev, [id]: val })), []);

  const get = useCallback((id: string, fallback?: T): T | undefined =>
    id in map ? map[id] : fallback, [map]);

  const remove = useCallback((id: string) =>
    setMap(prev => { const n = { ...prev }; delete n[id]; return n; }), []);

  const clear = useCallback(() => setMap({}), []);

  const has = useCallback((id: string) => id in map, [map]);

  return { map, setMap, set, get, remove, clear, has };
}
