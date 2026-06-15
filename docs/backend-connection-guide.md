# Backend Connection Guide

How the frontend connects to the BOPACORP API. Reference for building new admin sections.

## Base Setup

**Backend**: Express 5 API at `VITE_API_URL` (e.g. `http://localhost:3000/api/v1`)
**HTTP client**: Axios instance in `src/services/api.ts`
**Response envelope**: All endpoints return `{ success: boolean, data: T }` or `{ success: boolean, error: { code: string, message: string } }`

## Authentication Flow

### Login

```
POST /api/v1/auth/login
Body: { email, password }
Returns: { user: AuthUser, tokens: { accessToken, refreshToken, expiresIn } }
```

- `accessToken` = JWT containing `{ sub: userId, email, roles: string[], permissions: string[] }`
- `refreshToken` = opaque token, stored server-side as SHA-256 hash
- `expiresIn` = seconds until access token expires

### Token Refresh

```
POST /api/v1/auth/refresh
Body: { refreshToken }
Returns: { accessToken, refreshToken, expiresIn }
```

Backend implements **refresh token rotation**: each refresh invalidates the old token and returns a new pair. The frontend handles this in two places:

1. **Proactive** (request interceptor): if token expires in < 120s, refresh before sending
2. **Reactive** (response interceptor): on 401, queue pending requests, refresh, retry all

### Current User

```
GET /api/v1/auth/me
Headers: Authorization: Bearer <accessToken>
Returns: { id, username, email, roles: string[], profile: { firstName, lastName, ... } | null }
```

Note: `/auth/me` does NOT return permissions. Permissions live in the JWT payload and are decoded client-side. The `/auth/me` endpoint is for fetching fresh user profile data (name changes, avatar, etc.).

### Logout

```
POST /api/v1/auth/logout
Body: { refreshToken }
```

Fire-and-forget. Always clear local storage regardless of response.

### Password

```
PATCH /api/v1/auth/change-password  (authenticated)
Body: { currentPassword, newPassword }

POST /api/v1/auth/forgot-password   (public)
Body: { email }

POST /api/v1/auth/reset-password    (public)
Body: { token, newPassword }
```

## Permission System

### How It Works

1. **Login** embeds `permissions: string[]` in JWT (e.g. `["users.read", "users.create", "roles.update"]`)
2. **Frontend** stores permissions in AuthContext user object
3. **`usePermission()`** hook provides `hasPermission(code)` and `hasAnyPermission(codes[])`
4. **`<Can permission="code">`** component conditionally renders children
5. **`PermissionRoute`** in AdminApp gates entire sections

### Permission Codes

Permission codes follow the pattern `{resource}.{action}` or `{resource}.{sub_resource}.{action}`.

Backend enforces permissions via `authorize('code')` middleware. Frontend should mirror the same codes for UI gating. Full list:

#### Auth & RBAC (`/api/v1/auth`, `/api/v1/users`, `/api/v1/roles`)

| Endpoint | Method | Permission |
|----------|--------|------------|
| `/auth/login` | POST | public |
| `/auth/logout` | POST | public |
| `/auth/refresh` | POST | public |
| `/auth/forgot-password` | POST | public |
| `/auth/reset-password` | POST | public |
| `/auth/me` | GET | authenticate (no permission) |
| `/auth/change-password` | PATCH | authenticate (no permission) |
| `/users` | GET | `users.read` |
| `/users/:id` | GET | `users.read` |
| `/users` | POST | `users.create` |
| `/users/:id` | PATCH | `users.update` |
| `/users/:id` | DELETE | `users.delete` |
| `/users/:id/roles` | PUT | `users.roles.update` |
| `/roles` | GET | `roles.read` |
| `/roles/:id` | GET | `roles.read` |
| `/roles` | POST | `roles.create` |
| `/roles/:id` | PATCH | `roles.update` |
| `/roles/:id/disable` | PATCH | `roles.delete` |
| `/roles/:id/permissions` | PUT | `roles.permissions.update` |
| `/roles/modules` | GET | `modules.read` |
| `/roles/modules/tree` | GET | `modules.read` |
| `/roles/modules/:id` | GET | `modules.read` |
| `/roles/modules` | POST | `modules.create` |
| `/roles/modules/:id` | PATCH | `modules.update` |
| `/roles/modules/:id/disable` | PATCH | `modules.delete` |
| `/roles/permissions` | GET | `permissions.read` |
| `/roles/permissions/:id` | GET | `permissions.read` |
| `/roles/permissions` | POST | `permissions.create` |
| `/roles/permissions/:id` | PATCH | `permissions.update` |
| `/roles/permissions/:id/disable` | PATCH | `permissions.delete` |

#### Organization (`/api/v1/org`)

