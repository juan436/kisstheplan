"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionWrapper, FieldGroup } from "./account-helpers";
import { apiChangePassword } from "@/services/api/index";

export function CambiarContrasena() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!current || !next || !confirm) { setMsg({ text: "Rellena todos los campos", ok: false }); return; }
    if (next.length < 8) { setMsg({ text: "Mínimo 8 caracteres", ok: false }); return; }
    if (next !== confirm) { setMsg({ text: "Las contraseñas no coinciden", ok: false }); return; }

    setLoading(true);
    setMsg(null);
    try {
      await apiChangePassword(current, next);
      setMsg({ text: "Contraseña actualizada correctamente", ok: true });
      setCurrent(""); setNext(""); setConfirm("");
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : "Error al cambiar la contraseña", ok: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-8">Cambiar contraseña</h2>
      <div className="space-y-5 max-w-[380px]">
        <FieldGroup label="Contraseña actual">
          <Input type="password" placeholder="••••••••" value={current} onChange={(e) => setCurrent(e.target.value)} className="bg-[#f2efe9] border-none h-12 rounded-xl" disabled={loading} />
        </FieldGroup>
        <FieldGroup label="Nueva contraseña">
          <Input type="password" placeholder="Mínimo 8 caracteres" value={next} onChange={(e) => setNext(e.target.value)} className="bg-[#f2efe9] border-none h-12 rounded-xl" disabled={loading} />
        </FieldGroup>
        <FieldGroup label="Confirmar contraseña">
          <Input type="password" placeholder="Repite la nueva contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="bg-[#f2efe9] border-none h-12 rounded-xl" disabled={loading} />
        </FieldGroup>
        {msg && (
          <p className={`text-[13px] ${msg.ok ? 'text-success' : 'text-danger'}`}>{msg.text}</p>
        )}
        <Button variant="primary" size="full" onClick={handleSave} disabled={loading}>
          {loading ? "Guardando..." : "Guardar contraseña"}
        </Button>
      </div>
    </SectionWrapper>
  );
}
