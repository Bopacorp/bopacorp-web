# Frontend Issues Fix Guide

Agent-ready guide. Each section is a self-contained fix with exact file paths, current code, and target code.

## Issue 1: Consolidate Auth Storage

**Problem**: Auth state stored in 4 separate localStorage keys managed by two independent modules (`src/services/api.ts` and `src/modules/auth/context/AuthContext.tsx`). Clear logic duplicated. Easy to desync.

**Current keys**:
- `bopacorp_auth` — `{user, accessToken}` (read by AuthContext)
- `accessToken` — JWT string (read by api.ts interceptor)
- `refreshToken` — opaque token (read by api.ts refresh logic)
- `tokenExpiresAt` — unix ms (read by api.ts proactive refresh)

**Fix**: Create a single auth storage module.

### Step 1: Create `src/services/auth-storage.ts`

```ts
const KEYS = {
  user: 'bopacorp_user',
  accessToken: 'bopacorp_access_token',
  refreshToken: 'bopacorp_refresh_token',
  expiresAt: 'bopacorp_token_expires_at',
} as const;

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(KEYS.accessToken);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(KEYS.refreshToken);
}

export function getTokenExpiresAt(): number | null {
  const raw = localStorage.getItem(KEYS.expiresAt);
  return raw ? Number(raw) : null;
}

export function getStoredUser<T>(): T | null {
  try {
    const raw = localStorage.getItem(KEYS.user);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveTokens(tokens: StoredTokens): void {
  localStorage.setItem(KEYS.accessToken, tokens.accessToken);
  localStorage.setItem(KEYS.refreshToken, tokens.refreshToken);
  localStorage.setItem(KEYS.expiresAt, String(Date.now() + tokens.expiresIn * 1000));
}

export function saveUser<T>(user: T): void {
  localStorage.setItem(KEYS.user, JSON.stringify(user));
}

export function clearAll(): void {
  for (const key of Object.values(KEYS)) {
    localStorage.removeItem(key);
  }
}
```

### Step 2: Refactor `src/services/api.ts`

Replace all direct `localStorage.getItem/setItem/removeItem` calls with imports from `auth-storage.ts`:
- `localStorage.getItem('accessToken')` → `getAccessToken()`
- `localStorage.getItem('refreshToken')` → `getRefreshToken()`
- `localStorage.getItem('tokenExpiresAt')` → `getTokenExpiresAt()`
- `saveTokensWithExpiry(...)` → call `saveTokens(...)` from auth-storage
- `clearAuth()` → call `clearAll()` from auth-storage
- Remove the old `bopacorp_auth` key entirely from api.ts (it only needs tokens, not user)

### Step 3: Refactor `src/modules/auth/context/AuthContext.tsx`

- Remove `STORAGE_KEY = 'bopacorp_auth'` and all related helpers (`getStoredUser`, `getStoredTokens`, `saveAuth`, `clearAuthStorage`)
- Import from `auth-storage.ts`: `getStoredUser`, `saveUser`, `saveTokens`, `clearAll`, `getRefreshToken`
- `login()`: call `saveTokens(response.tokens)` + `saveUser(response.user)`
- `logout()`: call `clearAll()` instead of `clearAuthStorage()`
- `getStoredUser()`: use generic version from auth-storage
- `callLogout()`: use `getRefreshToken()` from auth-storage

### Migration note

Old keys (`bopacorp_auth`, `accessToken`, `refreshToken`, `tokenExpiresAt`) differ from new keys (`bopacorp_user`, `bopacorp_access_token`, etc.). Users with active sessions will be logged out on deploy. This is acceptable — just ensure `clearAll()` also cleans legacy keys on first run, or accept the one-time logout.

---

## Issue 2: Wire `@bopacorp/shared` Types

**Problem**: `@bopacorp/shared` is installed (v0.2.1) but never imported. `AuthUser` type defined inline in `src/services/auth.service.ts` duplicates what shared already exports.

**Available shared exports** (from `@bopacorp/shared/auth`):
- `LoginResponse`, `ProfileResponse`, `AuthTokensResponse`
- `LoginRequest`, `LogoutRequest`, `RefreshTokenRequest`
- `UserResponse`, `RoleResponse`, `PermissionResponse`

**Fix**:

### `src/services/auth.service.ts`

Replace inline types with shared imports:

```ts
import type { LoginResponse, ProfileResponse } from '@bopacorp/shared/auth';
```

The `AuthUser` interface should be derived from the backend's `/auth/me` response shape. Check if `@bopacorp/shared/auth` exports a `MeResponse` or `UserResponse` type that matches:
```ts
{ id, username, email, roles: string[], permissions: string[], profile: ProfileResponse | null }
```

If no exact match exists in shared, keep a local `AuthUser` type BUT import `ProfileResponse` for the profile field instead of `unknown`:

```ts
import type { ProfileResponse } from '@bopacorp/shared/auth';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  profile: ProfileResponse | null;
}
```

### Other service files (future)

As admin sections connect to real endpoints, import request/response types from shared:
- `@bopacorp/shared/auth` — users, roles, permissions, modules
- `@bopacorp/shared/catalog` — content types, content blocks, items, segments, tiers, etc.
- `@bopacorp/shared/core` — employees, departments, org roles
- `@bopacorp/shared/employability` — vacancies, candidates, applications

---

