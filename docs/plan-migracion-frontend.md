# Plan de Migración Frontend — BOPACORP Web

**Estado:** En progreso  
**Fecha:** 2026-05-31  
**Objetivo:** Estabilizar la capa de API, auth con refresh tokens, RBAC, y estandarizar primitivas UI sin agregar TanStack Query ni caché.

---

## Principios

- **Stack simple:** Sin TanStack Query, sin caché. Solo fetch directo mediante axios con interceptores.
- **Mínimo código necesario:** No abstracciones para un solo uso. No configurabilidad no pedida.
- **Cambios quirúrgicos:** Tocar solo lo necesario. No refactorizar código no roto.
- **Español en UI:** Todo copy de interfaz en español.
- **Fuente de verdad ejecutable:** Si hay conflicto entre docs y código/config, ganan los ejecutables.

---

## Fase 1 — Fundación API y Cliente Axios

**Objetivo:** Reemplazar `apiClient` roto por un cliente axios robusto con manejo de refresh tokens.

### Tareas

- [ ] Instalar `axios`.
- [ ] Crear `src/services/api.ts`:
  - Instancia axios con `baseURL` desde `VITE_API_URL`.
  - Request interceptor: inyectar `Authorization: Bearer <accessToken>` desde `localStorage`.
  - Response interceptor: capturar 401, pausar requests pendientes, llamar `/api/v1/auth/refresh`, reintentar con nuevo token.
  - Si refresh falla: limpiar localStorage, redirigir a `/login`.
- [ ] Crear `src/services/auth.service.ts`:
  - `login({ email, password })` → POST `/api/v1/auth/login`.
  - `refresh(refreshToken)` → POST `/api/v1/auth/refresh`.
  - `logout(refreshToken)` → POST `/api/v1/auth/logout`.
- [ ] Crear `src/services/env.ts` (validación de variables de entorno):
  - Fallar ruidosamente en startup si `VITE_API_URL` falta.
- [ ] Corregir `.env` y proxy:
  - `.env`: `VITE_API_URL=/api/v1` (desarrollo, usa proxy).
  - `.env.example`: documentar valores dev y prod.
  - `vite.config.ts`: proxy `/api` → `http://localhost:3000`.
- [ ] Reemplazar todo uso de `fetch` y `apiClient` actual por el nuevo cliente.

### Verificación

- `npm run build` pasa sin errores de tipo.
- Login funciona con backend corriendo en `localhost:3000`.
- Refresh token rota correctamente (backend emite nuevo refresh token en cada refresh).

---

## Fase 2 — Auth y RBAC

**Objetivo:** Integrar el frontend con el modelo de auth y permisos del backend exactamente.

### Backend Context

- JWT access token expira en `15m`. Payload: `{ sub, email, roles[], permissions[] }`.
- Refresh token es opaco, expira en `7d`, rota en cada uso.
- Permissions son granulares: `content_blocks.read`, `users.create`, etc.
- El seed `01_rbac_permissions.seed.sql` crea permisos para todos los modulos: Users, RBAC, Organization, Catalog, CMS, CRM (contact_requests), y Employability.

### Tareas

- [ ] Actualizar `src/modules/auth/context/AuthContext.tsx`:
  - Agregar `profile` a `AuthUser` (el backend ya lo devuelve en login response).
  - Escuchar evento `bopacorp:token-refreshed` del interceptor para actualizar datos del usuario via `GET /api/v1/auth/me`.
  - En refresh fallido: limpiar todo y redirigir a `/login`.
- [ ] Crear `src/hooks/usePermission.ts`:
  - `hasPermission(code: string)` — match exacto.
  - `hasAnyPermission(codes: string[])` — match de cualquiera.
- [ ] Crear `src/modules/auth/components/Can.tsx`:
  - `<Can permission="contact_requests.read">{children}</Can>`.
  - `<Can any={['job_vacancies.read', 'job_vacancies.create']}>{children}</Can>`.
- [ ] Actualizar `src/modules/auth/components/RequireAuth.tsx`:
  - Mostrar `PageLoader` mientras verifica auth.
  - Redirigir a `/login` si no hay usuario (no renderizar inline).
  - Después de refresh exitoso, redirigir de vuelta a la ruta original.
- [ ] Actualizar `src/modules/admin/AdminApp.tsx`:
  - Filtrar items del sidebar según `user.permissions`.
  - Ocultar secciones a las que el usuario no tiene acceso.
  - Mostrar "Acceso denegado" si el usuario navega directamente a una ruta sin permiso.
- [ ] Actualizar `src/App.tsx`:
  - Agregar ruta pública `/login`.
  - Proteger `/admin-dashboard` con `RequireAuth`.

