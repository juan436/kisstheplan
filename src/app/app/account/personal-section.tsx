"use client";

import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { SectionWrapper, FieldGroup } from "./account-helpers";

export function DatosPersonales() {
  const { user } = useAuth();

  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-8">Datos personales</h2>
      <div className="space-y-5 max-w-[380px]">
        <FieldGroup label="Nombre">
          <Input
            value={user?.name ?? ""}
            readOnly
            className="bg-[#f2efe9] border-none h-12 rounded-xl"
          />
        </FieldGroup>
        <FieldGroup label="Email">
          <Input
            value={user?.email ?? ""}
            readOnly
            className="bg-[#f2efe9] border-none h-12 rounded-xl"
          />
        </FieldGroup>
        <p className="text-[12px] text-brand pt-2">
          Edición de datos personales próximamente.
        </p>
      </div>
    </SectionWrapper>
  );
}
