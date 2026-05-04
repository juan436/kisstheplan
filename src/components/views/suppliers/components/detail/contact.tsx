/**
 * DetailContact
 *
 * Qué hace: Bloque de visualización y edición rápida de datos de contacto. Permite modificar 
 *           información esencial como nombre de contacto, email, teléfono, web y redes sociales.
 * Recibe:   - vendor: Objeto Vendor con los datos actuales.
 *           - onFieldBlur: Handler común para guardar cambios automáticamente cuando el usuario 
 *                          deja de editar un campo (onBlur).
 * Provee:   - Lista de inputs estilizados que se sincronizan con la API mediante blur.
 *           - Layout adaptativo de etiquetas fijas e inputs flexibles.
 */
import type { Vendor } from "@/types";

interface DetailContactProps {
  vendor: Vendor;
  onFieldBlur: (field: string, value: string | boolean | number) => void;
}

export function DetailContact({ vendor, onFieldBlur }: DetailContactProps) {
  return (
    <div className="bg-white rounded-xl p-5 mb-5 shadow-card space-y-3">
      <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest mb-3">Datos de contacto</h3>
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
            defaultValue={value as string}
            onBlur={(e) => onFieldBlur(field, e.target.value)}
            placeholder="—"
            className="flex-1 bg-transparent border-b border-border/50 text-[13px] text-text outline-none focus:border-cta pb-0.5 transition-colors"
          />
        </div>
      ))}
    </div>
  );
}
