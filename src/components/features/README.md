# src/components/features

Componentes de presentación agrupados por área funcional. A diferencia de `views/`, estos componentes
son **puramente visuales** y reciben todos sus datos como props. No manejan estado propio de negocio.

## Subdirectorios

| Directorio | Dónde se renderiza | Contenido |
|-----------|-------------------|-----------|
| `auth/` | `/login`, `/register` | `StepIndicator` para el registro en 3 pasos. |
| `dashboard/` | `/app/dashboard` | `WeddingCard`, `CountdownSection`, `TasksPanel`, `PaymentsPanel`. |
| `guests/` | Página de invitados (legacy) | Componentes de tabla de invitados. |
| `landing/` | `/` (página pública) | `Hero`, `FeaturesStrip`, `AboutSection`, `ModulesGrid`, `PricingSection`. |

## Diferencia entre `features/` y `views/`

| | `features/` | `views/` |
|--|------------|---------|
| Estado | No — solo recibe props | Sí — tiene su propio hook con estado |
| Lógica | No | Sí — en `hooks/use-[módulo].ts` |
| API calls | No | Sí — a través del hook |
| Uso | Componentes de presentación pura | Páginas completas con estado |

## Cuándo añadir aquí vs en views/

- **Aquí**: El componente recibe datos como props y solo renderiza (gráfico, card, sección de landing).
- **En views/**: El componente necesita cargar datos de la API, tiene estado de UI complejo, gestiona formularios.

## Cómo añadir una nueva sección de landing

1. Crea el componente en `src/components/features/landing/mi-seccion.tsx`.
2. Impórtalo en `src/app/page.tsx` (la landing page) y añádelo al JSX.