### Mapeo de permisos reales

| Sección Frontend | Permiso Backend |
|------------------|-----------------|
| CRM | `contact_requests.read` |
| Empleabilidad | `job_vacancies.read` |
| Usuarios | `users.read` |
| Catálogo | `catalog_items.read` |
| Organización | `departments.read` |
| CMS | `content_blocks.read` |
| RBAC | `roles.read` |

### Dependencias de backend

- `GET /api/v1/auth/me` — Devuelve datos del usuario autenticado (id, email, roles, permissions, profile). Llamado después de cada refresh proactivo para mantener permisos actualizados.
- `GET /catalog/content-blocks` — Tiene `authorize` comentado; solo requiere autenticación, no permiso específico.

### Verificación

- Token expirado dispara refresh automáticamente y reintenta el request original.
- Usuario sin permiso `contact_requests.read` no ve el item "CRM" en el sidebar.
- Usuario no autenticado que accede a `/admin` es redirigido a `/login`.
- Después de login exitoso, redirige de vuelta a la ruta original protegida.

---

## Fase 3 — Primitivas UI Compartidas

**Objetivo:** Estandarizar estados de carga, error, vacío y tablas en todo el panel admin.

### Tareas

- [ ] Mejorar `src/shared/ui/page-loader.tsx`:
  - Agregar prop opcional `message?: string`.
  - Usar tokens semánticos (`bg-background`, `text-foreground`).
- [ ] Mejorar `src/shared/ui/error-state.tsx`:
  - Soporte para callback `onRetry?: () => void`.
  - Mapeo de códigos de error del backend a mensajes en español:
    - `UNAUTHORIZED` → "Sesión expirada. Por favor inicia sesión nuevamente."
    - `VALIDATION_ERROR` → "Algunos campos tienen errores. Revísalos e intenta de nuevo."
    - `FORBIDDEN` → "No tienes permisos para realizar esta acción."
    - `NOT_FOUND` → "El recurso solicitado no existe."
    - `CONFLICT` → "Ya existe un registro con esos datos."
    - Genérico → "Ocurrió un error inesperado. Intenta de nuevo más tarde."
- [ ] Crear `src/shared/ui/empty-state.tsx`:
  - Props: `title`, `description`, `icon?`, `action?`.
  - Usar componente `Empty` de shadcn si existe, o construir propio.
- [ ] Crear `src/components/ui/data-table.tsx`:
  - Genérico `DataTable<T>` usando `@tanstack/react-table` (ya está en dependencias).
  - Columnas sortables.
  - Botones de acción (editar/eliminar/ver) con gating `<Can>`.
  - Soporte para paginación (props `page`, `limit`, `total`, `onPageChange`).
- [ ] Crear `src/components/ui/confirm-dialog.tsx`:
  - `title`, `description`, `onConfirm`, `onCancel`, `isLoading?`.
  - Usar `Dialog` + `DialogTitle` (requerido para accesibilidad).
- [ ] Integrar `sonner` (ya en dependencias) para toasts:
  - Éxito: `sonner.success("Operación completada")`.
  - Error: `sonner.error("Ocurrió un error")`.
- [ ] Estandarizar todas las secciones admin (`CRM`, `Empleabilidad`, etc.) para usar:
  - `PageLoader` en loading.
  - `ErrorState` en error con retry.
  - `EmptyState` cuando no hay datos.
  - `DataTable` para listados.

### Verificación

- Todas las secciones admin muestran spinner consistente al cargar.
- Errores de red muestran mensaje en español con botón "Reintentar".
- Tablas usan `DataTable<T>` genérico.
- Toasts aparecen en acciones de mutación (guardar, eliminar).

---

## Fase 4 — Integración Backend por Módulo

**Objetivo:** Conectar cada sección admin a endpoints reales del backend.

### Tareas

- [ ] Crear servicios por dominio:
  - `src/modules/admin/services/auth.service.ts` (login, logout, refresh).
  - `src/modules/admin/services/cms.service.ts` (GET `/cms/landing`).
  - `src/modules/admin/services/crm.service.ts` (placeholder para CRUD).
  - `src/modules/admin/services/employability.service.ts` (placeholder para CRUD).
- [ ] Conectar `CmsDemoPage` al servicio CMS:
  - Usar axios instance (no fetch directo).
  - Manejar loading/error/empty con primitivas estandarizadas.
- [ ] Conectar sección CRM:
  - Determinar endpoints reales del backend (aún no expuestos, puede requerir trabajo backend).
  - Implementar CRUD con `DataTable` + `ConfirmDialog`.
