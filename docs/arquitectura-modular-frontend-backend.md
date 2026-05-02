# Arquitectura modular de referencia (Frontend + Backend)

Este documento define una referencia práctica para mantener **frontend y backend alineados por módulos de negocio**.

## Objetivo

Organizar el sistema por dominios (`pacientes`, `inventario`, `facturacion`, etc.) para:

- Reducir acoplamiento.
- Mejorar mantenibilidad.
- Facilitar crecimiento por equipos.
- Mantener un lenguaje de negocio consistente entre backend y frontend.

## Principios base

1. **Mismos módulos en ambos lados**
   - Si existe `inventario` en backend, debe existir `inventario` en frontend.
   - Evitar módulos “técnicos” en frontend que rompan el lenguaje del negocio.

2. **Vertical slice / feature-first**
   - Cada módulo encapsula sus páginas, componentes, hooks, servicios y tipos.
   - Las reglas del dominio viven dentro del módulo, no dispersas globalmente.

3. **Contratos por módulo**
   - Cada módulo define y consume sus propios contratos (DTOs/types/endpoints).
   - Evitar un `types/` global descontrolado.

4. **Dependencias unidireccionales**
   - Un módulo puede usar `shared/core`.
   - Un módulo **no** debe depender de internals de otro módulo.

5. **Superficie pública explícita**
   - Exponer entradas por módulo (`routes.tsx`, `index.ts`).
   - No importar archivos internos de forma cruzada.

## Estructura recomendada (Frontend)

```txt
src/
  app/                      # shell de aplicación (router raíz, providers globales)
  modules/
    administracion/
      routes.tsx
      pages/
      components/
      hooks/
      services/
      types/
    inventario/
      routes.tsx
      pages/
      components/
      hooks/
      services/
      types/
    facturacion/
      routes.tsx
      pages/
      components/
      hooks/
      services/
      types/
    odontologia/
      routes.tsx
      pages/
      components/
      hooks/
      services/
      types/
  shared/
    ui/                     # componentes base reutilizables
    auth/                   # sesión, guards, helpers de autenticación
    permissions/            # utilidades y componentes de permisos
    api/                    # cliente HTTP base e interceptores
    hooks/
    utils/
    types/
  styles/
```

## Estructura recomendada (Backend)

```txt
src/
  modules/
    administracion/
      domain/
      application/
      infrastructure/
      presentation/
    inventario/
      domain/
      application/
      infrastructure/
      presentation/
    facturacion/
      domain/
      application/
      infrastructure/
      presentation/
    odontologia/
      domain/
      application/
      infrastructure/
      presentation/
  shared/
    auth/
    permissions/
    persistence/
    logging/
```

> No es obligatorio usar exactamente estos nombres de capas, pero sí mantener separación clara de responsabilidades por módulo.

## Reglas de importación recomendadas

1. `modules/*` puede importar desde `shared/*`.
2. `modules/A` no importa internals de `modules/B`.
3. Exponer APIs internas por `index.ts` o `public.ts` por módulo.
4. Mantener aliases simples y consistentes:
   - `@/*` (raíz de `src`)
   - opcional: `@modules/*`, `@shared/*`

## Convenciones sugeridas

- Unificar idioma de naming (todo en español o todo en inglés).
- Unificar casing (`PascalCase` para componentes, `kebab-case` o `camelCase` para archivos según estándar elegido).
- Evitar duplicados semánticos (`usePermisos` vs `usePermission`) sin un propósito claro.

## Plan de migración gradual (sin romper producción)

1. **Congelar nuevos módulos fuera de `modules/`**.
2. Mover un módulo a la vez (ej. `inventario`) a estructura objetivo.
3. Crear `routes.tsx` por módulo y simplificar `App.tsx`.
4. Reubicar servicios/tipos globales hacia su módulo correspondiente.
5. Aplicar reglas de imports (lint + revisión de PR).

## Señales de una arquitectura saludable

- `App.tsx` pequeño, con composición de rutas por módulo.
- Cada módulo tiene límites claros.
- Cambios en un módulo no rompen otros.
- El equipo ubica rápidamente dónde implementar nuevas funcionalidades.

## Referencias conceptuales

- **Feature-First / Vertical Slice Architecture**
- **Feature-Sliced Design (FSD)** para frontend
- **DDD (Bounded Contexts + Ubiquitous Language)**
- **Modular Monolith** como paso previo a microservicios

