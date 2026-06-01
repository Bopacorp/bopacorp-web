# Frontend Restructure Guide

Agent-ready guide for reorganizing the admin module and fixing misplaced files.

## Problem

`AdminApp.tsx` is a 210-line monolith containing layout, routing, 5 inline placeholder sections, permission gating component, and menu config. Section components (`CRM.tsx`, `Empleabilidad.tsx`) live in `src/components/sections/` — a grab-bag folder outside their module. No internal structure to scale as sections get real API connections.

## Target Structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── Can.tsx                    # (unchanged)
│   │   │   └── RequireAuth.tsx            # (unchanged)
│   │   ├── context/
│   │   │   └── AuthContext.tsx            # (unchanged)
│   │   ├── hooks/
│   │   │   └── usePermission.ts           # MOVED from src/hooks/
│   │   └── pages/
│   │       └── LoginPage.tsx              # (unchanged)
│   ├── admin/
│   │   ├── AdminApp.tsx                   # Layout shell + routes only (~50 lines)
│   │   ├── components/
│   │   │   └── PermissionRoute.tsx        # EXTRACTED from AdminApp.tsx
│   │   ├── config/
│   │   │   └── menu.ts                    # EXTRACTED from AdminApp.tsx
│   │   └── sections/
│   │       ├── dashboard/
│   │       │   └── DashboardPage.tsx      # EXTRACTED from AdminApp.tsx
│   │       ├── crm/
│   │       │   ├── CrmPage.tsx            # MOVED from src/components/sections/CRM.tsx
│   │       │   ├── hooks/                 # (future: API hooks)
│   │       │   └── components/            # (future: sub-components)
│   │       ├── empleabilidad/
│   │       │   ├── EmpleabilidadPage.tsx   # MOVED from src/components/sections/Empleabilidad.tsx
│   │       │   ├── hooks/                 # (future: API hooks)
│   │       │   └── components/            # (future: sub-components)
│   │       ├── cms/
│   │       │   └── CmsPage.tsx            # EXTRACTED from AdminApp.tsx
│   │       ├── matrices/
│   │       │   └── MatricesPage.tsx        # EXTRACTED from AdminApp.tsx
│   │       └── alertas/
│   │           └── AlertasPage.tsx         # EXTRACTED from AdminApp.tsx
│   └── landing/                           # (unchanged)
├── components/
│   ├── ui/                                # (unchanged — shadcn primitives)
│   └── SidebarNav.tsx                     # (unchanged)
├── shared/ui/                             # (unchanged)
├── hooks/
│   └── use-mobile.ts                      # (unchanged — truly global hook)
├── services/                              # (unchanged)
└── lib/                                   # (unchanged)
```

## Step 1: Extract `PermissionRoute` from `AdminApp.tsx`

Create `src/modules/admin/components/PermissionRoute.tsx`:

```tsx
import type { ReactNode } from 'react';
import { usePermission } from '@/modules/auth/hooks/usePermission.js';

interface PermissionRouteProps {
  permission: string | null;
  children: ReactNode;
}

export function PermissionRoute({ permission, children }: PermissionRouteProps) {
  const { hasPermission } = usePermission();

  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[50vh]">
        <h2 className="text-xl font-semibold">Acceso denegado</h2>
        <p className="text-muted-foreground">No tienes permisos para acceder a esta seccion.</p>
      </div>
    );
  }

  return <>{children}</>;
}
```

## Step 2: Extract menu config from `AdminApp.tsx`

Create `src/modules/admin/config/menu.ts`:

```ts
import { BarChart3, Bell, FileText, Handshake, Layout, Users } from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  icon: typeof BarChart3;
  permission: string | null;
}

export const allMenuItems: MenuItem[] = [
  { id: 'dashboard', title: 'Dashboard', icon: BarChart3, permission: null },
  { id: 'crm', title: 'CRM', icon: Users, permission: 'contact_requests.read' },
  { id: 'matrices', title: 'Matrices', icon: FileText, permission: null },
  { id: 'alertas', title: 'Alertas', icon: Bell, permission: null },
  { id: 'empleabilidad', title: 'Empleabilidad', icon: Handshake, permission: 'job_vacancies.read' },
  { id: 'cms', title: 'CMS', icon: Layout, permission: 'content_blocks.read' },
];

