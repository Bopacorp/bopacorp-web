# Data Fetching Migration Guide

Migrate from manual `useState`/`useEffect` fetching to TanStack Query. Agent-ready.

## Problem

Current approach (`use-cms-landing.ts`) requires 72 lines per endpoint:
- Manual `useState` for `data`, `loading`, `error`, `retryCount`
- Manual cancel state object to prevent stale updates
- Manual retry callback
- No caching — every navigation refetches
- No request deduplication
- Every new section copy-pastes the same boilerplate

## Step 1: Install TanStack Query

```bash
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
```

## Step 2: Create Query Client

Create `src/lib/query-client.ts`:

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

Options explained:
- `staleTime: 30s` — data considered fresh for 30s, no refetch on remount
- `gcTime: 5min` — unused cache kept 5 minutes before garbage collection
- `retry: 1` — one retry on failure (not 3, since auth interceptor already retries 401s)
- `refetchOnWindowFocus: false` — admin app doesn't need aggressive refetch on tab switch

## Step 3: Add `QueryClientProvider` to `src/main.tsx`

Current `main.tsx` wraps app with `AuthProvider` + `TooltipProvider`. Add `QueryClientProvider` as outermost provider (must be outside `AuthProvider` so auth hooks can use queries too if needed later).

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client.js';

// Wrap existing tree:
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </AuthProvider>
</QueryClientProvider>
```

Optionally add devtools in development (renders a floating panel for inspecting cache):

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Inside QueryClientProvider, after App:
{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
```

## Step 4: Create query key factory

Create `src/lib/query-keys.ts`:

```ts
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  cms: {
    landing: ['cms', 'landing'] as const,
  },
  contactRequests: {
    all: ['contact-requests'] as const,
    list: (params: Record<string, unknown>) => ['contact-requests', 'list', params] as const,
    detail: (id: string) => ['contact-requests', 'detail', id] as const,
  },
  employability: {
    vacancies: {
      all: ['employability', 'vacancies'] as const,
      list: (params: Record<string, unknown>) => ['employability', 'vacancies', 'list', params] as const,
      detail: (id: string) => ['employability', 'vacancies', 'detail', id] as const,
    },
    candidates: {
      all: ['employability', 'candidates'] as const,
      list: (params: Record<string, unknown>) => ['employability', 'candidates', 'list', params] as const,
      detail: (id: string) => ['employability', 'candidates', 'detail', id] as const,
    },
    applications: {
      all: ['employability', 'applications'] as const,
      list: (params: Record<string, unknown>) => ['employability', 'applications', 'list', params] as const,
      detail: (id: string) => ['employability', 'applications', 'detail', id] as const,
    },
  },
  catalog: {
    contentTypes: {
      all: ['catalog', 'content-types'] as const,
      list: (params: Record<string, unknown>) => ['catalog', 'content-types', 'list', params] as const,
      detail: (id: string) => ['catalog', 'content-types', 'detail', id] as const,
    },
    contentBlocks: {
      all: ['catalog', 'content-blocks'] as const,
      list: (params: Record<string, unknown>) => ['catalog', 'content-blocks', 'list', params] as const,
      detail: (id: string) => ['catalog', 'content-blocks', 'detail', id] as const,
    },
    // Same pattern for: itemTypes, contractTypes, segments, tiers, geoZones, benefitTypes, categories
  },
  catalogItems: {
    all: ['catalog-items'] as const,
    list: (params: Record<string, unknown>) => ['catalog-items', 'list', params] as const,
    detail: (id: string) => ['catalog-items', 'detail', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params: Record<string, unknown>) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
  roles: {
    all: ['roles'] as const,
    list: (params: Record<string, unknown>) => ['roles', 'list', params] as const,
    detail: (id: string) => ['roles', 'detail', id] as const,
  },
  org: {
    employees: {
      all: ['org', 'employees'] as const,
      list: (params: Record<string, unknown>) => ['org', 'employees', 'list', params] as const,
      detail: (userId: string) => ['org', 'employees', 'detail', userId] as const,
    },
    departments: {
      all: ['org', 'departments'] as const,
      list: (params: Record<string, unknown>) => ['org', 'departments', 'list', params] as const,
      detail: (id: string) => ['org', 'departments', 'detail', id] as const,
    },
    orgRoles: {
      all: ['org', 'org-roles'] as const,
      list: (params: Record<string, unknown>) => ['org', 'org-roles', 'list', params] as const,
      detail: (id: string) => ['org', 'org-roles', 'detail', id] as const,
    },
  },
} as const;
```

Benefits of key factory:
- Autocomplete in IDE
- Consistent key structure across app
- Easy cache invalidation: `queryClient.invalidateQueries({ queryKey: queryKeys.contactRequests.all })` invalidates both list and detail queries

## Step 5: Create shared pagination type

Create `src/lib/api-types.ts`:

```ts
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

## Step 6: Migrate `use-cms-landing.ts`

**Before** (72 lines):

```ts
// useState x4, useEffect, useCallback, cancel state, manual retry...
```

**After** (`src/modules/landing/hooks/use-cms-landing.ts`):

```ts
import { useQuery } from '@tanstack/react-query';
import { request } from '@/services/api.js';
import { queryKeys } from '@/lib/query-keys.js';

