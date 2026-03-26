# src/hooks

Hooks genéricos y reutilizables que NO pertenecen a ningún módulo concreto.
Los hooks específicos de un módulo van en `src/components/views/[módulo]/hooks/`.

## Archivos

| Archivo | Propósito |
|---------|-----------|
| `useAuth.tsx` | Contexto global de autenticación. Expone `user`, `wedding`, `login`, `register`, `logout`, `refreshUserData`. |
| `use-crud.ts` | Hook genérico para operaciones CRUD sobre una lista (`load`, `create`, `update`, `remove`, `reload`). |
| `use-inline-edit.ts` | Estado para edición inline de celdas (`startEdit`, `cancelEdit`, `handleKeyDown`). |
| `use-modal.ts` | Estado booleano para abrir/cerrar modales, con payload opcional (`open`, `close`, `payload`). |
| `use-pending-map.ts` | Mapa de cambios pendientes por ID (`get`, `set`, `remove`, `clear`, `setMap`). Útil para guardar borradores antes de enviar al servidor. |

## Cuándo añadir un hook aquí

Un hook va aquí si:
- Es usado por **2 o más módulos distintos**, O
- Es una abstracción de patrón de UI (modal, edición inline, CRUD genérico).

Si el hook solo lo usa un módulo, colócalo en `src/components/views/[módulo]/hooks/`.

## Cómo extender

### Añadir registro con Google OAuth

El flujo de Google OAuth necesita cambios en varios sitios:

1. **Backend** (`backend/src/auth/strategies/google.strategy.ts`): añadir `GoogleStrategy` con `passport-google-oauth20`.
2. **API service** (`src/services/api/auth-helpers.ts`): añadir `apiGoogleLogin(token)` que llame a `POST /api/auth/google`.
3. **`useAuth.tsx`** (este directorio): añadir `loginWithGoogle()` que llame a `apiGoogleLogin` y guarde tokens.
4. **Página de login** (`src/app/login/page.tsx`): añadir botón "Entrar con Google" que llame a `loginWithGoogle()`.

### Añadir un hook CRUD personalizado

Usa `useCrud<T, CreateDTO, UpdateDTO>` pasando las funciones `load`, `create`, `update`, `remove`:

```typescript
const { items, loading, create, update, remove } = useCrud<MyType, CreateDto, UpdateDto>({
  load:   () => api.getItems(),
  create: (data) => api.createItem(data),
  update: (id, data) => api.updateItem(id, data),
  remove: (id) => api.deleteItem(id),
});
```
