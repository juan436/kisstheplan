/**
 * GeneralInfo
 *
 * Qué hace: Bloque consolidado de información general del proveedor. Permite la edición rápida 
 *           de datos de contacto y la gestión dinámica de categorías (añadir/eliminar).
 * Recibe:   - vendor: Objeto Vendor con los datos actuales.
 *           - onFieldBlur: Handler para guardar cambios en campos de texto (contacto).
 *           - onUpdateCategories: Callback para actualizar el array de categorías.
 * Provee:   - Interfaz de edición inline para contacto.
 *           - Sistema de gestión de categorías con chips interactivos y autocompletado desde BD.
 */
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { api } from "@/services";
import type { Vendor, ExpenseCategory } from "@/types";

interface GeneralInfoProps {
  vendor: Vendor;
  onFieldBlur: (field: string, value: string | boolean | number) => void;
  onUpdateCategories: (categories: string[]) => void;
}

export function GeneralInfo({ vendor, onFieldBlur, onUpdateCategories }: GeneralInfoProps) {
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [customCat, setCustomCat] = useState("");

  useEffect(() => {
    api.getBudgetCategories()
      .then((cats: ExpenseCategory[]) => setDbCategories(cats.map((c) => c.name)))
      .catch(() => {});
  }, []);

  const toggleCategory = (cat: string) => {
    const newCats = vendor.categories.includes(cat)
      ? vendor.categories.filter((c) => c !== cat)
      : [...vendor.categories, cat];
    onUpdateCategories(newCats);
  };

  const addCustomCat = () => {
    const trimmed = customCat.trim();
    if (trimmed && !vendor.categories.includes(trimmed)) {
      onUpdateCategories([...vendor.categories, trimmed]);
      setCustomCat("");
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 mb-5 shadow-card space-y-6">
      {/* SECCIÓN: CONTACTO */}
      <div>
        <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest mb-3">Datos de contacto</h3>
        <div className="space-y-3">
          {[
            { label: "NOMBRE DEL CONTACTO", field: "contactName", value: vendor.contactName },
            { label: "E-MAIL", field: "email", value: vendor.email },
            { label: "TELÉFONO", field: "phone", value: vendor.phone },
            { label: "WEB", field: "web", value: vendor.web },
            { label: "RRSS", field: "social", value: vendor.social },
          ].map(({ label, field, value }) => (
            <div key={field} className="flex items-baseline gap-3">
              <span className="text-[10px] font-bold text-brand uppercase tracking-widest w-36 flex-shrink-0">{label}</span>
              <input
                key={value as string}
                defaultValue={value as string}
                onBlur={(e) => onFieldBlur(field, e.target.value)}
                placeholder="—"
                className="flex-1 bg-transparent border-b border-border/50 text-[13px] text-text outline-none focus:border-cta pb-0.5 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN: CATEGORÍAS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest">Categorías</h3>
          <span className="text-[9px] text-text/40 font-medium">Click para eliminar</span>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {vendor.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-accent/10 text-accent border border-accent/20 flex items-center gap-1.5 hover:bg-accent hover:text-white transition-all group"
            >
              {cat}
              <X size={10} className="text-accent/50 group-hover:text-white" />
            </button>
          ))}
          {vendor.categories.length === 0 && (
            <span className="text-[12px] italic text-text/40">Sin categorías asignadas</span>
          )}
        </div>
        
        <div className="pt-4 border-t border-border/30">
           <label className="text-[10px] font-bold text-brand uppercase tracking-widest block mb-2">Añadir categoría</label>
           <div className="flex flex-wrap gap-1.5 mb-3">
              {dbCategories
                .filter(c => !vendor.categories.includes(c))
                .slice(0, 8) // Limit visible suggestions
                .map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-bg2 text-text border border-border hover:border-accent hover:bg-white transition-all"
                >
                  {cat}
                </button>
              ))}
           </div>
           <div className="flex gap-2">
              <input
                value={customCat}
                onChange={(e) => setCustomCat(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomCat()}
                placeholder="Nueva categoría personalizada..."
                className="flex-1 bg-bg2 border border-border rounded-lg px-3 py-1.5 text-[12px] text-text outline-none focus:border-cta transition-colors"
              />
              <button
                onClick={addCustomCat}
                disabled={!customCat.trim()}
                className="w-8 h-8 rounded-lg bg-bg2 border border-border flex items-center justify-center text-brand hover:border-accent hover:text-cta transition-all disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