| Endpoint | Method | Permission |
|----------|--------|------------|
| `/org/departments` | GET | `departments.read` |
| `/org/departments/:id` | GET | `departments.read` |
| `/org/departments` | POST | `departments.create` |
| `/org/departments/:id` | PATCH | `departments.update` |
| `/org/departments/:id/disable` | PATCH | `departments.delete` |
| `/org/org-roles` | GET | `org_roles.read` |
| `/org/org-roles/:id` | GET | `org_roles.read` |
| `/org/org-roles` | POST | `org_roles.create` |
| `/org/org-roles/:id` | PATCH | `org_roles.update` |
| `/org/org-roles/:id/disable` | PATCH | `org_roles.delete` |
| `/org/employees` | GET | `employees.read` |
| `/org/employees/:userId` | GET | `employees.read` |
| `/org/employees` | POST | `employees.create` |
| `/org/employees/:userId` | PATCH | `employees.update` |
| `/org/employees/:userId` | DELETE | `employees.delete` |
| `/org/employees/:userId/supervisors` | GET | `employees.read` |
| `/org/employees/:userId/advisors` | GET | `employees.read` |
| `/org/employees/:userId/supervisors` | PUT | `employees.supervisors.update` |

#### Catalog (`/api/v1/catalog`)

Each sub-resource follows the same CRUD pattern. Resources: `content_types`, `content_blocks`, `item_types`, `contract_types`, `segments`, `tiers`, `geo_zones`, `benefit_types`, `categories`.

| Action | Permission pattern | Methods |
|--------|-------------------|---------|
| List / Get | `{resource}.read` | GET |
| Create | `{resource}.create` | POST |
| Update | `{resource}.update` | PATCH |
| Disable/Delete | `{resource}.delete` | PATCH `/:id/disable` or DELETE `/:id` |

Special: `GET /catalog/categories/tree` — returns hierarchical tree, uses `categories.read`.

#### Catalog Items (`/api/v1/catalog-items`)

| Endpoint | Method | Permission |
|----------|--------|------------|
| `/catalog-items` | GET | `catalog_items.read` |
| `/catalog-items/:id` | GET | `catalog_items.read` |
| `/catalog-items` | POST | `catalog_items.create` |
| `/catalog-items/:id` | PATCH | `catalog_items.update` |
| `/catalog-items/:id` | DELETE | `catalog_items.delete` |

#### CMS (`/api/v1/cms`)

| Endpoint | Method | Permission |
|----------|--------|------------|
| `/cms/landing` | GET | public (no auth) |

#### Contact Requests (`/api/v1/contact-requests`)

| Endpoint | Method | Permission |
|----------|--------|------------|
| `/contact-requests` | POST | `contact_requests.read` |
| `/contact-requests` | GET | `contact_requests.read` |
| `/contact-requests/:id` | GET | `contact_requests.read` |
| `/contact-requests/:id` | PATCH | `contact_requests.update` |

#### Employability (`/api/v1/employability`)

| Endpoint | Method | Permission |
|----------|--------|------------|
| `/employability/vacancies/published` | GET | **public** (no auth) |
| `/employability/vacancies/:id` | GET | **public** (no auth) |
| `/employability/apply` | POST | **public** (no auth, multipart, rate limited 20/15min) |
| `/employability/vacancies` | GET | `job_vacancies.read` |
| `/employability/vacancies` | POST | `job_vacancies.create` |
| `/employability/vacancies/:id` | PATCH | `job_vacancies.update` |
| `/employability/vacancies/:id` | DELETE | `job_vacancies.delete` |
| `/employability/candidates` | GET | `candidates.read` |
| `/employability/candidates/:id` | GET | `candidates.read` |
| `/employability/candidates` | POST | `candidates.create` |
| `/employability/candidates/:id` | PATCH | `candidates.update` |
| `/employability/candidates/:id` | DELETE | `candidates.delete` |
| `/employability/job-applications` | GET | `job_applications.read` |
| `/employability/job-applications/:id` | GET | `job_applications.read` |
| `/employability/job-applications` | POST | `job_applications.create` |
| `/employability/job-applications/:id` | PATCH | `job_applications.update` |
| `/employability/job-applications/:id` | DELETE | `job_applications.delete` |
| `/employability/candidate-resumes` | GET | `candidate_resumes.read` |
| `/employability/candidate-resumes/:id` | GET | `candidate_resumes.read` |
| `/employability/candidate-resumes` | POST | `candidate_resumes.create` |
| `/employability/candidate-resumes/:id` | DELETE | `candidate_resumes.delete` |

### Public apply flow

`POST /api/v1/employability/apply` accepts `multipart/form-data` (no `Authorization` header required). The frontend posts a single request with the PDF resume and the candidate payload as a JSON string.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `file` | file (PDF) | yes | Max 20 MB |
| `vacancyId` | UUID | yes | Must reference a published, open vacancy |
| `coverLetter` | string | no | Free text |
| `candidate` | string | yes | JSON string with `nationalId`, `firstName`, `lastName`, `email`, optional `phone`, `address` |

Backend errors (frontend should map `error.code` to UX):

