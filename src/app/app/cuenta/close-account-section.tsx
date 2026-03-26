import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./cuenta-helpers";

export function CerrarCuenta() {
  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-8">Cerrar cuenta</h2>
      <div className="max-w-[420px]">
        <div className="bg-[#f5f2ed] rounded-2xl p-8 space-y-5">
          <span className="inline-block bg-[#866857] text-white text-[11px] font-bold uppercase tracking-[2px] px-4 py-1.5 rounded-full">
            Importante
          </span>
          <p className="text-[14px] text-text/80 leading-relaxed">
            Al cerrar tu cuenta,{" "}
            <strong>toda tu información será eliminada de forma definitiva</strong>{" "}
            y no podrás volver a acceder a ella. Esto incluye los datos de tu
            boda, invitados, presupuesto, proveedores y cualquier contenido que
            hayas creado.
          </p>
          <p className="text-[14px] text-text/80 leading-relaxed">
            Te recomendamos <strong>descargar tus datos</strong> antes de
            proceder con el cierre de la cuenta.
          </p>
          <button className="text-[13px] text-cta hover:text-[#b08f5d] font-medium transition-colors uppercase tracking-wider">
            Descargar mis datos
          </button>
        </div>
        <div className="pt-8">
          <Button className="w-full py-6 bg-[#866857] hover:bg-[#6b5549] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
            <span className="text-[14px] font-bold tracking-[2px] uppercase">Cerrar cuenta</span>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
