# AGENTS.md

BOPACORP internal CRM web app (BOPADIGITAL). UI is in Spanish.

## Stack

- React 19 + TypeScript ~6.0 + Vite 8 + Tailwind CSS v4
- React Router v7 (declarative `<Routes>` in `src/App.tsx`)
- shadcn/ui (`radix-nova` style, preset `b0`)
- `next-themes` for dark mode (`.dark` class on `<html>`)

## Commands

- `npm run dev` — Vite HMR dev server (proxies `/api` → `http://localhost:3000`)
- `npm run build` — `tsc -b && vite build` (type-check is part of build)
- `npm run lint` — ESLint only
- `npx shadcn@latest add <component>` — add shadcn primitive
- `npx shadcn@latest search <query>` — find components before building custom UI
- `npx shadcn@latest apply b0` — re-apply design preset (rewrites `src/index.css`)

No test runner is configured. There is no `test` script.

## Setup gotchas

- `@bopacorp/shared` (v0.1.4) is a **private scoped package** not on the public npm registry. `npm install` will 404 unless you have access to the private registry or the package is linked locally. If you hit this, ask the team for the `.npmrc` or local tarball.
- Node package manager: **npm** (`package-lock.json` present). `pnpm-lock.yaml` was removed.

## Architecture

Entry: `src/main.tsx` → `<AuthProvider>` → `<App />` inside `<StrictMode>` + `<TooltipProvider>`.

Path alias: `@/` → `./src/` (configured in `vite.config.ts`, `tsconfig.json`, and `tsconfig.app.json`).

Directory ownership:
- `src/app/` — top-level layouts (`MainLayout.tsx` wraps public pages)
- `src/modules/` — feature modules: `landing/`, `admin/`, `auth/`
- `src/components/ui/` — shadcn/ui primitives (do not edit lightly; use `cva` variants)
- `src/shared/ui/` — cross-cutting UI helpers (`page-loader.tsx`, `error-state.tsx`)
- `src/lib/` — `utils.ts` (`cn()`), `api.ts` (API client)
- `src/hooks/` — custom hooks

Auth flow:
- `AuthContext` stores JWT in `localStorage` (key: `bopacorp_auth`, plus `accessToken` / `refreshToken`)
- `apiClient` (`src/lib/api.ts`) reads `accessToken` from `localStorage` and sends `Authorization: Bearer …`
- `RequireAuth` guard renders inline `LoginPage` when unauthenticated (not a redirect)
- Backend base URL: `VITE_API_URL` env var, defaults to `http://localhost:3000/api/v1`

## TypeScript conventions

- Imports use **`.js` extensions** even for `.tsx` files (e.g., `from '@/lib/api.js'`). This is consistent across the codebase because `moduleResolution: bundler` resolves them. Match existing style; do not switch to `.tsx`.
- `noUnusedLocals: true` and `noUnusedParameters: true` are enabled. Unused variables/params will fail `tsc -b`.
- `verbatimModuleSyntax: true` — use `import type { … }` for type-only imports.

## Design system

Read `CLAUDE.md` and `DESIGN.md` for the full rules. Key constraints an agent often breaks:

- **Semantic tokens only** — `bg-primary`, `text-muted-foreground`. Never raw Tailwind colors (`bg-blue-500`).
- **No `dark:` overrides** — tokens flip automatically via `.dark` class.
- **Spacing: `gap-*`** not `space-y-*` / `space-x-*`.
- **Equal dimensions: `size-*`** not `w-X h-X`.
- **Icons: `lucide-react` only** — use `data-icon` attribute in buttons, no manual sizing.
- **Conditional classes through `cn()`** (`@/lib/utils`) — never string-interpolate ternaries in `className`.
- **Forms: `FieldGroup` + `Field`** — not raw `<div>` + `<Label>`.
- **Overlays require a Title** — `DialogTitle` / `SheetTitle` / `DrawerTitle` (use `sr-only` to hide).
- **Items inside their Group** — `SelectItem` in `SelectGroup`, `DropdownMenuItem` in `DropdownMenuGroup`.
- Re-theme via `npx shadcn@latest apply b0`, never hard-code OKLCH values.

## Misc

- UI copy is in **Spanish**.
- `components.json` configures shadcn aliases (`@/components`, `@/lib/utils`, etc.).
- The dev server proxy sends `/api` requests to the backend at `localhost:3000`.
