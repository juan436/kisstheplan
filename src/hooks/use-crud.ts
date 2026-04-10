"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook genérico para operaciones CRUD con estado de carga, error y busy por ítem.
 *
 * Convención:
 *  - T debe tener { id: string }
 *  - C = tipo de datos para crear
 *  - U = tipo de datos para actualizar (usa `never` si no se necesita)
 *  - No pasar más de 1 objeto de opciones (regla: máx 4 params por función)
 */
interface CrudOptions<T, C, U> {
  load: () => Promise<T[]>;
  create?: (data: C) => Promise<T>;
  update?: (id: string, data: U) => Promise<T>;
  remove?: (id: string) => Promise<void>;
}

export function useCrud<T extends { id: string }, C = Partial<T>, U = Partial<T>>({
  load: loadFn,
  create: createFn,
  update: updateFn,
  remove: removeFn,
}: CrudOptions<T, C, U>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  // Ref para evitar closures obsoletos sin requerir memoización en el llamador
  const fns = useRef({ loadFn, createFn, updateFn, removeFn });
  fns.current = { loadFn, createFn, updateFn, removeFn };

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fns.current.loadFn());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const create = useCallback(async (data: C): Promise<T> => {
    const item = await fns.current.createFn!(data);
    setItems(prev => [...prev, item]);
    return item;
  }, []);

  const update = useCallback(async (id: string, data: U): Promise<void> => {
    setBusy(p => ({ ...p, [id]: true }));
    try {
      const updated = await fns.current.updateFn!(id, data);
      setItems(prev => prev.map(i => i.id === id ? updated : i));
    } finally {
      setBusy(p => { const n = { ...p }; delete n[id]; return n; });
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    setBusy(p => ({ ...p, [id]: true }));
    try {
      await fns.current.removeFn!(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } finally {
      setBusy(p => { const n = { ...p }; delete n[id]; return n; });
    }
  }, []);

  return { items, setItems, loading, error, busy, reload, create, update, remove };
}
