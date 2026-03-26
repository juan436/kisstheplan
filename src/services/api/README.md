# src/services/api

Capa de acceso a la API REST del backend (NestJS en `localhost:3001/api`).
Toda petición HTTP al backend pasa por aquí.

## Archivos

| Archivo | Propósito |
|---------|-----------|
| `http-client.ts` | Cliente HTTP base. Adjunta el JWT en `Authorization: Bearer`, gestiona el refresco automático cuando el token expira (401). |
| `auth-helpers.ts` | Funciones de autenticación: `apiLogin`, `apiRegister`, `apiLogout`, `apiCreateWedding`, `isAuthenticated`, `clearTokens`. Gestiona tokens en `localStorage`. |
| `api-core.ts` | Métodos de datos principales: wedding, guests, budget, tasks, dashboard, guest-groups. |
| `api-tasks-vendors.ts` | Métodos de tareas avanzadas y proveedores (vendors). |
| `api-content.ts` | Métodos de módulos de contenido: script, seating, notes, web-page, calendar, uploads. |
| `index.ts` | Barrel que ensambla todos los métodos en el objeto `api` y exporta la interfaz `ApiService`. |

## Flujo de autenticación

```
Usuario hace login
  → apiLogin() guarda accessToken + refreshToken en localStorage
  → http-client adjunta accessToken en cada petición
  → Si 401 → http-client llama apiRefreshToken() → rota tokens → reintenta petición
  → Si refresh falla → clearTokens() → redirect a /login
```

## Cómo añadir un nuevo endpoint

1. Añade el método en el archivo correspondiente (`api-core.ts`, `api-content.ts`, etc.).
2. Añade la firma al tipo `ApiService` en `index.ts`.
3. Úsalo desde el hook del módulo con `import { api } from "@/services"`.

### Ejemplo

```typescript
// En api-content.ts
export async function getMyNewData(): Promise<MyType[]> {
  return httpGet<MyType[]>("/my-endpoint");
}

// En index.ts — ApiService interface
getMyNewData: () => Promise<MyType[]>;

// En index.ts — objeto api
getMyNewData: getMyNewData,
```

## Cómo añadir Google OAuth

1. Añadir en `auth-helpers.ts`:
   ```typescript
   export async function apiGoogleCallback(code: string) {
     const res = await fetch(`${API_URL}/auth/google/callback?code=${code}`);
     const data = await res.json();
     localStorage.setItem("accessToken", data.accessToken);
     localStorage.setItem("refreshToken", data.refreshToken);
     return data.user;
   }
   ```
2. El backend ya tiene (o debe tener) `GET /api/auth/google` y `GET /api/auth/google/callback`.
3. Añadir `loginWithGoogle()` en `src/hooks/useAuth.tsx` que llame a `apiGoogleCallback`.

## Variables de entorno

| Variable | Valor local | Descripción |
|----------|------------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | URL base del backend |
