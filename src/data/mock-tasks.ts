import type { Task } from "@/types";

export const mockTasks: Task[] = [
  { id: "t1", title: "Confirmar menú con catering", status: "pending", dueDate: "2026-03-15", category: "Catering" },
  { id: "t2", title: "Enviar invitaciones digitales", status: "pending", dueDate: "2026-03-20", category: "Invitados" },
  { id: "t3", title: "Prueba de vestido final", status: "pending", dueDate: "2026-04-10", category: "Vestuario" },
  { id: "t4", title: "Reunión con fotógrafo", status: "done", dueDate: "2026-02-10", category: "Foto" },
  { id: "t5", title: "Reservar autobús invitados", status: "pending", dueDate: "2026-05-01", category: "Transporte" },
  { id: "t6", title: "Elegir música ceremonia", status: "done", dueDate: "2026-01-20", category: "Música" },
  { id: "t7", title: "Contratar DJ", status: "done", dueDate: "2025-12-15", category: "Música" },
  { id: "t8", title: "Decidir distribución mesas", status: "pending", dueDate: "2026-06-01", category: "Organización" },
  { id: "t9", title: "Seleccionar tarta nupcial", status: "pending", dueDate: "2026-04-15", category: "Catering" },
  { id: "t10", title: "Firmar contrato finca", status: "done", dueDate: "2025-11-01", category: "Finca" },
];
