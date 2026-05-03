/**
 * SectionEditor
 *
 * Qué hace: wrapper de sección editable con toggle de visibilidad y campo de título.
 * Recibe:   title, enabled, onToggle, children (contenido de la sección).
 * Provee:   export { SectionEditor } — usado por ContentStep para cada sección de la web.
 */

import type { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SectionEditorProps {
  defaultTitle: string;
  title?: string;
  visible?: boolean;
  onTitleChange: (value: string) => void;
  onVisibilityToggle: () => void;
  children: ReactNode;
}

export function SectionEditor({
  defaultTitle, title, visible = true, onTitleChange, onVisibilityToggle, children,
}: SectionEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onVisibilityToggle}
          title={visible ? "Ocultar sección" : "Mostrar sección"}
          className={`shrink-0 transition-colors ${visible ? "text-cta" : "text-brand/30"}`}>
          {visible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <Input
          value={title || ""}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={defaultTitle}
          className="text-[12px] h-7 font-medium flex-1"
        />
      </div>
      {visible && <div>{children}</div>}
    </div>
  );
}
