# AGENTS.md

BOPACORP internal CRM web app (BOPADIGITAL). UI is in Spanish.

## Stack

- React 19 + TypeScript ~6.0 + Vite 8 + Tailwind CSS v4
- React Router v7 (declarative `<Routes>` in `src/App.tsx`)
- shadcn/ui (`radix-nova` style, preset `b0`)
- `next-themes` for dark mode (`.dark` class on `<html>`)

## Commands

- `npm run dev` — Vite HMR dev server
- `npm run build` — `tsc -b && vite build` (type-check is part of build)
- `npm run check` — Biome lint and format check
- `npm run check:fix` — Biome lint and format fix
- `npx shadcn@latest add <component>` — add shadcn primitive
- `npx shadcn@latest search <query>` — find components before building custom UI
- `npx shadcn@latest apply b0` — re-apply design preset (rewrites `src/index.css`)

No test runner is configured. There is no `test` script.

## Setup gotchas

- `@bopacorp/shared` (v0.1.4) is a **private scoped package** not on the public npm registry. `npm install` will 404 unless you have access to the private registry or the package is linked locally. If you hit this, ask the team for the `.npmrc` or local tarball.
- Node package manager: **npm** (`package-lock.json` present). `pnpm-lock.yaml` was removed.
- There is a `.env.example` in the repo root. Copy it to `.env` and set `VITE_API_URL` (complete backend base URL, e.g. `http://localhost:3000/api/v1`) before running `npm run dev`.

## Architecture

Entry: `src/main.tsx` → `<AuthProvider>` → `<App />` inside `<StrictMode>` + `<TooltipProvider>`.

Path alias: `@/` → `./src/` (configured in `vite.config.ts`, `tsconfig.json`, and `tsconfig.app.json`).

Directory ownership:
- `src/app/` — top-level layouts (`MainLayout.tsx` wraps public pages)
- `src/modules/` — feature modules: `landing/`, `admin/`, `auth/`
- `src/components/ui/` — shadcn/ui primitives (do not edit lightly; use `cva` variants)
- `src/shared/ui/` — cross-cutting UI helpers (`page-loader.tsx`, `error-state.tsx`)
- `src/lib/` — `utils.ts` (`cn()`)
- `src/services/` — `api.ts` (axios client), `auth.service.ts`
- `src/hooks/` — custom hooks

Auth flow:
- `AuthContext` stores JWT in `localStorage` (key: `bopacorp_auth`, plus `accessToken` / `refreshToken` / `tokenExpiresAt`)
- `api.ts` (`src/services/api.ts`) is the single source of truth for all API calls. It is an axios instance with request/response interceptors.
- Request interceptor: injects `Authorization: Bearer <accessToken>` from `localStorage`
- Response interceptor: on 401, queues pending requests, calls `/auth/refresh`, retries with new token. If refresh fails, clears storage and redirects to `/login`.
- `auth.service.ts` (`src/services/auth.service.ts`) provides `login`, `refresh`, `logout` using the `request<T>` helper.
- `RequireAuth` guard renders inline `LoginPage` when unauthenticated (redirect behavior in Fase 2)
- Backend base URL: `VITE_API_URL` env var. No proxy in `vite.config.ts`; axios hits the full URL directly.

## TypeScript conventions

- Imports use **`.js` extensions** even for `.tsx` files (e.g., `from '@/lib/api.js'`). This is consistent across the codebase because `moduleResolution: bundler` resolves them. Match existing style; do not switch to `.tsx`.
- `noUnusedLocals: true` and `noUnusedParameters: true` are enabled. Unused variables/params will fail `tsc -b`.
- `verbatimModuleSyntax: true` — use `import type { … }` for type-only imports.

## Code quality

- **Function size: ≤ 10 lines.** If a function exceeds 10 lines, break it into smaller named functions with single responsibilities. Exception: React component return JSX (pure markup) and trivial one-liners in callbacks. This applies to nested callbacks passed to `.use()`, `.map()`, `.then()`, etc.

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