export const sectionMeta: Record<string, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Vista general de la operacion' },
  crm: { title: 'BOPADIGITAL CRM', description: 'Panel interno de negociaciones' },
  matrices: { title: 'Matrices', description: 'Documentos y estructuras operativas' },
  alertas: { title: 'Alertas', description: 'Seguimiento de eventos importantes' },
  empleabilidad: { title: 'Empleabilidad', description: 'Seguimiento de talento y vacantes' },
  cms: { title: 'CMS', description: 'Gestion de contenido para la plataforma' },
};
```

Note: Remove `cms-demo` from menu items. It was a development demo — fold into the real CMS section or remove entirely.

## Step 3: Extract placeholder sections

Each placeholder section currently inline in `AdminApp.tsx` becomes its own file.

### `src/modules/admin/sections/dashboard/DashboardPage.tsx`

```tsx
export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 p-4">
      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Aqui puedes resumir metricas clave y accesos rapidos.
        </p>
      </div>
    </div>
  );
}
```

### `src/modules/admin/sections/matrices/MatricesPage.tsx`

```tsx
export default function MatricesPage() {
  return (
    <div className="grid gap-4 p-4">
      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="text-xl font-semibold">Matrices</h2>
        <p className="text-sm text-muted-foreground">
          Seccion lista para cargar matrices y plantillas.
        </p>
      </div>
    </div>
  );
}
```

### `src/modules/admin/sections/alertas/AlertasPage.tsx`

```tsx
export default function AlertasPage() {
  return (
    <div className="grid gap-4 p-4">
      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="text-xl font-semibold">Alertas</h2>
        <p className="text-sm text-muted-foreground">
          Seccion lista para mostrar notificaciones y avisos.
        </p>
      </div>
    </div>
  );
}
```

### `src/modules/admin/sections/cms/CmsPage.tsx`

```tsx
export default function CmsPage() {
  return (
    <div className="grid gap-4 p-4">
      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="text-xl font-semibold">CMS</h2>
        <p className="text-sm text-muted-foreground">
          Seccion lista para integrar herramientas de gestion de contenido.
        </p>
      </div>
    </div>
  );
}
```

## Step 4: Move section components

### `src/components/sections/CRM.tsx` → `src/modules/admin/sections/crm/CrmPage.tsx`

- Rename the default export from `CRM` to `CrmPage`
- Update any internal imports to use new paths
- Keep all existing logic intact

### `src/components/sections/Empleabilidad.tsx` → `src/modules/admin/sections/empleabilidad/EmpleabilidadPage.tsx`

- Rename default export from `Empleabilidad` to `EmpleabilidadPage`
- Update any internal imports to use new paths
- Keep all existing logic intact

### Delete `src/components/sections/` folder

After moving both files, delete the entire `src/components/sections/` directory.

## Step 5: Move `usePermission` to auth module

### Move `src/hooks/usePermission.ts` → `src/modules/auth/hooks/usePermission.ts`

Content stays the same. Update all imports across the codebase:

| File | Old import | New import |
|------|-----------|------------|
| `src/modules/admin/AdminApp.tsx` | `@/hooks/usePermission.js` | `@/modules/auth/hooks/usePermission.js` |
| `src/modules/auth/components/Can.tsx` | `@/hooks/usePermission.js` | `@/modules/auth/hooks/usePermission.js` |
| `src/modules/admin/components/PermissionRoute.tsx` | (new file) | `@/modules/auth/hooks/usePermission.js` |

After moving, `src/hooks/` should contain only `use-mobile.ts` (a truly global hook not tied to any module).

## Step 6: Handle CMS Demo

`CmsDemoPage` currently lives at `src/modules/landing/pages/CmsDemoPage.tsx` and is routed under `/admin/cms-demo`. Two options:

**Option A (recommended)**: Remove the `cms-demo` route from admin. It was a development demo. The CMS demo page is a landing feature — keep it in landing module, route it under `/cms-demo` as a public page if needed.

**Option B**: Move it to `src/modules/admin/sections/cms/CmsDemoPage.tsx` alongside `CmsPage.tsx` if it should remain an admin tool. Move its hook (`src/modules/landing/hooks/use-cms-landing.ts`) to `src/modules/admin/sections/cms/hooks/`.

## Step 7: Rewrite `AdminApp.tsx`

After all extractions, `AdminApp.tsx` becomes a thin shell:

```tsx
import { LogOut, Plus } from 'lucide-react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import SidebarNav from '@/components/SidebarNav';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { usePermission } from '@/modules/auth/hooks/usePermission.js';
import { useAuth } from '@/modules/auth/context/AuthContext.js';
import { PermissionRoute } from './components/PermissionRoute.js';
import { allMenuItems, sectionMeta } from './config/menu.js';
import AlertasPage from './sections/alertas/AlertasPage.js';
import CmsPage from './sections/cms/CmsPage.js';
import CrmPage from './sections/crm/CrmPage.js';
import DashboardPage from './sections/dashboard/DashboardPage.js';
import EmpleabilidadPage from './sections/empleabilidad/EmpleabilidadPage.js';
import MatricesPage from './sections/matrices/MatricesPage.js';