| HTTP | `code` | Meaning |
|------|--------|---------|
| 422 | `VALIDATION_ERROR` | Zod validation failed; `details: [{ field, message }]` |
| 404 | `NOT_FOUND` | Vacancy missing, unpublished, or closed |
| 413 | `MULTER_ERROR` | PDF exceeds 20 MB |
| 415 | `MULTER_ERROR` | File is not a PDF |
| 429 | `RATE_LIMITED` | 20 requests / 15 min per IP exceeded |

## Shared Types — `@bopacorp/shared`

Both frontend and backend depend on `@bopacorp/shared`. The package exports Zod schemas + inferred TypeScript types per domain:

| Import path | Contains |
|-------------|----------|
| `@bopacorp/shared/auth` | `LoginRequest`, `LoginResponse`, `ProfileResponse`, `UserResponse`, `RoleResponse`, `PermissionResponse`, `ModuleResponse`, `ModuleTreeResponse`, request schemas for all auth/RBAC endpoints |
| `@bopacorp/shared/catalog` | Request/response schemas for all catalog sub-resources (content types, content blocks, items, segments, tiers, geo zones, benefit types, categories) |
| `@bopacorp/shared/core` | `Employee`, `Department`, `OrgRole`, `AdvisorSupervisor` request/response schemas |
| `@bopacorp/shared/employability` | `Vacancy`, `Candidate`, `JobApplication`, `CandidateResume` schemas |
| `@bopacorp/shared/common` | Shared utilities (pagination, enums) |

### Usage pattern

Backend uses Zod schemas for request validation. Frontend should use the TypeScript types for API responses:

```ts
import type { LoginResponse, UserResponse } from '@bopacorp/shared/auth';
import type { ListCatalogItemsQuery } from '@bopacorp/shared/catalog';
```

For form validation, frontend can also use the Zod schemas directly with a form library (e.g., react-hook-form + @hookform/resolvers/zod).

## Building a New Admin Section

Pattern for connecting a new admin section to the backend. Example: CRM (contact requests).

### 1. Create API service

`src/services/contact-requests.service.ts`:

```ts
import type { ContactRequestResponse, ListContactRequestsQuery } from '@bopacorp/shared/...';
import { request } from './api.js';

interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export function listContactRequests(query: ListContactRequestsQuery) {
  return request<PaginatedResponse<ContactRequestResponse>>({
    method: 'GET',
    url: '/contact-requests',
    params: query,
  });
}

export function getContactRequest(id: string) {
  return request<ContactRequestResponse>({
    method: 'GET',
    url: `/contact-requests/${id}`,
  });
}

export function updateContactRequest(id: string, data: UpdateContactRequestRequest) {
  return request<ContactRequestResponse>({
    method: 'PATCH',
    url: `/contact-requests/${id}`,
    data,
  });
}
```

### 2. Create data hook

`src/modules/admin/hooks/use-contact-requests.ts`:

Use the same pattern as `use-cms-landing.ts` — `useState` + `useEffect` + `useCallback` with cancel state. Or, if TanStack Query is adopted, use `useQuery`/`useMutation`.

### 3. Create section component

Replace mock data in `src/components/sections/CRM.tsx` with real hook. Keep `<Can>` and permission checks for action buttons:

```tsx
<Can permission="contact_requests.update">
  <Button onClick={handleEdit}>Editar</Button>
</Can>
```

### 4. Wire route permission

In `AdminApp.tsx`, the route already has:
```tsx
<PermissionRoute permission="contact_requests.read">
  <CRM />
</PermissionRoute>
```

## API Response Patterns

### Paginated list

All list endpoints accept `?page=1&limit=20` and optional filters. Response:

```json
{
  "success": true,
  "data": {
    "data": [...items],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

The `request<T>()` wrapper unwraps `response.data.data`, so the hook receives `{ data: T[], meta: {...} }`.

### Single item

```json
{
  "success": true,
  "data": { "id": "...", ...fields }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [...]
  }
}
```

Common error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `ROUTE_NOT_FOUND`.

The `ApiError` class in `api.ts` captures `code` and `message`. Use `error.code` to show contextual UI (e.g., "No tienes permisos" for `FORBIDDEN`).

### Soft delete (disable)

Most resources use soft delete via `PATCH /:id/disable` (sets `isActive = false`, `deletedAt = now`). Exceptions: `content_blocks`, `catalog_items`, `candidates`, `job_applications`, `candidate_resumes` use hard `DELETE`.

## Environment

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | `http://localhost:3000/api/v1` | Yes |

The URL MUST include `/api/v1`. Backend mounts all routes under this prefix. The axios instance uses it as `baseURL`, so service calls use relative paths (e.g., `/auth/login`, `/users`).

## CORS

Backend uses `cors()` middleware with default config (allows all origins in dev). In production, configure `CORS_ORIGIN` env var on the backend to restrict to the frontend domain.