interface ContentBlockResponse {
  id: string;
  contentKey: string;
  body: string;
}

interface CmsLandingResponse {
  blocks: Record<string, ContentBlockResponse>;
}

export function useCmsLanding() {
  return useQuery({
    queryKey: queryKeys.cms.landing,
    queryFn: () => request<CmsLandingResponse>({ method: 'GET', url: '/cms/landing' }),
  });
}
```

Update `CmsDemoPage.tsx` to use new return shape:

```tsx
// Before:
const { blocks, loading, error, retry } = useCmsLanding();

// After:
const { data, isLoading, error, refetch } = useCmsLanding();
const blocks = data?.blocks ?? null;
```

Mapping:
| Old | New |
|-----|-----|
| `loading` | `isLoading` |
| `error` (string) | `error` (Error object, use `error.message`) |
| `retry()` | `refetch()` |
| `blocks` | `data?.blocks` |

## Step 7: Build pattern for new admin sections

Example: CRM (contact requests).

### Service — `src/services/contact-requests.service.ts`

```ts
import { request } from './api.js';
import type { PaginatedResponse } from '@/lib/api-types.js';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function listContactRequests(params: ListParams) {
  return request<PaginatedResponse<ContactRequest>>({
    method: 'GET',
    url: '/contact-requests',
    params,
  });
}

export function getContactRequest(id: string) {
  return request<ContactRequest>({
    method: 'GET',
    url: `/contact-requests/${id}`,
  });
}

export function updateContactRequest(id: string, data: { status: string }) {
  return request<ContactRequest>({
    method: 'PATCH',
    url: `/contact-requests/${id}`,
    data,
  });
}
```

### Query hook — `src/modules/admin/sections/crm/hooks/use-contact-requests.ts`

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys.js';
import * as api from '@/services/contact-requests.service.js';

export function useContactRequests(params: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: queryKeys.contactRequests.list(params),
    queryFn: () => api.listContactRequests(params),
  });
}

export function useContactRequest(id: string) {
  return useQuery({
    queryKey: queryKeys.contactRequests.detail(id),
    queryFn: () => api.getContactRequest(id),
    enabled: !!id,
  });
}

export function useUpdateContactRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string } }) =>
      api.updateContactRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactRequests.all });
    },
  });
}
```

### Usage in component

```tsx
export default function CrmPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useContactRequests({ page, limit: 20 });

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.data.length) return <EmptyState title="Sin solicitudes" />;

  return (
    <DataTable
      data={data.data}
      columns={columns}
      pagination={data.meta}
      onPageChange={setPage}
    />
  );
}
```

## Step 8: Mutation pattern for create/update/delete

Standard pattern for any write operation:

```ts
export function useCreateSomething() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSomethingRequest) =>
      request<SomethingResponse>({ method: 'POST', url: '/something', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.something.all });
    },
  });
}
```

In components:

```tsx
const createMutation = useCreateSomething();

async function handleSubmit(data: CreateSomethingRequest) {
  await createMutation.mutateAsync(data);
  // cache auto-invalidated, list refetches
}

// Loading state:
<Button disabled={createMutation.isPending}>
  {createMutation.isPending ? 'Guardando...' : 'Guardar'}
</Button>

// Error state:
{createMutation.error && <p className="text-destructive">{createMutation.error.message}</p>}
```

## Step 9: Integrate with auth (optional enhancement)

If `isLoading` fix from `issues-fix-guide.md` (Issue 3) is implemented, the `/auth/me` call on mount can also use TanStack Query:

```ts
// In AuthProvider or a useAuthInit hook:
const { data: user, isLoading } = useQuery({
  queryKey: queryKeys.auth.me,
  queryFn: () => fetchMe(),
  enabled: !!getAccessToken(),
  retry: false,
});
```

This gives free caching of user data across token refreshes. On logout:

```ts
queryClient.clear(); // Wipe entire cache on logout
```

This is optional — the manual approach from `issues-fix-guide.md` works fine. Adopt this if the team wants consistency across all data fetching.

## Files Changed Summary

| Action | File |
|--------|------|
| INSTALL | `@tanstack/react-query`, `@tanstack/react-query-devtools` (dev) |
| CREATE | `src/lib/query-client.ts` |
| CREATE | `src/lib/query-keys.ts` |
| CREATE | `src/lib/api-types.ts` |
| UPDATE | `src/main.tsx` (add `QueryClientProvider`) |
| REWRITE | `src/modules/landing/hooks/use-cms-landing.ts` (72 → ~15 lines) |
| UPDATE | `src/modules/landing/pages/CmsDemoPage.tsx` (adapt to new hook return shape) |
| DELETE | Cancel state types/helpers no longer needed |

## Verification

1. `npm run build` — zero errors
2. `npm run check` — zero lint/type errors
3. Manual test: CMS demo page loads content blocks (cached on revisit)
4. Manual test: navigate away from CMS demo, come back — instant render from cache
5. Open React Query Devtools (bottom-left floating button in dev) — verify queries appear with correct keys and states
6. Manual test: trigger error (stop backend) — error state renders, click retry — recovers