## Issue 3: Fix `isLoading` in AuthContext

**Problem**: `isLoading` starts `true`, immediately set `false` in useEffect with no async work. Does not reflect actual auth verification. On page refresh, `RequireAuth` briefly shows loader then renders based on stale localStorage user — no server-side check.

**Current code** (`AuthContext.tsx:19-23`):
```ts
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  setIsLoading(false);
}, []);
```

**Fix**: Verify session on mount by calling `/auth/me`. If token exists but is invalid, clear auth and redirect.

```ts
const [isLoading, setIsLoading] = useState(() => !!getAccessToken());

useEffect(() => {
  const token = getAccessToken();
  if (!token) return;

  fetchMe()
    .then((userData) => {
      saveUser(userData);
      setUser(userData);
    })
    .catch(() => {
      clearAll();
      setUser(null);
    })
    .finally(() => setIsLoading(false));
}, []);
```

Key points:
- Only set `isLoading: true` if there's a token to verify (no flash on first visit)
- On success: update user state with fresh server data
- On failure (expired/invalid token): clear everything, user sees login
- `RequireAuth` already handles `isLoading` with `PageLoader` — no changes needed there

---

## Issue 4: Add DOMPurify for CMS HTML

**Problem**: `CmsDemoPage` uses `dangerouslySetInnerHTML` to render HTML from backend without sanitization. Even "trusted" backend content can contain XSS if the CMS editor is compromised or content is injected.

**Fix**:

### Step 1: Install DOMPurify

```bash
npm install dompurify
npm install -D @types/dompurify
```

### Step 2: Create sanitize utility

`src/lib/sanitize.ts`:
```ts
import DOMPurify from 'dompurify';

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty);
}
```

### Step 3: Use in CmsDemoPage

Wherever `dangerouslySetInnerHTML={{ __html: block.body }}` appears, change to:
```tsx
import { sanitizeHtml } from '@/lib/sanitize.js';

dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.body) }}
```

---

## Issue 5: Fix `.env.example` Consistency

**Problem**: `.env.example` says `VITE_API_URL=http://localhost:3000/api/v1` but some devs' `.env` may have `http://localhost:3000` without the path. The backend mounts all routes under `/api/v1/`, so the base URL MUST include it.

**Fix**: Ensure `.env.example` is correct (it already is). Add a validation check.

In `src/services/api.ts`, after the existing `baseURL` check:

```ts
const baseURL = import.meta.env.VITE_API_URL as string;

if (!baseURL) {
  throw new Error('VITE_API_URL is required');
}

if (!baseURL.includes('/api/')) {
  throw new Error('VITE_API_URL must include the API path (e.g. http://localhost:3000/api/v1)');
}
```

---

## Issue 6: Inline Hex Colors

**Problem**: `LandingPage.tsx` and `MainLayout.tsx` use raw hex colors (`bg-[#040914]`, `text-[#008be2]`, `from-[#06152b]`) instead of semantic design tokens.

**Fix**: Replace with closest semantic tokens from the `b0` preset. Map:

| Raw color | Semantic replacement | Usage |
|-----------|---------------------|-------|
| `bg-[#040914]` | `bg-background` or `bg-card` | Dark backgrounds |
| `text-[#008be2]` | `text-primary` | Brand blue text |
| `from-[#06152b]` | `from-background` | Gradient start |
| `to-[#0a1628]` | `to-card` | Gradient end |
| `bg-[#0d2847]` | `bg-muted` | Muted dark areas |
| `border-[#1a3a5c]` | `border-border` | Border color |
| `text-[#7eb8e0]` | `text-muted-foreground` | Secondary text |
| `hover:bg-[#1a3a5c]` | `hover:bg-accent` | Hover states |

If the current tokens don't match the brand colors, the correct fix is to update the `b0` preset token values in `src/index.css` `:root` / `.dark` sections — NOT to keep inline hex values.

Search all `.tsx` files for `[#` to find every instance.

---

## Issue 7: `AuthContext.isLoading` Timing with `RequireAuth`

**Problem**: Even after fixing Issue 3, there's a subtle timing issue. On hard refresh of `/admin/*`:
1. `RequireAuth` renders, reads `isLoading = true` → shows `PageLoader`
2. `AuthContext` fetches `/auth/me`
3. If 401 → clears auth → `user = null` → `RequireAuth` redirects to `/login`

This is correct behavior. But if the access token is expired and the proactive refresh in `api.ts` fires simultaneously, there's a potential double-refresh race.

**Fix**: The `fetchMe()` call in AuthContext mount should use the axios instance directly (which has interceptors), so token refresh happens automatically. No special handling needed — just ensure `fetchMe()` goes through the `request()` wrapper (it already does via `auth.service.ts`).

---

## Verification Checklist

After all fixes:
1. `npm run build` — zero errors
2. `npm run check` — zero lint/type errors
3. Manual test: fresh browser → `/admin` → redirects to `/login`
4. Manual test: login → see admin → refresh page → stays logged in (session verified via `/auth/me`)
5. Manual test: invalidate token in devtools → refresh → redirects to `/login`
6. Manual test: CMS demo page renders HTML without raw `<script>` tags
7. Grep for `localStorage.getItem` / `localStorage.setItem` — should only appear in `auth-storage.ts`
8. Grep for `[#` in `.tsx` files — should return zero matches
