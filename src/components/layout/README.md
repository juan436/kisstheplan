# src/components/layout

Componentes de estructura que envuelven las páginas. Se usan en los layouts de Next.js App Router.

## Componentes

| Componente | Dónde se usa | Propósito |
|-----------|-------------|-----------|
| `topbar.tsx` | `src/app/app/layout.tsx` | Barra superior con logo, nombre de boda, avatar y menú de usuario. |
| `module-nav.tsx` | `src/app/app/layout.tsx` | Navegación horizontal entre los 10 módulos de la app. |
| `landing-nav.tsx` | `src/app/layout.tsx` (landing) | Navbar de la página pública con logo, links y botones CTA. |
| `footer.tsx` | Landing page | Footer con links y copyright. |

## Rutas del menú de usuario (topbar.tsx)

Las rutas están en el array de `DropdownItem` dentro de `topbar.tsx`:
- `/app/wedding` → Mi boda
- `/app/account` → Mi cuenta
- `/app/collaborators` → Colaboradores
- `/app/help` → Ayuda

## Cómo añadir una nueva opción al menú de usuario

1. Añade una nueva ruta en `src/app/app/[ruta]/page.tsx`.
2. Añade un `<DropdownItem>` en `topbar.tsx` con el href y label correspondiente.

## Cómo añadir un nuevo módulo a la navegación principal

1. Crea la ruta en `src/app/app/[modulo]/page.tsx`.
2. Añade la entrada en `module-nav.tsx` con el icono y label.
3. Crea la vista en `src/components/views/[modulo]/`.
