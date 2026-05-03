"use client";

/**
 * usePhotoUpload
 *
 * Qué hace: hook para subir y gestionar la foto de portada de la web pública.
 * Recibe:   weddingId, initialUrl (URL actual de la foto).
 * Provee:   photoUrl, uploading flag, handleUpload, handleRemove.
 */

import { useState, useCallback } from "react";
import { api } from "@/services";

export function usePhotoUpload(onUploaded: (url: string) => void) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const { url } = await api.uploadPhoto(file);
      onUploaded(url);
    } catch {
      setUploadError("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }, [onUploaded]);

  return { uploading, uploadError, handleUpload };
}
