# src/app/app

Rutas protegidas de la aplicación (Next.js App Router).
Todas estas rutas requieren autenticación — el middleware redirige a `/login` si no hay sesión.

## Rutas

| Carpeta | URL | Componente principal |
|---------|-----|---------------------|
| `dashboard/` | `/app/dashboard` | Vista del dashboard con estadísticas, countdown, tareas y pagos. |
| `invitados/` | `/app/invitados` | Lista de invitados con filtros, RSVP, import/export. |
| `presupuesto/` | `/app/presupuesto` | Tabla de presupuesto por categorías y calendario de pagos. |
| `tasks/` | `/app/tasks` | To Do List agrupada por categorías. |
| `plano-mesas/` | `/app/plano-mesas` | Canvas interactivo de plano de mesas. |
| `calendario/` | `/app/calendario` | Calendario con tareas y pagos. |
| `proveedores/` | `/app/proveedores` | Gestión de proveedores. |
| `script/` | `/app/script` | Guión del día. |
| `notes/` | `/app/notes` | Notas, PDFs y moodboards. |
| `web/` | `/app/web` | Builder de la web pública de la boda. |
| `wedding/` | `/app/wedding` | Configuración de la boda (nombres, fecha, foto). |
| `account/` | `/app/account` | Gestión de cuenta, pago y cancelación. |
| `collaborators/` | `/app/collaborators` | Invitar y gestionar colaboradores. |
| `help/` | `/app/help` | FAQ y tutoriales. |

## Estructura de cada página

La mayoría de las páginas son thin wrappers que importan la vista del módulo:

```typescript
// src/app/app/mi-ruta/page.tsx
import MiVistaModulo from "@/components/views/mi-modulo";
export default function MiRutaPage() {
  return <MiVistaModulo />;
}
```

La lógica y los componentes viven en `src/components/views/[módulo]/`.

## Páginas con lógica propia (excepciones)

Algunas páginas tienen archivos auxiliares propios porque su lógica es muy específica de la ruta:

### `tasks/`
- `page.tsx` — página principal de tareas
- `use-tasks-page.ts` — hook de estado para esta página concreta
- `task-add-form.tsx` — formulario de añadir tarea
- `task-row-page.tsx` — fila de tarea con expansión inline

### `account/`
- `page.tsx` — página con tabs de secciones
- `account-helpers.tsx` — `SectionWrapper` y `FieldGroup` compartidos por secciones
- `cancel-section.tsx`, `close-account-section.tsx`, `payment-section.tsx` — secciones individuales

## Cómo añadir una nueva ruta protegida

1. Crea la carpeta: `src/app/app/mi-ruta/`.
2. Crea `page.tsx` importando la vista del módulo correspondiente.
3. Si la ruta necesita lógica específica de navegación, añádela aquí; si no, todo va en `src/components/views/`.
4. Añade la ruta al `module-nav.tsx` o al `topbar.tsx` según corresponda.

## Protección de rutas

El middleware en `src/middleware.ts` verifica el JWT en cada petición a `/app/*`.
Si no hay token válido, redirige a `/login`.