- [ ] Conectar sección Employability:
  - Determinar endpoints reales.
  - Implementar CRUD.
- [ ] Agregar formularios con React Hook Form + Zod:
  - Instalar `react-hook-form` y `zod` + `@hookform/resolvers`.
  - Reutilizar schemas Zod de `@bopacorp/shared` (fuente de veridad).
  - No redefinir reglas de validación.
- [ ] Agregar patrones de búsqueda, filtro y paginación:
  - Input de búsqueda con debounce.
  - Filtros por estado/fecha (si aplica).
  - Paginación server-side o client-side según endpoint.

### Verificación

- CMS Demo consume endpoint real y renderiza bloques.
- CRM y Employability pueden listar, crear, editar y eliminar registros.
- Formularios validan con Zod antes de enviar.
- Mutaciones exitosas invalidan listados y muestran toast.

---

## Fase 5 — Limpieza y Documentación

**Objetivo:** Dejar el repo limpio, documentado y listo para que otros desarrolladores no cometan los mismos errores.

### Tareas

- [ ] Actualizar `AGENTS.md`:
  - Comandos exactos (incluyendo `npm run dev` con proxy).
  - Convenciones de imports (`.js` extensions, `import type`).
  - Cómo agregar variables de entorno.
  - Cómo funciona el flujo de refresh tokens.
  - Convenciones de RBAC (`usePermission`, `<Can>`).
  - Referencias a `DESIGN.md` y `CLAUDE.md` para sistema de diseño.
- [ ] Actualizar `.env.example`:
  - Documentar `VITE_API_URL` y su comportamiento en dev vs prod.
- [ ] Eliminar código muerto:
  - Borrar `apiClient` anterior si ya no se usa.
  - Borrar imports no usados (fallan `noUnusedLocals`).
- [ ] Verificar build final:
  - `npm run build` pasa limpio.
  - `npm run lint` pasa limpio.
  - No hay errores de TypeScript.
- [ ] Agregar comentarios en puntos críticos:
  - Interceptor de refresh token.
  - Lógica de rotación de refresh tokens.
  - Por qué no se usa TanStack Query (decisión documentada).

### Verificación

- `npm run build` y `npm run lint` pasan sin errores.
- Un nuevo developer puede clonar, copiar `.env.example`, instalar dependencias y correr `npm run dev` sin problemas.
- `AGENTS.md` responde: "¿Qué probablemente se me escape sin esta guía?"

---

## Decisiones Arquitectónicas Tomadas

| Decisión | Justificación |
|----------|---------------|
| **Sin TanStack Query** | App pequeña, sin problemas de rendimiento. Se agregará solo si aparece repetición de requests o pantallas lentas. [Referencia](https://dev.to/iceonfire/you-might-not-need-tanstack-query-2f3l) |
| **Axios en vez de fetch** | Los interceptores permiten manejo limpio de refresh tokens con cola de requests. Con fetch puro se reimplementaría lo mismo con más bugs. |
| **Sin React Hook Form inicialmente** | Fase 1–3 no requieren formularios complejos. Se agrega en Fase 4 cuando conectamos CRUD reales. |
| **RBAC con permisos reales** | El seed `01_rbac_permissions.seed.sql` define permisos granulares para todos los modulos. No se usan placeholders. |
| **Vite proxy en dev** | Evita problemas de CORS. `VITE_API_URL=/api/v1` en dev, URL absoluta en prod. |
| **Imports con `.js` extension** | Convención existente del proyecto (`moduleResolution: bundler`). No cambiar para mantener consistencia. |

---

## Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| `@bopacorp/shared` sigue sin estar disponible | Pedir `.npmrc` al equipo o link local. Documentar en `AGENTS.md`. |
| Frontend usa datos locales en CRM/Employability | Conectar a endpoints reales en Fase 4. |
| Rotación de refresh token causa race conditions | Implementar cola de requests en interceptor (axios lo facilita). Probar con throttling de red. |
| `noUnusedLocals` falla al refactorizar | Correr `npm run build` después de cada cambio mayor para detectar rápido. |
| CORS se cierra en backend | Coordinar con backend el valor exacto de `CORS_ORIGIN`. Actualizar `.env` y proxy. |

---

## Referencias

- `CLAUDE.md` — sistema de diseño y reglas de UI.
- `DESIGN.md` — preset `b0`, tokens semánticos, convenciones de shadcn.
- `AGENTS.md` — instrucciones para agents (actualizar en Fase 5).
- Backend: `bopacorp-api` — endpoints, auth, permisos.
- ARROBO frontend — patrones de `fetchWithAuth`, `DataTable`, `<Can>`, `usePermission`.
