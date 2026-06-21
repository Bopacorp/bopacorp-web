# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

BOPACORP internal CRM web app (BOPADIGITAL). UI is in Spanish. React 19 + TypeScript + Vite 8 + Tailwind CSS v4.

## Commands

- `npm run dev` — start dev server (Vite HMR)
- `npm run build` — type-check then build (`tsc -b && vite build`)
- `npm run check` — Biome lint/format fix + TypeScript type-check (`biome check --write . && tsc -b --noEmit`)
- `npm run lint` — Biome lint check
- `npm run lint:fix` — Biome lint fix
- `npm run format` — Biome format write
- `npm run preview` — preview production build
- `npx shadcn@latest add <component>` — add shadcn component
- `npx shadcn@latest search <query>` — find shadcn components before building custom UI

## Architecture

Entry: `src/main.tsx` → `<AuthProvider>` → `<App />` inside `<StrictMode>` + `<TooltipProvider>`. React Router v7 declarative `<Routes>` in `src/App.tsx`.

- `src/components/ui/` — shadcn/ui primitives (radix-nova style, configured in `components.json`)
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/hooks/` — custom hooks (`use-mobile.ts`)
- `src/index.css` — global styles, Tailwind imports, OKLCH color tokens (`:root` and `.dark`)

Path alias: `@/` maps to `./src/` (configured in both `vite.config.ts` and `tsconfig.json`).

## Design System (DESIGN.md is authoritative)

Preset `b0` owns all colors, fonts, radius. Read `DESIGN.md` for full rules. Key constraints:

- **Semantic tokens only** — `bg-primary`, `text-muted-foreground`, never raw Tailwind colors (`bg-blue-500`)
- **No `dark:` overrides** — `.dark` class on `<html>` flips tokens automatically via `next-themes`
- **Spacing: `gap-*`** not `space-y-*` / `space-x-*`
- **Equal dimensions: `size-*`** not `w-X h-X`
- **Icons: lucide-react only** — use `data-icon` attribute in buttons, no manual sizing
- **Conditional classes through `cn()`** — never string-interpolate ternaries in className
- **Forms: `FieldGroup` + `Field`** — not raw `<div>` + `<Label>`
- **Overlays require a Title** — `DialogTitle` / `SheetTitle` / `DrawerTitle` (use `sr-only` to hide)
- **Items inside their Group** — `SelectItem` in `SelectGroup`, `DropdownMenuItem` in `DropdownMenuGroup`
- **Search shadcn registries** before building custom components
- Re-theme via `npx shadcn@latest apply b0`, never hard-code OKLCH values

## Operational Rules

- **Do not read `.env` files.** Ask the user if you need to know an environment variable.
- **Do not start the dev server, build server, or any long-running service by yourself.** If you need a server running, ask the user first; it may already be running.
