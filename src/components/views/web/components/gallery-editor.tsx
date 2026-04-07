"use client";

import { Plus, X } from "lucide-react";
import { getImgUrl } from "@/lib/img-url";
import { usePhotoUpload } from "../hooks/use-photo-upload";

interface GalleryEditorProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function GalleryEditor({ images, onChange }: GalleryEditorProps) {
  const { uploading, handleUpload } = usePhotoUpload((url) => onChange([...images, url]));

  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((img, i) => (
        <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
          <img src={getImgUrl(img)} alt="" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange(images.filter((_, idx) => idx !== i))}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/70 transition-colors">
            <X size={10} />
          </button>
        </div>
      ))}
      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-cta hover:bg-cta/5 transition-all text-brand hover:text-cta">
        {uploading
          ? <span className="text-[11px]">Subiendo...</span>
          : <><Plus size={16} /><span className="text-[10px] mt-1">Añadir</span></>}
        <input type="file" accept="image/*" className="hidden" disabled={uploading}
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
      </label>
    </div>
  );
}
