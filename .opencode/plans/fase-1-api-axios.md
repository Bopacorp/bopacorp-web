# Plan: Fase 1 — Fundación API y Cliente Axios

**Fecha:** 2026-05-31  
**Estado:** En progreso  
**Contexto:** El frontend actual tiene un cliente HTTP roto (`apiClient` con fetch) que construye URLs incorrectas, no maneja refresh tokens, y mezcla estrategias (fetch relativo vs absoluto). Esta fase lo reemplaza todo por un cliente axios con interceptores.

---

## Problemas Actuales Identificados

### 1. Desajuste crítico: `.env` vs URL de API

`.env` actual:
```
VITE_API_URL=http://localhost:3000
```

`src/lib/api.ts` (línea 1):
```ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
```

**Problema:** `apiClient('/auth/login')` construye `http://localhost:3000/auth/login`. El backend espera `/api/v1/auth/login`. **Las peticiones de auth fallan con 404**.

`CmsDemoPage` usa `fetch('/api/v1/cms/landing')` — esto sí funciona porque pasa por el proxy de Vite (`/api` → `localhost:3000`), pero `apiClient` construye URLs absolutas que **bypassean el proxy**.

### 2. Sin manejo de refresh tokens

El backend rota refresh tokens: cada llamada a `/refresh` elimina el token anterior y emite uno nuevo. El frontend actual:
- No detecta expiración del access token
- No tiene lógica de refresh automático
- No reintenta peticiones que fallan por 401

### 3. Dos clientes HTTP diferentes

| Componente | Método | URL |
|---|---|---|
| `AuthContext.login()` | `apiClient` (absoluta) | `http://localhost:3000/auth/login` ❌ |
| `CmsDemoPage` | `fetch` (relativa) | `/api/v1/cms/landing` ✅ (por proxy) |

### 4. Sin validación de variables de entorno

Si `VITE_API_URL` falta, el fallback podría funcionar por casualidad en dev, pero en prod fallaría silenciosamente.

### 5. `.env.example` no documenta nada

Solo contiene `VITE_API_URL=http://localhost:3000` sin explicar la interacción con el proxy de Vite.

---

## Decisiones Arquitectónicas

| Decisión | Justificación |
|----------|---------------|
| **Axios en vez de fetch** | Interceptores permiten manejo limpio de refresh tokens con cola de requests. Con fetch puro se reimplementaría lo mismo con más bugs. |
| **Sin TanStack Query** | App pequeña, sin problemas de rendimiento. Se agregará solo si aparece repetición de requests o pantallas lentas. |
| **Vite proxy en dev** | `VITE_API_URL=/api/v1` para que todas las peticiones pasen por el proxy. En prod, URL absoluta. |
| **Sin cambios en estructura de directorios** | Petición explícita del usuario: "let there until we discuss about it". |

---

## Tareas de Implementación

### Tarea 1.1 — Instalar `axios`

**Comando:** `npm install axios`

**Verificación:** `axios` aparece en `package.json` dependencies.

---

### Tarea 1.2 — Crear `src/services/api.ts` (cliente axios con interceptores)

**Nuevo archivo:** `src/services/api.ts`

**Responsabilidades:**
1. Crear instancia axios con `baseURL` desde `VITE_API_URL`
2. Request interceptor: inyectar `Authorization: Bearer <accessToken>` desde `localStorage`
3. Response interceptor: capturar 401, pausar requests pendientes, llamar `/auth/refresh`, reintentar
4. Si refresh falla → limpiar localStorage, redirigir a `/login`

**Patrón de refresh con cola:**

```ts
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await api.post('/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        refreshSubscribers.forEach((cb) => cb(accessToken));
        refreshSubscribers = [];
        return api(originalRequest);
      } catch (err) {
        localStorage.clear(); // o remove solo auth keys
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

**Manejo de tipos cuando `@bopacorp/shared` no está:**
Definir tipos locales mínimos en `src/services/api.types.ts`. Marcar con `// TODO: replace with @bopacorp/shared when available`.

---

### Tarea 1.3 — Crear `src/services/auth.service.ts`

**Funciones:**
- `login(data: { email, password })` → POST `/auth/login`
- `refresh(refreshToken: string)` → POST `/auth/refresh`
- `logout(refreshToken: string)` → POST `/auth/logout`

