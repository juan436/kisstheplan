# src/components/views

Vistas completas de cada módulo de la aplicación. Cada módulo tiene su propio directorio
con estructura estandarizada de 4 carpetas + 2 archivos raíz.

## Módulos

| Directorio | Módulo | Ruta en App |
|-----------|--------|-------------|
| `budget/` | Presupuesto | `/app/presupuesto` |
| `calendar/` | Calendario | `/app/calendario` |
| `guests/` | Invitados | `/app/invitados` |
| `notes/` | Notas y Moodboards | `/app/notes` |
| `script/` | Guión del día | `/app/script` |
| `seating/` | Plano de mesas | `/app/plano-mesas` |
| `suppliers/` | Proveedores | `/app/proveedores` |
| `tasks/` | Tareas (vista modular) | — |
| `web/` | Web pública builder | `/app/web` |

## Estructura estándar de cada módulo

```
views/[módulo]/
├── index.tsx                     # Barrel: re-exporta el default de [módulo]-view.tsx
├── [módulo]-view.tsx             # Componente raíz: consume el hook, compone sub-componentes
├── hooks/
│   └── use-[módulo].ts           # TODA la lógica de estado y API calls del módulo
├── components/
│   ├── [componente-a].tsx        # Sub-componentes visuales (< 150 líneas)
│   └── [componente-b].tsx
├── constants/
│   └── [módulo].constants.ts     # Constantes, enums, opciones, labels del módulo
└── helpers/
    └── [módulo].helpers.ts       # Funciones puras de transformación de datos
```

## Reglas

- **`[módulo]-view.tsx`**: Solo JSX. Llama al hook y pasa props a los hijos. Máx 150 líneas.
- **`hooks/use-[módulo].ts`**: Toda lógica, estado, y API calls. Devuelve un objeto plano.
- **`components/`**: Componentes visuales puros que reciben props. Sin llamadas directas a la API.
- **`constants/`**: Arrays, mapas, strings fijos. Sin imports de React.
- **`helpers/`**: Funciones puras (`input → output`). Sin estado ni efectos secundarios.

## Cómo añadir un nuevo módulo

1. Crea el directorio: `src/components/views/mi-modulo/`.
2. Crea las 4 subcarpetas: `hooks/`, `components/`, `constants/`, `helpers/`.
3. Escribe el hook en `hooks/use-mi-modulo.ts` con `useAuth()` y guard `if (!wedding) return`.
4. Crea `mi-modulo-view.tsx` que consuma el hook.
5. Crea `index.tsx`: `export { default } from "./mi-modulo-view"`.
6. Crea la ruta en `src/app/app/mi-modulo/page.tsx` que importe desde `@/components/views/mi-modulo`.
7. Añade la navegación en `src/components/layout/module-nav.tsx`.

## Patrón estándar del hook

```typescript
"use client";
import { useEffect, useState } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";

export function useMiModulo() {
  const { wedding } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wedding) return;   // Guard: espera a que el contexto esté listo
    api.getData().then(setData).finally(() => setLoading(false));
  }, [wedding]);

  return { data, loading };
}
```