export default function AdminApp() {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermission();
  const location = useLocation();

  const menuItems = allMenuItems.filter(
    (item) => !item.permission || hasPermission(item.permission),
  );
  const sectionId = location.pathname.replace('/admin/', '') || 'dashboard';
  const meta = sectionMeta[sectionId] || sectionMeta.dashboard;

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <SidebarNav menu={menuItems} />
        <SidebarInset className="flex-1">
          <header className="flex h-14 items-center gap-3 border-b px-4">
            <SidebarTrigger aria-label="Toggle sidebar" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{meta.title}</h1>
              <p className="text-sm text-muted-foreground">{meta.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Cerrar sesion">
                <LogOut data-icon="inline-start" />
              </Button>
              <Button>
                <Plus data-icon="inline-start" />
                Nuevo cliente
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="crm" replace />} />
              <Route path="dashboard" element={<PermissionRoute permission={null}><DashboardPage /></PermissionRoute>} />
              <Route path="crm" element={<PermissionRoute permission="contact_requests.read"><CrmPage /></PermissionRoute>} />
              <Route path="matrices" element={<PermissionRoute permission={null}><MatricesPage /></PermissionRoute>} />
              <Route path="alertas" element={<PermissionRoute permission={null}><AlertasPage /></PermissionRoute>} />
              <Route path="empleabilidad" element={<PermissionRoute permission="job_vacancies.read"><EmpleabilidadPage /></PermissionRoute>} />
              <Route path="cms" element={<PermissionRoute permission="content_blocks.read"><CmsPage /></PermissionRoute>} />
              <Route path="*" element={<div className="p-8">Seccion no encontrada</div>} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
```

## Step 8: Update `SidebarNav` if needed

Check `src/components/SidebarNav.tsx` — it receives `menu` prop. The `MenuItem` type is now exported from `src/modules/admin/config/menu.ts`. If `SidebarNav` defines its own inline type for menu items, update it to import from `menu.ts` instead.

`SidebarNav` stays in `src/components/` — it's a reusable layout component, not admin-specific.

## Files Changed Summary

| Action | File |
|--------|------|
| CREATE | `src/modules/admin/components/PermissionRoute.tsx` |
| CREATE | `src/modules/admin/config/menu.ts` |
| CREATE | `src/modules/admin/sections/dashboard/DashboardPage.tsx` |
| CREATE | `src/modules/admin/sections/crm/CrmPage.tsx` |
| CREATE | `src/modules/admin/sections/empleabilidad/EmpleabilidadPage.tsx` |
| CREATE | `src/modules/admin/sections/cms/CmsPage.tsx` |
| CREATE | `src/modules/admin/sections/matrices/MatricesPage.tsx` |
| CREATE | `src/modules/admin/sections/alertas/AlertasPage.tsx` |
| MOVE   | `src/hooks/usePermission.ts` → `src/modules/auth/hooks/usePermission.ts` |
| REWRITE | `src/modules/admin/AdminApp.tsx` (210 → ~55 lines) |
| UPDATE | `src/modules/auth/components/Can.tsx` (import path) |
| DELETE | `src/components/sections/CRM.tsx` |
| DELETE | `src/components/sections/Empleabilidad.tsx` |
| DELETE | `src/components/sections/` directory |

## Verification

1. `npm run build` — zero errors
2. `npm run check` — zero lint/type errors
3. `grep -r "components/sections" src/` — zero matches
4. `grep -r "@/hooks/usePermission" src/` — zero matches (all updated to `@/modules/auth/hooks/`)
5. Manual test: all admin routes render correctly
6. Manual test: permission-gated sections still show "Acceso denegado" for unauthorized users
