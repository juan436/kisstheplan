"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionWrapper, FieldGroup } from "./account-helpers";

export function CambiarContrasena() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function handleSave() {
    if (!current || !next || !confirm) { setMsg({ text: "Rellena todos los campos", ok: false }); return; }
    if (next.length < 8) { setMsg({ text: "Mínimo 8 caracteres", ok: false }); return; }
    if (next !== confirm) { setMsg({ text: "Las contraseñas no coinciden", ok: false }); return; }
    // TODO: llamar PATCH /auth/password cuando esté disponible
    setMsg({ text: "Funcionalidad disponible próximamente", ok: false });
  }

  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-8">Cambiar contraseña</h2>
      <div className="space-y-5 max-w-[380px]">
        <FieldGroup label="Contraseña actual">
          <Input type="password" placeholder="••••••••" value={current} onChange={(e) => setCurrent(e.target.value)} className="bg-[#f2efe9] border-none h-12 rounded-xl" />
        </FieldGroup>
        <FieldGroup label="Nueva contraseña">
          <Input type="password" placeholder="Mínimo 8 caracteres" value={next} onChange={(e) => setNext(e.target.value)} className="bg-[#f2efe9] border-none h-12 rounded-xl" />
        </FieldGroup>
        <FieldGroup label="Confirmar contraseña">
          <Input type="password" placeholder="Repite la nueva contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="bg-[#f2efe9] border-none h-12 rounded-xl" />
        </FieldGroup>
        {msg && (
          <p className={`text-[13px] ${msg.ok ? 'text-success' : 'text-danger'}`}>{msg.text}</p>
        )}
        <Button variant="primary" size="full" onClick={handleSave}>
          Guardar contraseña
        </Button>
      </div>
    </SectionWrapper>
  );
}