Cada función usa la instancia axios de `api.ts`, extrae `response.data.data`, y lanza `Error` con mensaje cuando `success: false`.

---

### Tarea 1.4 — Crear `src/services/env.ts`

**Responsabilidad:** Leer y validar `VITE_API_URL` al inicio. Fallar ruidosamente si falta.

```ts
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL as string,
};
if (!ENV.API_URL) {
  throw new Error('VITE_API_URL is required. Check your .env file. See .env.example for reference.');
}
```

Importar desde `main.tsx` para validación temprana.

---

### Tarea 1.5 — Corregir `.env` y `.env.example`

**`.env` (dev):**
```
VITE_API_URL=/api/v1
```

**`.env.example`:**
```
# Dev: relative path routes through Vite proxy
VITE_API_URL=/api/v1

# Prod: absolute URL
# VITE_API_URL=https://api.bopacorp.com/api/v1
```

---

### Tarea 1.6 — Actualizar `AuthContext.tsx`

1. Reemplazar `apiClient` por `authService.login()`
2. Eliminar `accessToken` del estado de React (ya está en localStorage, `api.ts` lo lee)
3. Guardar `tokenExpiresAt = Date.now() + expiresIn * 1000` en localStorage
4. `logout`: llamar `authService.logout(refreshToken)` al backend antes de limpiar
5. Mantener `hasPermission` para Fase 2

---

### Tarea 1.7 — Actualizar `RequireAuth.tsx`

Reemplazar spinner inline por `PageLoader` de `src/shared/ui`. Mantener comportamiento inline render (redirect viene en Fase 2).

---

### Tarea 1.8 — Actualizar `CmsDemoPage.tsx`

Reemplazar `fetch('/api/v1/cms/landing')` por `api.get('/cms/landing')`.

---

### Tarea 1.9 — Eliminar `src/lib/api.ts`

Verificar que ningún otro archivo lo importa, luego eliminar.

---

### Tarea 1.10 — Verificar build limpio

```bash
npm run build   # tsc -b && vite build
npm run lint    # eslint .
```

**Criterios:** sin errores de tipo, sin imports no usados, sin nuevos lint errors.

---

## Mapa de Archivos

| Archivo | Acción |
|---|---|
| `package.json` | + axios |
| `src/services/api.ts` | Crear |
| `src/services/auth.service.ts` | Crear |
| `src/services/env.ts` | Crear |
| `.env` | Modificar |
| `.env.example` | Modificar |
| `src/modules/auth/context/AuthContext.tsx` | Modificar |
| `src/modules/auth/components/RequireAuth.tsx` | Modificar |
| `src/modules/landing/pages/CmsDemoPage.tsx` | Modificar |
| `src/lib/api.ts` | Eliminar |
| `vite.config.ts` | Sin cambios (proxy ya correcto) |

---

## Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| `@bopacorp/shared` no disponible | Definir tipos locales temporales. Marcar TODOs. |
| Race condition en refresh | Implementar patrón `isRefreshing` + `refreshSubscribers`. Solo un refresh a la vez. |
| Devs con `.env` viejo | Validación en `env.ts` falla con mensaje claro. Documentar en `AGENTS.md`. |
| Login roto durante refactor | Cambiar todo de auth en un solo paso. Verificar inmediatamente después. |

---

## Checklist de Verificación

- [ ] `npm install axios` ejecutado
- [ ] `src/services/api.ts` creado con interceptores
- [ ] `src/services/auth.service.ts` creado
- [ ] `src/services/env.ts` creado y valida `VITE_API_URL`
- [ ] `.env` tiene `VITE_API_URL=/api/v1`
- [ ] `.env.example` documentado
- [ ] `AuthContext.tsx` usa `auth.service.ts`
- [ ] `AuthContext.tsx` guarda `tokenExpiresAt`
- [ ] `logout()` llama al backend
- [ ] `RequireAuth.tsx` usa `PageLoader`
- [ ] `CmsDemoPage.tsx` usa axios
- [ ] `src/lib/api.ts` eliminado
- [ ] `npm run build` pasa limpio
- [ ] `npm run lint` pasa limpio
- [ ] Login funciona con backend en `localhost:3000`
- [ ] Refresh token rota correctamente
