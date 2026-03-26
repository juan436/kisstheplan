# src/components/ui

Componentes de interfaz de usuario **sin estado propio ni lógica de negocio**.
Son los "ladrillos" que forman todos los demás componentes.

## Principio

Un componente UI solo recibe props y renderiza. No llama a la API ni usa hooks de negocio.
Si necesitas lógica, crea un hook en `src/hooks/` o `src/components/views/[módulo]/hooks/`.

## Componentes disponibles

| Componente | Variantes / Props clave |
|-----------|------------------------|
| `button.tsx` | `variant`: cta, primary, secondary, ghost. `size`: sm, default, lg, full. |
| `card.tsx` | `variant`: default, elevated. `padding`: default, compact, none. |
| `input.tsx` | Props estándar de `<input>` + `error?: string`. |
| `label.tsx` | Label accesible para formularios. |
| `logo.tsx` | `type`: short, default, light. `href` opcional. |
| `avatar.tsx` | `name`: string → genera iniciales. `size`: sm, default. |
| `badge.tsx` | `variant`: confirmed, pending, rejected, default. |
| `progress.tsx` | `value`, `max`. Barra de progreso accesible. |
| `countdown-ring.tsx` | Anillo SVG circular. `size`: sm, lg. `value`, `max`. |
| `stat-card.tsx` | Card de estadística con `value` y `label`. |
| `container.tsx` | Wrapper de max-width centrado. |
| `table.tsx` | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`. |
| `modal.tsx` | Modal con overlay y gestión de foco. Usa `useModal` del hook genérico. |
| `module-placeholder.tsx` | Muestra "módulo en construcción" para rutas no implementadas. |

## Cómo añadir un nuevo componente UI

1. Crea el archivo en este directorio: `src/components/ui/mi-componente.tsx`.
2. Usa `cva` (Class Variance Authority) para variantes si el componente tiene múltiples estados.
3. Exporta solo los tipos que los consumidores necesitan.
4. **No importes** nada de `src/services`, `src/hooks` de negocio, ni `src/components/views`.

## Tokens de diseño

Los colores y espaciados vienen de CSS variables en `src/app/globals.css`.
Úsalos como clases Tailwind: `text-text`, `bg-bg`, `border-border`, `text-accent`, etc.
**No uses colores hardcodeados** — usa los tokens para mantener coherencia.
