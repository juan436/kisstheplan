"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, X, ImagePlus } from "lucide-react";
import { api } from "@/services";

interface CoverPhotoUploadProps {
  currentUrl: string | null;
  weddingId: string;
  onUploaded: (url: string) => void;
  onRemove: () => void;
}

export function CoverPhotoUpload({ currentUrl, weddingId, onUploaded, onRemove }: CoverPhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Solo se permiten imágenes (jpg, png, webp)"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("La imagen no puede superar los 5 MB"); return; }
    setError(null);
    setUploading(true);
    try {
      const { url } = await api.uploadPhoto(file);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const staticBase = apiBase.replace(/\/api$/, "");
      const fullUrl = url.startsWith("http") ? url : `${staticBase}${url}`;
      await api.updateWedding(weddingId, { photoUrl: fullUrl });
      onUploaded(fullUrl);
    } catch {
      setError("Error al subir la imagen. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  }, [weddingId, onUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }, [processFile]);

  return (
    <div className="relative w-full">
      {currentUrl ? (
        <div className="relative w-full aspect-[3/1] rounded-2xl overflow-hidden group">
          <img src={currentUrl} alt="Foto de portada" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 bg-white/90 hover:bg-white text-[#866857] text-[13px] font-medium px-4 py-2 rounded-xl transition-colors">
              <Camera size={16} />Cambiar foto
            </button>
            <button onClick={onRemove} className="flex items-center gap-2 bg-white/90 hover:bg-white text-red-500 text-[13px] font-medium px-4 py-2 rounded-xl transition-colors">
              <X size={16} />Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`w-full aspect-[3/1] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer select-none ${dragging ? "border-[#CBA978] bg-[#fdf6ec] scale-[1.01]" : "border-[#e8ded1] bg-white hover:bg-[#f9f6f3] hover:border-[#d4bfa8]"}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform ${dragging ? "bg-[#fbefd8] scale-110" : "bg-[#f2efe9]"}`}>
            {uploading
              ? <div className="w-6 h-6 border-2 border-[#CBA978] border-t-transparent rounded-full animate-spin" />
              : <ImagePlus size={26} className="text-[#866857]" />
            }
          </div>
          <div className="text-center">
            <p className="text-[#866857] font-medium">
              {uploading ? "Subiendo imagen…" : dragging ? "Suelta aquí la imagen" : "Arrastra tu foto aquí"}
            </p>
            {!uploading && !dragging && (
              <p className="text-[#a89f91] text-[13px] mt-1">
                o <span className="underline underline-offset-2">haz clic para seleccionar</span> · JPG, PNG, WEBP · máx. 5 MB
              </p>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-[13px] text-red-500 text-center">{error}</p>}

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileInput} />
    </div>
  );
}
