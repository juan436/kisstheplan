"use client";

import { useState, useCallback } from "react";

/**
 * Hook genérico para manejar el estado de un modal.
 * Acepta un payload opcional tipado T (datos a pasar al modal).
 *
 * Uso:
 *   const modal = useModal<Guest>();
 *   modal.openWith(guest);  // abre con datos
 *   modal.open              // boolean
 *   modal.payload           // Guest | undefined
 *   modal.close()           // cierra y limpia payload
 */
export function useModal<T = undefined>() {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<T | undefined>(undefined);

  const openWith = useCallback((data?: T) => {
    setPayload(data);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setPayload(undefined);
  }, []);

  return { open, payload, openWith, close };
}
