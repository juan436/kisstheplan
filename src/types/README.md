# src/types

Interfaces y tipos TypeScript compartidos en todo el frontend.

## Archivo principal: `index.ts`

Contiene todas las interfaces del dominio de negocio:

| Interface | Descripción |
|-----------|-------------|
| `User` | Usuario autenticado (`id`, `email`, `name`, `avatarUrl`). |
| `Wedding` | Boda (`id`, `slug`, `partner1Name`, `weddingDate`, `venueName`, `budget`, `mealOptions`, etc.). |
| `Guest` | Invitado con RSVP, plato, alergias, transporte, grupo. |
| `GuestGroup` | Grupo de invitados (familia, pareja). |
| `GuestStats` | Estadísticas `{total, confirmed, pending, rejected}`. |
| `ExpenseCategory` | Categoría de presupuesto con `items[]` embebidos. |
| `ExpenseItem` | Subcategoría con `estimated`, `real`. |
| `BudgetSummary` | Totales `{estimated, real, difference, paid, pending}`. |
| `PaymentSchedule` | Pago programado con `amount`, `dueDate`, `paid`. |
| `Vendor` | Proveedor con contacto, estado, contrato, menú staff. |
| `Task` | Tarea con `status`, `stage`, `category`, `dueDate`, `notes`. |
| `WebPageConfig` | Configuración de la web pública de la boda. |
| `ScriptEntry` | Entrada del guión del día con hora y estilo. |
| `ScriptArea` | Área del espacio en el guión. |
| `SeatingPlan` | Plano de mesas con `tables[]`. |
| `SeatingTable` | Mesa con `shape`, `capacity`, `assignments[]`. |
| `Note` | Nota (`text`, `pdf`, `moodboard`). |
| `NoteType` | Enum: `"text" \| "pdf" \| "moodboard"`. |

## Dónde añadir tipos nuevos

- **Tipos de dominio** (datos que vienen del backend): en `index.ts`.
- **Tipos de UI local** (estado de un componente concreto): junto al componente o hook que los usa.
- **DTOs de API** (datos que se envían al crear/actualizar): en `src/services/api/index.ts` (interfaz `ApiService`).

## Convención de mapeo Backend → Frontend

El backend usa nombres más verbosos que el frontend normaliza:

| Backend | Frontend |
|---------|---------|
| `firstName + lastName` | `name` (concatenado) |
| `mealChoice` | `dish` |
| `rsvpStatus` | `rsvp` |
| `actual` (budget) | `real` |
| `paidAt` (Date/null) | `paid` (boolean) |
| `_id` (ObjectId) | `id` (string) |

Este mapeo ocurre en los métodos `toResponse()` del backend (NestJS services).
