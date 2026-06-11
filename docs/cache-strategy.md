# LandingPage: ¿datos desde API o hardcodeado?

**Session ID:** ses_1602e03d2ffeL0tuN1QCQ8EnHF
**Created:** 6/6/2026, 9:03:19 PM
**Updated:** 6/6/2026, 9:13:27 PM

---

## User

la pagina de landing @src/modules/landing/pages/LandingPage.tsx  esta jalando los datos desde el api o el texto aun esta hardcodeado?

---

## Assistant (Plan · Kimi K2.6 · 3.9s)

_Thinking:_

El usuario quiere saber si la página de landing (`LandingPage.tsx`) está obteniendo los datos desde el API o si el texto está hardcodeado.

Analicemos el archivo:

1. La página importa `useCmsLanding` de `../hooks/use-cms-landing.js` (línea 7).
2. Usa `const { blocks } = useCmsLanding();` (línea 100).
3. Hay una función `resolveCms` que toma `blocks` y una clave, retornando el fallback si no existe (líneas 32-34).
4. Las funciones `getHeroCms`, `getAboutCms`, `getCtaCms` usan `resolveCms` con valores fallback hardcodeados.
5. El array `SERVICES` (líneas 9-28) está completamente hardcodeado.
6. Las estadísticas debajo del hero (+200, 99.9%, 7 años, +36%) también están hardcodeadas (líneas 147-171).
7. El título "Lo que hacemos por tu empresa" y su descripción en la sección de servicios están hardcodeados (líneas 179-184).

Entonces, la respuesta es **parcial**: 
- Las secciones Hero, About y CTA están configuradas para leer desde CMS (`useCmsLanding`) pero con fallbacks hardcodeados.
- La sección de Servicios (SERVICES array) está completamente hardcodeada.
- Las estadísticas numéricas debajo del hero están hardcodeadas.
- La sección "Lo que hacemos por tu empresa" (título y descripción de la sección de servicios) está hardcodeada.

Necesito verificar el hook `useCmsLanding` para confirmar si está haciendo realmente una llamada al API. Pero según las reglas del modo plan, puedo leer archivos. Voy a leer el hook también.

Voy a revisar también el hook que consume los datos para confirmar si está haciendo llamadas al API.

**Tool: read**

**Input:**
```json
{
  "filePath": "/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/hooks/use-cms-landing.ts"
}
```

**Output:**
```
<path>/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/hooks/use-cms-landing.ts</path>
<type>file</type>
<content>
1: import { useCallback, useEffect, useState } from 'react';
2: import { request } from '@/services/api.js';
3: 
4: interface ContentBlockResponse {
5:   id: string;
6:   contentKey: string;
7:   body: string;
8: }
9: 
10: interface CmsLandingResponse {
11:   blocks: Record<string, ContentBlockResponse>;
12: }
13: 
14: interface CancelState {
15:   cancelled: boolean;
16: }
17: 
18: export function useCmsLanding() {
19:   const [blocks, setBlocks] = useState<Record<string, ContentBlockResponse> | null>(null);
20:   const [loading, setLoading] = useState(true);
21:   const [error, setError] = useState<string | null>(null);
22:   const [retryCount, setRetryCount] = useState(0);
23: 
24:   const loadData = useCallback(async (state: CancelState) => {
25:     try {
26:       const data = await request<CmsLandingResponse>({ method: 'GET', url: '/cms/landing' });
27:       applyData(data, state, setBlocks, setLoading);
28:     } catch (err) {
29:       applyError(err, state, setError, setLoading);
30:     }
31:   }, []);
32: 
33:   // biome-ignore lint/correctness/useExhaustiveDependencies: retryCount is the intentional trigger for refetch
34:   useEffect(() => {
35:     const state: CancelState = { cancelled: false };
36:     loadData(state);
37:     return () => {
38:       state.cancelled = true;
39:     };
40:   }, [retryCount, loadData]);
41: 
42:   const retry = useCallback(() => {
43:     setLoading(true);
44:     setError(null);
45:     setRetryCount((n) => n + 1);
46:   }, []);
47: 
48:   return { blocks, loading, error, retry };
49: }
50: 
51: function applyData(
52:   data: CmsLandingResponse,
53:   state: CancelState,
54:   setBlocks: (blocks: Record<string, ContentBlockResponse>) => void,
55:   setLoading: (loading: boolean) => void,
56: ) {
57:   if (state.cancelled) return;
58:   setBlocks(data.blocks);
59:   setLoading(false);
60: }
61: 
62: function applyError(
63:   err: unknown,
64:   state: CancelState,
65:   setError: (error: string | null) => void,
66:   setLoading: (loading: boolean) => void,
67: ) {
68:   if (state.cancelled) return;
69:   setError(err instanceof Error ? err.message : 'Unknown error');
70:   setLoading(false);
71: }

(End of file - total 71 lines)
</content>
```

---

## Assistant (Plan · Kimi K2.6 · 3.9s)

_Thinking:_

Ahora tengo toda la información necesaria para responder la pregunta del usuario.

Resumen:
1. El hook `useCmsLanding` SÍ hace una llamada al API (`/cms/landing`) para obtener bloques de contenido dinámico.
2. La página `LandingPage.tsx` usa estos bloques con la función `resolveCms`, la cual recibe un fallback por defecto si el bloque no existe o no se ha cargado.
3. Las secciones Hero, About y CTA leen desde CMS con fallback hardcodeado.
4. Sin embargo, hay contenido que está completamente hardcodeado sin conexión al CMS:
   - El array `SERVICES` (Conectividad Empresarial, Planes Corporativos, Servicios Digitales)
   - Las estadísticas numéricas del hero (+200, 99.9%, 7 años, +36%)
   - El título y descripción de la sección de servicios ("Lo que hacemos por tu empresa")
   - Los datos de la card de servicios (título, ícono, descripción)

Entonces la respuesta es: es mixto. Parte del contenido viene del API (hero, about, cta) y parte está hardcodeado (servicios, estadísticas, sección de servicios en general).

El usuario me pregunta directamente, no es una tarea de modificación. Puedo responder directamente en texto.

La página está en **modo mixto**:

**Sí, consume el API** para las secciones Hero, About y CTA:
- El hook `useCmsLanding` hace un `GET` a `/cms/landing`.
- El contenido de estas secciones se resuelve con `resolveCms(blocks)`, usando como **fallback** valores hardcodeados si el CMS no responde o no tiene esos bloques.

**Pero sigue con texto hardcodeado** en estas partes (sin conectar al CMS):

1. **Sección de Servicios** (líneas 9-28 y 175-208):
   - El array `SERVICES` completo (Conectividad Empresarial, Planes Corporativos, Servicios Digitales) está hardcodeado.
   - El título `"Lo que hacemos por tu empresa"` y su descripción están hardcodeados.

2. **Estadísticas del Hero** (líneas 147-171):
   - `+200 empresas conectadas`
   - `99.9% uptime garantizado`
   - `7 años de trayectoria`
   - `+36% crecimiento neto`

¿Quieres que haga que toda esa sección de Servicios y las estadísticas también vengan dinámicamente del CMS?

---

## User

se podria agregar caching? seria una estrategia de frontend o backend?

---

## Assistant (Plan · Kimi K2.6 · 8.4s)

_Thinking:_

El usuario pregunta sobre caching para la landing page. Ya revisé que `useCmsLanding` consume `/cms/landing`. El usuario quiere saber si caching sería estrategia frontend o backend, y si se podría agregar.

Dado que estoy en "Plan Mode" (solo lectura), debo analizar, planificar y presentar opciones al usuario sin hacer cambios.

Voy a considerar las opciones de caching:
1. **Frontend caching**: `stale-while-revalidate` con `useSWR` o `TanStack Query (React Query)` — el oro estándar en React. Cachea en memoria, refetch en background, deduplica requests.
2. **Backend caching**: HTTP caching headers (`Cache-Control`, `ETag`, `Last-Modified`) o un CDN/proxy como Varnish/Cloudflare.
3. **Hybrid**: ambos.

Para una landing page, lo ideal es:
- **Backend**: `Cache-Control: max-age=300, stale-while-revalidate=600` (o similar). Si el contenido del CMS cambia poco, esto evita incluso que el request llegue al backend.
- **Frontend**: TanStack Query con `staleTime: 5 * 60 * 1000`. Esto evita refetches innecesarios cuando el usuario navega entre páginas (SPA behavior). Si ya tiene los datos en caché y no están stale, no hace el request.

Preguntas para clarificar:
1. ¿Qué librería de data fetching ya usan o prefieren? (react-query, swr, o nada?)
2. ¿El contenido del CMS cambia con qué frecuencia? (cada hora, cada día?)
3. ¿El backend ya soporta HTTP cache headers o ETags?

Voy a presentar un plan con opciones y preguntas clave.

Excelente pregunta. El hook `useCmsLanding` hace un `GET` a `/cms/landing` en cada montaje del componente, sin ninguna caché. Podemos atacarlo de dos lados:

---

### Opciones de caching

| Estrategia | Qué hace | Pros | Contras |
|---|---|---|---|
| **A. Frontend (TanStack Query / SWR)** | Cachea en memoria del navegador. Refetch en background si los datos son "stale". | Instantáneo entre navegaciones SPA. Deduplica requests. Revalidación automática. Muy fácil de implementar. | Solo funciona dentro de la sesión del usuario. |
| **B. Backend (HTTP Cache-Control / ETag)** | El servidor (o CDN) responde sin golpear la DB. | Reduce carga del backend. Sirve para cualquier cliente (incluido SEO/bots). | Requiere que el backend envíe headers o un CDN delante. |
| **C. Híbrida (recomendada)** | TanStack Query + `Cache-Control` en el backend. | Lo mejor de ambos. El frontend no pide nada si tiene cache fresca; el backend no se golpea si el navegador tiene cache HTTP. | Un poco más de trabajo en ambos lados. |

---

### Mi recomendación

Para una landing page cuyo contenido cambia poco (CMS), la **estrategia híbrida** es la óptima:

1. **Instalar TanStack Query (React Query)** — es el estándar de facto para data fetching en React. Reemplaza `useCmsLanding` por `useQuery` con `staleTime: 5 min`.
2. **Agregar `Cache-Control: max-age=300`** en la respuesta del backend `/cms/landing` (si es posible).
3. **Considerar `ETag` o `Last-Modified`** en el backend para revalidación condicional.

Esto significa:
- Si el usuario navega de `/services` a `/` (landing), no hay request de red si los datos tienen < 5 min.
- Si el usuario recarga (F5), el navegador puede servir del HTTP cache si está dentro de `max-age`.
- Cuando un admin actualiza el CMS, el cambio se refleja en ≤ 5 min (ajustable).

---

### Preguntas antes de implementar

1. **¿Tienen preferencia por alguna librería de data fetching?** (TanStack Query, SWR, o quieren evitar dependencias nuevas y hacer algo manual con `sessionStorage`?)
2. **¿Con qué frecuencia cambia el contenido del CMS?** (¿cada hora, cada día, cada semana?) Eso define `staleTime` y `max-age`.
3. **¿Tienen control del backend para agregar headers de cache?** (o es un backend externo/Bopacorp donde no pueden tocar?)

Dependiendo de tus respuestas, armo el plan exacto de implementación.

---

## User

pero al ser una landing yo esperaria que se cacheara entre sesiones, no en memoria

---

## Assistant (Plan · Kimi K2.6 · 11.9s)

_Thinking:_

El usuario quiere caching que persista entre sesiones (es decir, cuando el usuario cierra el navegador y vuelve más tarde). Eso descarta el caching en memoria de TanStack Query a menos que se configure con persistencia (como `persistQueryClient` o similar).

Las opciones de frontend para caching entre sesiones son:

1. **localStorage / sessionStorage** - Muy simple, pero limitado en tamaño (~5MB), no comprime, no maneja invalidación sofisticada.
2. **IndexedDB** - Más capacidad, mejor para objetos grandes, pero más complejo.
3. **Cache API (Service Worker)** - El estándar web para caché HTTP en el navegador. Puede persistir entre sesiones y maneja headers de HTTP. Requiere un service worker.
4. **TanStack Query con persistencia** - Usa `persistQueryClient` con un plugin como `createSyncStoragePersister` (localStorage) o `createAsyncStoragePersister` (IndexedDB). Es una capa sobre localStorage/IndexedDB.

Pero el usuario también mencionó la landing page y el CMS. La Cache API del navegador (con un service worker) es la más robusta para esto, pero también es más pesada de implementar.

Dado que estamos en **Plan Mode** y NO puedo hacer cambios, debo:
1. Analizar qué estrategias existen
2. Hacer preguntas al usuario para decidir la mejor
3. Presentar un plan

Opciones de caching persistente:

**A. HTTP Cache + Cache-Control (Backend)**
- El backend envía `Cache-Control: public, max-age=3600, immutable` o similar.
- El navegador guarda en su HTTP cache (que persiste entre sesiones).
- **Pros**: No requiere código frontend. El navegador maneja todo. Persistencia real.
- **Contras**: Requiere que el backend soporte estos headers. Invalidación es compleja si el CMS cambia.

**B. Service Worker con Cache API**
- Un SW intercepta la petición a `/cms/landing` y guarda en Cache API.
- Se puede configurar para "cache first, then network" o "stale-while-revalidate".
- **Pros**: Persistencia real entre sesiones. Control total del frontend. Funciona offline.
- **Contras**: Más complejo. Requiere registro de SW. Manejo de updates.

**C. TanStack Query + localStorage persistence**
- Usar `persistQueryClient` con `createSyncStoragePersister` (localStorage).
- **Pros**: Fácil de implementar si ya usan TanStack Query. Invalidación inteligente.
- **Contras**: localStorage es síncrono y lento para datos grandes. Tamaño limitado. No es "HTTP caching" real.

**D. IndexedDB manual o con una librería**
- Guardar los datos del CMS en IndexedDB.
- **Pros**: Más capacidad que localStorage. Persistencia real.
- **Contras**: Más código boilerplate.

La mejor opción para una landing page con contenido CMS que no cambia frecuentemente:

**Recomendación: Estrategia Híbrida con Service Worker (Cache API)**
- El SW cachea la respuesta de `/cms/landing`.
- Política: `Stale-While-Revalidate` — sirve del caché inmediatamente, pero hace un fetch en background para actualizar.
- Si el CMS cambia, el usuario ve la versión vieja en la primera carga, pero se actualiza para la siguiente.
- Se puede agregar un `ETag` o versión para invalidar.

Otra opción simple y efectiva:
**Recomendación alternativa: localStorage con timestamp**
- Guardar `{ data, timestamp }` en localStorage.
- Al cargar, si timestamp < 24h, usar caché. Si no, fetch.
- **Pros**: Extremadamente simple. No requiere SW ni librerías nuevas.
- **Contras**: localStorage es bloqueante. Tamaño limitado. No es una solución "enterprise" pero funciona.

Dado que el usuario dice "al ser una landing yo esperaría que se cacheara entre sesiones", esto suena como que esperan un comportamiento de navegador estándar (HTTP caching) o algo muy simple.

Debo preguntarle sobre:
1. Si tienen control del backend para agregar headers de cache (Cache-Control, ETag)
2. Si están dispuestos a agregar un Service Worker
3. Si prefieren una solución puramente frontend (localStorage/IndexedDB)

Y presentar el plan basado en eso.

Perfecto, entonces queremos **persistencia real entre sesiones**, no solo en memoria de la SPA.

Las opciones que persisten cuando el usuario cierra y reabre el navegador son:

| Estrategia | Mecanismo | Ventaja principal | Desventaja |
|---|---|---|---|
| **A. HTTP Cache nativo** | El navegador guarda la respuesta del `GET /cms/landing` en su cache de disco si el backend envía `Cache-Control`. | Cero código frontend. El navegador lo maneja todo. | Requiere control del backend para enviar headers. |
| **B. Service Worker + Cache API** | Un SW intercepta el fetch y almacena la respuesta en la Cache API del navegador. | Control total desde frontend. Persistencia real. Funciona offline. | Más complejo. Requiere registrar y mantener un SW. |
| **C. localStorage / IndexedDB** | Guardamos manualmente `{ blocks, timestamp }` en `localStorage` o `IndexedDB`. | Fácil de implementar. No requiere SW ni backend. | `localStorage` es bloqueante y limitado (~5MB). Menos "elegante". |

---

Mi recomendación depende de una variable clave:

**¿Tienen acceso al backend para que `/cms/landing` responda con headers de cache como `Cache-Control: public, max-age=3600` o `ETag`?**

- **Si tienen acceso al backend**: La solución óptima es puramente de **backend** (HTTP caching). El navegador guarda en disco automáticamente. El frontend no necesita cambiar nada salvo quizás asegurar que axios no deshabilite el cache.
- **Si NO tienen acceso al backend**: La mejor solución de **frontend** es un **Service Worker con Cache API** (estrategia `Stale-While-Revalidate`: sirve inmediatamente del caché, pero refresca en background). Es más robusto que `localStorage` porque usa la infraestructura de caching HTTP del navegador.

¿Cuál es su situación con el backend? ¿Pueden agregarle headers de cache, o es un backend externo sobre el que no tienen control?

---

## User

como funciona la estrategia A, si tengo acceso al backend?

---

## Assistant (Plan · Kimi K2.6 · 6.8s)

_Thinking:_

The user wants to understand how Strategy A (HTTP Cache nativo via backend headers) works, since they have access to the backend. I should explain the mechanism clearly without making any edits. I need to stay in READ-ONLY/planning mode.

I should explain:
1. How the browser's native HTTP cache works
2. What headers need to be sent from the backend
3. How the frontend (axios) interacts with it
4. The flow with ETag/Last-Modified for revalidation
5. Pros/cons in their specific context

Let me provide a clear, concise explanation.

## Cómo funciona la Estrategia A: HTTP Cache nativo (backend)

Es la forma más simple y robusta porque **delegas todo al navegador**. No escribes código de caching en el frontend.

### 1. El backend envía headers en la respuesta de `GET /cms/landing`

El servidor debe responder con headers de cache. Por ejemplo:

```http
HTTP/1.1 200 OK
Cache-Control: public, max-age=300
ETag: "abc123"
Content-Type: application/json

{ "blocks": {...} }
```

### 2. El navegador guarda la respuesta en disco

Cuando el usuario carga la landing por primera vez:
- El navegador **almacena la respuesta completa** en su caché HTTP de disco (persistente entre sesiones).
- También guarda el `ETag` asociado a esa URL.

### 3. En visitas posteriores, el navegador decide solo

Cuando el usuario vuelve (hoy, mañana, en una semana):

**Escenario A: El cache aún es "fresco" (dentro de `max-age`)**
- El navegador **no hace ningún request de red**.
- Sirve la respuesta instantáneamente desde el disco.
- El backend no se entera.

**Escenario B: El cache es "viejo" (pasó `max-age`)**
- El navegador envía una petición **condicional**:
  ```http
  GET /cms/landing
  If-None-Match: "abc123"
  ```
- El backend compara el `ETag`:
  - **Si no cambió:** responde `304 Not Modified` (sin body). El navegador renueva el cache y sirve lo que ya tenía.
  - **Si cambió:** responde `200 OK` con el nuevo body y nuevo `ETag`.

### 4. Qué pasa con axios

Axios usa `fetch`/`XMLHttpRequest` por debajo, que **respeta automáticamente el cache del navegador** si no se lo deshabilitas. No necesitas cambiar nada en el frontend salvo asegurar que no tengas configuraciones como `cache: 'no-store'` o `Pragma: no-cache`.

---

### Headers recomendados para tu caso (CMS de landing)

```http
Cache-Control: public, max-age=60, stale-while-revalidate=300
ETag: "<hash-del-contenido>"
```

Esto significa:
- `max-age=60`: Durante 1 minuto, cero requests al backend (sirve del disco).
- `stale-while-revalidate=300`: Entre el minuto 1 y 6, sigue sirviendo del caché **pero en paralelo refresca silenciosamente** con el backend. El usuario nunca espera.
- `ETag`: El backend genera un hash del contenido. Si alguien editó el CMS, el hash cambia y el navegador se entera en la siguiente revalidación.

---

### Ventajas para ustedes

- **Cero código de caching en el frontend.** El hook `useCmsLanding` puede quedar exactamente igual.
- **Persistencia real.** El caché vive en disco del navegador, sobrevive cierres de pestaña, sesiones, reinicios.
- **Funciona para bots y SEO.** Googlebot también cachea y ahorra recursos.
- **El backend controla la "frescura".** Si un admin edita el CMS, cambias el `ETag` y los navegadores se actualizan.

---

### ¿Cuál es el próximo paso?

¿Quieres que prepare un **plan de implementación** detallado? Necesitaría saber:

1. **¿Qué stack usa el backend?** (Node/Express, NestJS, Python, etc.) — para saber cómo agregar los headers correctamente.
2. **¿El contenido del CMS se guarda en una base de datos?** — para calcular el `ETag` (por ejemplo, un hash del `updatedAt` o del contenido mismo).
3. **¿Qué tan rápido necesitan que se reflejen los cambios del CMS?** — para ajustar `max-age` vs `stale-while-revalidate`.

Con eso te armo la receta exacta de qué cambiar en el backend y si hay algo mínimo que revisar en el frontend (axios).

---

## User

que tal si la pagina espera mientras se responde?

---

## Assistant (Plan · Kimi K2.6 · 9.7s)

_Thinking:_

El usuario está preguntando sobre una UX específica: "que tal si la pagina espera mientras se responde" — es decir, si la landing page muestra un loader/espera mientras se carga el contenido del CMS, en lugar de mostrar los fallbacks hardcodeados inmediatamente.

Necesito entender bien la situación actual:
1. El hook `useCmsLanding` tiene `loading` y `error` states, pero en el componente `LandingPage` no se usan. El componente siempre renderiza con los fallbacks.
2. El usuario parece preguntar: ¿es mejor que la página espere a los datos del CMS antes de mostrar contenido?

Esto es una decisión de UX/estrategia, no solo técnica. Necesito:
- Explicar las opciones
- Hacer preguntas clarificadoras sobre lo que él prefiere
- Construir un plan

Las opciones son:
1. **Show immediately with fallbacks** (como está ahora): Renderiza al instante con hardcoded text. Cuando llega el CMS, reemplaza el contenido. Pros: instantáneo. Contras: layout shift, contenido que "salta" de inglés a español o de genérico a específico.
2. **Wait for data** (skeleton/loader): Muestra un skeleton o spinner hasta que `useCmsLanding` responda. Pros: contenido final desde el primer frame. Contras: página en blanco/skeleton por X ms.
3. **Hybrid** (stale-while-revalidate con persistencia): Usa TanStack Query con persistencia (localStorage/IndexedDB) para mostrar inmediatamente el caché anterior, mientras refresca en background. Si no hay caché, muestra skeleton.

Dado que estamos en Plan Mode, no puedo hacer edits. Debo plantear opciones y hacer preguntas.

Entiendo la pregunta: estás evaluando la **UX de carga** de la landing page. Actualmente el componente renderiza inmediatamente con los textos hardcodeados como fallback, sin esperar la respuesta del CMS. ¿Es mejor que la página "espere" a tener los datos reales antes de pintar?

Hay **tres estrategias de UX** posibles, cada una con tradeoffs claros:

---

### Opción 1: Mostrar inmediatamente con fallbacks (como está ahora)
- El usuario ve contenido al instante.
- Si el CMS responde rápido, el texto "salta" del fallback al real.
- Riesgo de **layout shift** si los textos del CMS son más largos/cortos.
- Ideal si: el fallback es casi igual al real, y la prioridad es velocidad percibida.

### Opción 2: Esperar a los datos (Skeleton → Contenido real)
- Muestra un skeleton o spinner mientras `useCmsLanding` carga.
- El primer contenido que ve el usuario es el **definitivo**, sin saltos.
- Si el API es lento o falla, el usuario espera en vacío o ve error.
- Ideal si: el CMS es la fuente de verdad y los fallbacks no representan bien la marca.

### Opción 3: Híbrida "Stale-While-Revalidate" (recomendada para tu caso)
- Primera visita: skeleton → datos del API → se guardan en `localStorage`/`IndexedDB`.
- Visitas siguientes: muestra **instantáneamente** el caché persistente, mientras refresca silenciosamente en background.
- Combinas velocidad + consistencia + persistencia entre sesiones.
- Requiere: TanStack Query + `persistQueryClient` o una solución manual con `IndexedDB`.

---

### Preguntas para definir el plan exacto

1. **¿El contenido hardcodeado actual es temporal o es el definitivo?**  
   Es decir: ¿los fallbacks son textos reales de Bopacorp, o son placeholders que nunca deberían verse en producción?

2. **¿Qué tan crítico es que un usuario vea el contenido exacto del CMS desde el primer frame?**  
   Por ejemplo: si un admin cambió el hero a una promo de "50% off", ¿es aceptable que por 200ms se vea el texto antiguo?

3. **¿Qué tal funciona el backend en latencia?**  
   ¿El `GET /cms/landing` responde en <100ms, o a veces tarda segundos? Eso define si un skeleton es molesto o necesario.

4. **¿Quieres resolver el "caché entre sesiones" y la "UX de espera" en un solo cambio, o son dos tareas separadas?**

Con esas respuestas armo el plan de implementación concreto.

---

## User

Planifica exahustivamente la opcion 3

---

## Assistant (Plan · Kimi K2.6 · 11.3s)

_Thinking:_

The user wants an exhaustive plan for Option 3: "Stale-While-Revalidate" hybrid caching for the landing page. This means:
1. First visit: show skeleton while loading from API, then cache persistently
2. Subsequent visits: show cached data instantly, refresh silently in background
3. Persist between sessions

I need to plan this without making any edits. Let me first explore the codebase to understand:
- The current landing module structure
- How `useCmsLanding` works
- The existing dependencies (do we have TanStack Query already?)
- The API client setup
- Any existing persistent storage patterns in the codebase
- The design system for skeletons

Let me explore thoroughly.

**Tool: task**

**Input:**
```json
{
  "description": "Explore landing and caching infra",
  "prompt": "I need to plan a persistent caching strategy for the landing page. Please explore the codebase and gather:\n\n1. The complete `src/modules/landing/` directory tree and all files.\n2. Check if `@tanstack/react-query` or any similar data-fetching library is already in `package.json` dependencies.\n3. Check if there are any existing hooks or utilities for localStorage/IndexedDB caching in `src/hooks/` or `src/lib/`.\n4. Check if there are any existing skeleton/shimmer components in `src/components/ui/` or `src/shared/ui/`.\n5. Look at `src/services/api.ts` to understand the `request` helper and axios instance.\n6. Check `src/main.tsx` to see how providers are set up.\n7. Check if there's any existing error boundary or loading state pattern used in other pages.\n8. Look at `tsconfig.json` and `vite.config.ts` for any relevant config.\n\nReturn all findings as structured text. Be very thorough - list every file found and its key content.",
  "subagent_type": "explore"
}
```

**Error:**
```
NOT NULL constraint failed: session_message.seq
```

---

## Assistant (Plan · Kimi K2.6 · 1.7s)

_Thinking:_

The task tool failed with a database error. Let me try reading the files directly instead.

**Tool: glob**

**Input:**
```json
{
  "pattern": "src/modules/landing/**/*"
}
```

**Output:**
```
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/pages/LandingPage.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/pages/ServicesPage.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/pages/JobsPage.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/pages/AboutPage.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/hooks/use-cms-landing.ts
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "src/hooks/**/*"
}
```

**Output:**
```
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/hooks/use-mobile.ts
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "src/lib/**/*"
}
```

**Output:**
```
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/lib/utils.ts
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/lib/sanitize.ts
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "src/components/ui/**/*"
}
```

**Output:**
```
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/tooltip.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/toggle.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/toggle-group.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/textarea.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/tabs.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/table.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/switch.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/sonner.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/skeleton.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/sidebar.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/sheet.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/separator.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/select.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/scroll-area.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/progress.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/popover.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/pagination.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/navigation-menu.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/label.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/input.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/input-group.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/dropdown-menu.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/drawer.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/field.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/empty.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/dialog.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/data-table.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/confirm-dialog.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/command.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/combobox.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/collapsible.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/checkbox.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/chart.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/card.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/calendar.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/button.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/breadcrumb.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/badge.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/avatar.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/alert-dialog.tsx
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "src/shared/ui/**/*"
}
```

**Output:**
```
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/shared/ui/page-loader.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/shared/ui/index.ts
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/shared/ui/error-state.tsx
/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/shared/ui/empty-state.tsx
```

---

## Assistant (Plan · Kimi K2.6 · 2.6s)

_Thinking:_

Good, I found the key files. Now I need to read them to understand the current setup before planning. Let me read the most important ones in parallel.

**Tool: read**

**Input:**
```json
{
  "filePath": "/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/hooks/use-cms-landing.ts"
}
```

**Output:**
```
<path>/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/hooks/use-cms-landing.ts</path>
<type>file</type>
<content>
1: import { useCallback, useEffect, useState } from 'react';
2: import { request } from '@/services/api.js';
3: 
4: interface ContentBlockResponse {
5:   id: string;
6:   contentKey: string;
7:   body: string;
8: }
9: 
10: interface CmsLandingResponse {
11:   blocks: Record<string, ContentBlockResponse>;
12: }
13: 
14: interface CancelState {
15:   cancelled: boolean;
16: }
17: 
18: export function useCmsLanding() {
19:   const [blocks, setBlocks] = useState<Record<string, ContentBlockResponse> | null>(null);
20:   const [loading, setLoading] = useState(true);
21:   const [error, setError] = useState<string | null>(null);
22:   const [retryCount, setRetryCount] = useState(0);
23: 
24:   const loadData = useCallback(async (state: CancelState) => {
25:     try {
26:       const data = await request<CmsLandingResponse>({ method: 'GET', url: '/cms/landing' });
27:       applyData(data, state, setBlocks, setLoading);
28:     } catch (err) {
29:       applyError(err, state, setError, setLoading);
30:     }
31:   }, []);
32: 
33:   // biome-ignore lint/correctness/useExhaustiveDependencies: retryCount is the intentional trigger for refetch
34:   useEffect(() => {
35:     const state: CancelState = { cancelled: false };
36:     loadData(state);
37:     return () => {
38:       state.cancelled = true;
39:     };
40:   }, [retryCount, loadData]);
41: 
42:   const retry = useCallback(() => {
43:     setLoading(true);
44:     setError(null);
45:     setRetryCount((n) => n + 1);
46:   }, []);
47: 
48:   return { blocks, loading, error, retry };
49: }
50: 
51: function applyData(
52:   data: CmsLandingResponse,
53:   state: CancelState,
54:   setBlocks: (blocks: Record<string, ContentBlockResponse>) => void,
55:   setLoading: (loading: boolean) => void,
56: ) {
57:   if (state.cancelled) return;
58:   setBlocks(data.blocks);
59:   setLoading(false);
60: }
61: 
62: function applyError(
63:   err: unknown,
64:   state: CancelState,
65:   setError: (error: string | null) => void,
66:   setLoading: (loading: boolean) => void,
67: ) {
68:   if (state.cancelled) return;
69:   setError(err instanceof Error ? err.message : 'Unknown error');
70:   setLoading(false);
71: }

(End of file - total 71 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/main.tsx"
}
```

**Output:**
```
<path>/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/main.tsx</path>
<type>file</type>
<content>
1: import { StrictMode } from 'react';
2: import { createRoot } from 'react-dom/client';
3: import { Toaster } from 'sonner';
4: import { TooltipProvider } from '@/components/ui/tooltip';
5: import { AuthProvider } from '@/modules/auth/context/AuthContext.js';
6: import './index.css';
7: import App from './App.tsx';
8: 
9: const rootElement = document.getElementById('root');
10: if (!rootElement) {
11:   throw new Error('Root element not found');
12: }
13: 
14: createRoot(rootElement).render(
15:   <StrictMode>
16:     <TooltipProvider>
17:       <AuthProvider>
18:         <App />
19:         <Toaster position="bottom-right" richColors closeButton />
20:       </AuthProvider>
21:     </TooltipProvider>
22:   </StrictMode>,
23: );

(End of file - total 23 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/services/api.ts"
}
```

**Output:**
```
<path>/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/services/api.ts</path>
<type>file</type>
<content>
1: import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
2: import axios from 'axios';
3: import {
4:   clearAll,
5:   getAccessToken,
6:   getRefreshToken,
7:   getTokenExpiresAt,
8:   saveTokens,
9: } from './auth-storage.js';
10: 
11: const baseURL = import.meta.env.VITE_API_URL as string;
12: 
13: if (!baseURL) {
14:   throw new Error('VITE_API_URL is required');
15: }
16: 
17: if (!baseURL.includes('/api/')) {
18:   throw new Error('VITE_API_URL must include the API path (e.g. http://localhost:3000/api/v1)');
19: }
20: 
21: const api = axios.create({ baseURL });
22: 
23: api.interceptors.request.use(injectAuthHeader);
24: 
25: let isRefreshing = false;
26: let refreshSubscribers: Array<(token: string) => void> = [];
27: 
28: api.interceptors.response.use(
29:   (response) => response,
30:   (error) => handleResponseError(error as AxiosError),
31: );
32: 
33: export class ApiError extends Error {
34:   code: string;
35:   constructor(code: string, message: string) {
36:     super(message);
37:     this.code = code;
38:   }
39: }
40: 
41: export async function request<T>(config: AxiosRequestConfig): Promise<T> {
42:   const response = await api(config);
43:   if (!response.data.success) {
44:     throw new ApiError(response.data.error.code, response.data.error.message);
45:   }
46:   return response.data.data as T;
47: }
48: 
49: export default api;
50: 
51: function injectAuthHeader(config: InternalAxiosRequestConfig) {
52:   const token = getAccessToken();
53:   const expiresAt = getTokenExpiresAt();
54: 
55:   if (token && expiresAt && expiresAt - Date.now() < 120000 && !isRefreshing) {
56:     return triggerProactiveRefresh().then(() => {
57:       const newToken = getAccessToken();
58:       if (newToken) {
59:         config.headers.Authorization = `Bearer ${newToken}`;
60:       }
61:       return config;
62:     });
63:   }
64: 
65:   if (token) {
66:     config.headers.Authorization = `Bearer ${token}`;
67:   }
68:   return config;
69: }
70: 
71: type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
72: 
73: function handleResponseError(error: AxiosError) {
74:   const originalRequest = error.config as RetryConfig;
75:   if (!shouldRefresh(error, originalRequest)) {
76:     return Promise.reject(error);
77:   }
78:   return isRefreshing ? queueForRefresh(originalRequest) : refreshWithRetry(originalRequest);
79: }
80: 
81: function shouldRefresh(error: AxiosError, request: RetryConfig) {
82:   return error.response?.status === 401 && !request._retry;
83: }
84: 
85: function queueForRefresh(request: RetryConfig) {
86:   return new Promise((resolve) => {
87:     refreshSubscribers.push((token) => {
88:       request.headers.Authorization = `Bearer ${token}`;
89:       resolve(api(request));
90:     });
91:   });
92: }
93: 
94: async function refreshWithRetry(request: RetryConfig) {
95:   request._retry = true;
96:   isRefreshing = true;
97: 
98:   try {
99:     const token = getRefreshToken();
100:     if (!token) throw new Error('No refresh token');
101: 
102:     const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: token });
103:     const { accessToken, refreshToken: newRefreshToken, expiresIn } = res.data.data;
104: 
105:     saveTokens({ accessToken, refreshToken: newRefreshToken, expiresIn });
106:     notifySubscribers(accessToken);
107:     dispatchTokenRefreshed();
108: 
109:     return api(request);
110:   } catch (err) {
111:     return handleRefreshError(err as AxiosError);
112:   } finally {
113:     isRefreshing = false;
114:   }
115: }
116: 
117: async function triggerProactiveRefresh() {
118:   isRefreshing = true;
119: 
120:   try {
121:     const token = getRefreshToken();
122:     if (!token) throw new Error('No refresh token');
123: 
124:     const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: token });
125:     const { accessToken, refreshToken: newRefreshToken, expiresIn } = res.data.data;
126: 
127:     saveTokens({ accessToken, refreshToken: newRefreshToken, expiresIn });
128:     dispatchTokenRefreshed();
129:   } catch {
130:     clearAll();
131:     redirectToLogin();
132:   } finally {
133:     isRefreshing = false;
134:   }
135: }
136: 
137: function notifySubscribers(token: string) {
138:   for (const cb of refreshSubscribers) {
139:     cb(token);
140:   }
141:   refreshSubscribers = [];
142: }
143: 
144: function dispatchTokenRefreshed() {
145:   window.dispatchEvent(new Event('bopacorp:token-refreshed'));
146: }
147: 
148: function handleRefreshError(error: AxiosError) {
149:   clearAll();
150:   redirectToLogin();
151:   return Promise.reject(error);
152: }
153: 
154: function redirectToLogin() {
155:   window.location.href = '/login';
156: }

(End of file - total 156 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/skeleton.tsx"
}
```

**Output:**
```
<path>/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/components/ui/skeleton.tsx</path>
<type>file</type>
<content>
1: import { cn } from '@/lib/utils'
2: 
3: function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
4:   return (
5:     <div
6:       data-slot="skeleton"
7:       className={cn('animate-pulse rounded-md bg-muted', className)}
8:       {...props}
9:     />
10:   )
11: }
12: 
13: export { Skeleton }

(End of file - total 13 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/shared/ui/page-loader.tsx"
}
```

**Output:**
```
<path>/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/shared/ui/page-loader.tsx</path>
<type>file</type>
<content>
1: import { Loader2 } from 'lucide-react';
2: import { Skeleton } from '@/components/ui/skeleton';
3: 
4: interface PageLoaderProps {
5:   message?: string;
6: }
7: 
8: export function PageLoader({ message }: PageLoaderProps) {
9:   if (message) {
10:     return (
11:       <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-background text-foreground">
12:         <Loader2 className="size-8 animate-spin text-primary" />
13:         <p className="text-sm text-muted-foreground">{message}</p>
14:       </div>
15:     );
16:   }
17: 
18:   return (
19:     <div className="flex flex-col gap-6 p-6">
20:       <div className="flex flex-col items-center gap-2">
21:         <Skeleton className="h-8 w-64" />
22:         <Skeleton className="h-4 w-96" />
23:       </div>
24:       <div className="grid gap-6 md:grid-cols-3">
25:         <Skeleton className="h-48" />
26:         <Skeleton className="h-48" />
27:         <Skeleton className="h-48" />
28:       </div>
29:     </div>
30:   );
31: }

(End of file - total 31 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/shared/ui/error-state.tsx"
}
```

**Output:**
```
<path>/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/shared/ui/error-state.tsx</path>
<type>file</type>
<content>
1: import { Button } from '@/components/ui/button';
2: import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
3: 
4: interface ErrorStateProps {
5:   message?: string;
6:   code?: string;
7:   onRetry?: () => void;
8: }
9: 
10: const errorMessages: Record<string, string> = {
11:   UNAUTHORIZED: 'Sesion expirada. Por favor inicia sesion nuevamente.',
12:   VALIDATION_ERROR: 'Algunos campos tienen errores. Revisalos e intenta de nuevo.',
13:   FORBIDDEN: 'No tienes permisos para realizar esta accion.',
14:   NOT_FOUND: 'El recurso solicitado no existe.',
15:   CONFLICT: 'Ya existe un registro con esos datos.',
16: };
17: 
18: function getErrorMessage(code: string | undefined, fallback?: string): string {
19:   if (code && errorMessages[code]) return errorMessages[code];
20:   if (fallback) return fallback;
21:   return 'Ocurrio un error inesperado. Intenta de nuevo mas tarde.';
22: }
23: 
24: export function ErrorState({ message, code, onRetry }: ErrorStateProps) {
25:   return (
26:     <div className="flex items-center justify-center py-20">
27:       <Empty>
28:         <EmptyHeader>
29:           <EmptyTitle>Error al cargar el contenido</EmptyTitle>
30:           <EmptyDescription>{getErrorMessage(code, message)}</EmptyDescription>
31:         </EmptyHeader>
32:         {onRetry && <Button onClick={onRetry}>Reintentar</Button>}
33:       </Empty>
34:     </div>
35:   );
36: }

(End of file - total 36 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/mnt/extssd/Proyectos/bopacorp/bopacorp-web/package.json"
}
```

**Output:**
```
<path>/mnt/extssd/Proyectos/bopacorp/bopacorp-web/package.json</path>
<type>file</type>
<content>
1: {
2:   "name": "bopacorp-web",
3:   "private": true,
4:   "version": "0.0.0",
5:   "type": "module",
6:   "scripts": {
7:     "dev": "vite",
8:     "build": "tsc -b && vite build",
9:     "check": "biome check --write . && tsc -b --noEmit",
10:     "lint": "biome check .",
11:     "lint:fix": "biome check --write .",
12:     "format": "biome format --write .",
13:     "preview": "vite preview",
14:     "prepare": "husky"
15:   },
16:   "dependencies": {
17:     "@base-ui/react": "^1.5.0",
18:     "@bopacorp/shared": "latest",
19:     "@fontsource-variable/inter": "^5.2.8",
20:     "@tailwindcss/vite": "^4.3.0",
21:     "@tanstack/react-table": "^8.21.3",
22:     "axios": "^1.17.0",
23:     "class-variance-authority": "^0.7.1",
24:     "clsx": "^2.1.1",
25:     "cmdk": "^1.1.1",
26:     "date-fns": "^4.4.0",
27:     "dompurify": "^3.4.8",
28:     "lucide-react": "^1.17.0",
29:     "next-themes": "^0.4.6",
30:     "radix-ui": "^1.4.3",
31:     "react": "^19.2.7",
32:     "react-day-picker": "^10.0.1",
33:     "react-dom": "^19.2.7",
34:     "react-router-dom": "^7.16.0",
35:     "recharts": "^3.8.1",
36:     "shadcn": "^4.10.0",
37:     "sonner": "^2.0.7",
38:     "tailwind-merge": "^3.6.0",
39:     "tailwindcss": "^4.3.0",
40:     "tw-animate-css": "^1.4.0",
41:     "use-debounce": "^10.1.1",
42:     "vaul": "^1.1.2"
43:   },
44:   "devDependencies": {
45:     "@biomejs/biome": "^2.4.16",
46:     "@commitlint/config-conventional": "^21.0.2",
47:     "@types/dompurify": "^3.2.0",
48:     "@types/node": "^24.12.4",
49:     "@types/react": "^19.2.16",
50:     "@types/react-dom": "^19.2.3",
51:     "@vitejs/plugin-react": "^6.0.2",
52:     "commitlint": "^21.0.2",
53:     "husky": "^9.1.7",
54:     "lint-staged": "^16.4.0",
55:     "typescript": "~6.0.3",
56:     "vite": "^8.0.16"
57:   },
58:   "lint-staged": {
59:     "*.{ts,tsx,js,jsx}": [
60:       "biome check --write --no-errors-on-unmatched"
61:     ]
62:   }
63: }

(End of file - total 63 lines)
</content>
```

---

## Assistant (Plan · Kimi K2.6 · 5.2s)

_Thinking:_

Now I have a clear picture of the codebase. Let me also check if there's an App.tsx to see the routing, and check the tsconfig for path aliases, to make sure my plan is complete.

Key findings:
1. No `@tanstack/react-query` in package.json. They have `@tanstack/react-table` but not react-query.
2. `useCmsLanding` is a manual useState/useEffect hook with no caching.
3. `Skeleton` component exists in shadcn.
4. `PageLoader` exists but is a generic spinner/skeleton.
5. `ErrorState` exists.
6. `main.tsx` has providers: StrictMode, TooltipProvider, AuthProvider.
7. API uses axios with a custom `request<T>` helper.
8. LandingPage.tsx uses fallback values if blocks is null.

The user wants an exhaustive plan for Option 3: Stale-While-Revalidate hybrid caching with persistence between sessions.

My plan should cover:
1. Architecture overview
2. Library choice: `@tanstack/react-query` + `@tanstack/react-query-persist-client` + `idb-keyval` (or the built-in persister). Actually, for persistent caching, the standard is:
   - `@tanstack/react-query`
   - `@tanstack/react-query-persist-client`
   - `idb-keyval` as storage (IndexedDB wrapper)
   OR we can implement a custom lightweight solution without TanStack Query to avoid adding dependencies. But the user asked for Option 3 which implies TanStack Query-like behavior. However, given the existing codebase is quite lightweight and they might not want heavy deps, I should present both approaches:
   a) **TanStack Query + PersistClient** (industry standard, more code to wire up, but robust)
   b) **Custom lightweight IndexedDB hook** (zero new dependencies, full control, easier for a single endpoint)

Wait, the user said "Planifica exahustivamente la opcion 3". So I need to be exhaustive about the SWR hybrid with persistent caching. I'll plan for TanStack Query as it's the de facto standard, but also note that a custom solution is possible.

Actually, looking at the codebase style (function size ≤10 lines, noUnusedLocals, etc.), TanStack Query might actually be more ergonomic because it handles cancellation, deduping, background refetch, etc. out of the box.

Let me also check the `src/App.tsx` to see how routes are set up.

**Tool: read**

**Input:**
```json
{
  "filePath": "/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/App.tsx"
}
```

**Output:**
```
<path>/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/App.tsx</path>
<type>file</type>
<content>
1: import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
2: import MainLayout from '@/app/MainLayout.js';
3: import AdminApp from '@/modules/admin/AdminApp.js';
4: import RequireAuth from '@/modules/auth/components/RequireAuth.js';
5: import LoginPage from '@/modules/auth/pages/LoginPage.js';
6: import AboutPage from '@/modules/landing/pages/AboutPage';
7: import JobsPage from '@/modules/landing/pages/JobsPage';
8: import LandingPage from '@/modules/landing/pages/LandingPage';
9: import ServicesPage from '@/modules/landing/pages/ServicesPage';
10: 
11: export default function App() {
12:   return (
13:     <BrowserRouter>
14:       <Routes>
15:         <Route element={<MainLayout />}>
16:           <Route path="/" element={<LandingPage />} />
17:           <Route path="/services" element={<ServicesPage />} />
18:           <Route path="/about" element={<AboutPage />} />
19:           <Route path="/jobs" element={<JobsPage />} />
20:         </Route>
21: 
22:         <Route path="/login" element={<LoginPage />} />
23: 
24:         <Route
25:           path="/admin/*"
26:           element={
27:             <RequireAuth>
28:               <AdminApp />
29:             </RequireAuth>
30:           }
31:         />
32: 
33:         <Route path="*" element={<Navigate to="/" replace />} />
34:       </Routes>
35:     </BrowserRouter>
36:   );
37: }

(End of file - total 37 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/pages/LandingPage.tsx"
}
```

**Output:**
```
<path>/mnt/extssd/Proyectos/bopacorp/bopacorp-web/src/modules/landing/pages/LandingPage.tsx</path>
<type>file</type>
<content>
1: import { ArrowRight, Globe, MessageCircle, Smartphone, Wifi } from 'lucide-react';
2: import { Link } from 'react-router-dom';
3: import bannerImg from '@/assets/banner.jpg';
4: import teamImg from '@/assets/team.jpg';
5: import { Button } from '@/components/ui/button';
6: import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
7: import { useCmsLanding } from '../hooks/use-cms-landing.js';
8: 
9: const SERVICES = [
10:   {
11:     id: 'connectivity-enterprise',
12:     title: 'Conectividad Empresarial',
13:     icon: Wifi,
14:     desc: 'Soluciones de internet satelital, enlaces dedicados y fibra óptica de alta velocidad para asegurar tu operación continua.',
15:   },
16:   {
17:     id: 'corporate-plans',
18:     title: 'Planes Corporativos',
19:     icon: Smartphone,
20:     desc: 'Telefonía móvil, flotas comerciales y comunicación de voz fija adaptada a la estructura y presupuesto de tu negocio.',
21:   },
22:   {
23:     id: 'digital-services',
24:     title: 'Servicios Digitales',
25:     icon: Globe,
26:     desc: 'Estructura cloud con Huawei Cloud, Microsoft 365, ciberseguridad corporativa avanzada y sistemas de rastreo satelital.',
27:   },
28: ];
29: 
30: type Blocks = Record<string, { body: string }> | null;
31: 
32: function resolveCms(blocks: Blocks) {
33:   return (key: string, fallback: string) => blocks?.[key]?.body ?? fallback;
34: }
35: 
36: function splitAtHighlight(text: string, highlight: string): [string, string] {
37:   const idx = text.indexOf(highlight);
38:   if (idx === -1) return [text, ''];
39:   return [text.slice(0, idx), text.slice(idx + highlight.length)];
40: }
41: 
42: function getCmsContent(blocks: Blocks) {
43:   const r = resolveCms(blocks);
44:   return { hero: getHeroCms(r), about: getAboutCms(r), cta: getCtaCms(r) };
45: }
46: 
47: function buildFeature(r: ReturnType<typeof resolveCms>, n: number) {
48:   return {
49:     title: r(`about.feature_${n}_title`, ''),
50:     desc: r(`about.feature_${n}_desc`, ''),
51:   };
52: }
53: 
54: function getHeroCms(r: ReturnType<typeof resolveCms>) {
55:   const title = r('hero.title', 'Conectividad que impulsa tu empresa');
56:   const highlight = r('hero.highlight', 'impulsa');
57:   return {
58:     title,
59:     highlight,
60:     titleParts: splitAtHighlight(title, highlight),
61:     description: r(
62:       'hero.description',
63:       'Conectamos tu negocio con tecnología de punta. Planes corporativos, conectividad de alta velocidad y servicios digitales diseñados para impulsar tu empresa.',
64:     ),
65:     ctaPrimaryLabel: r('hero.cta_primary_label', 'Ver catálogo de servicios'),
66:     ctaSecondaryLabel: r('hero.cta_secondary_label', 'Conoce más'),
67:   };
68: }
69: 
70: function getAboutCms(r: ReturnType<typeof resolveCms>) {
71:   return {
72:     eyebrow: r('about.eyebrow', 'Por qué Bopacorp'),
73:     title: r('about.title', 'Más que un proveedor, un aliado tecnológico'),
74:     description: r(
75:       'about.description',
76:       'Como Partner de una de las empresas de telecomunicaciones más grandes de Ecuador, en Bohorquez & Pauta Corp (Bopacorp S.A.) innovamos desde nuestra matriz en Guayaquil para brindar soluciones integradas de conectividad, equipos informáticos y tecnología celular a nivel nacional.',
77:     ),
78:     features: [buildFeature(r, 1), buildFeature(r, 2), buildFeature(r, 3)],
79:   };
80: }
81: 
82: function getCtaCms(r: ReturnType<typeof resolveCms>) {
83:   const title = r('cta.title', 'Impulsa tu negocio con conectividad real');
84:   const highlight = r('cta.highlight', 'conectividad real');
85:   return {
86:     title,
87:     highlight,
88:     titleParts: splitAtHighlight(title, highlight),
89:     eyebrow: r('cta.eyebrow', '¿Listo para conectar tu empresa?'),
90:     description: r(
91:       'cta.description',
92:       'Habla con uno de nuestros asesores y encuentra el plan corporativo ideal para tu empresa. Sin compromisos.',
93:     ),
94:     primaryLabel: r('cta.primary_label', 'Cotizar Ahora'),
95:     secondaryLabel: r('cta.secondary_label', 'Ver Planes'),
96:   };
97: }
98: 
99: export default function LandingPage() {
100:   const { blocks } = useCmsLanding();
101:   const { hero, about, cta } = getCmsContent(blocks);
102:   return (
103:     <div className="w-full bg-background flex flex-col">
104:       <div className="w-full border-b border-border text-white relative overflow-hidden bg-hero">
105:         <img
106:           src={bannerImg}
107:           alt="Network Background"
108:           className="absolute inset-0 size-full object-cover opacity-25 pointer-events-none z-0"
109:         />
110: 
111:         <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center gap-10 relative z-10">
112:           <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
113:             <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.15]">
114:               {hero.titleParts[0]}
115:               <span className="text-primary">{hero.highlight}</span>
116:               {hero.titleParts[1]}
117:             </h1>
118:             <p className="text-lg text-white/80 leading-relaxed max-w-2xl font-normal">
119:               {hero.description}
120:             </p>
121: 
122:             <div className="flex flex-wrap justify-center gap-4 pt-2">
123:               <Button
124:                 asChild
125:                 size="lg"
126:                 className="rounded-md font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 border-none cursor-pointer"
127:               >
128:                 <Link to="/services">
129:                   {hero.ctaPrimaryLabel}
130:                   <ArrowRight className="ml-2 size-4" />
131:                 </Link>
132:               </Button>
133:               <Button
134:                 asChild
135:                 size="lg"
136:                 variant="outline"
137:                 className="bg-transparent border-white text-white hover:bg-white/10 rounded-md transition-colors font-medium cursor-pointer"
138:               >
139:                 <Link to="/about">{hero.ctaSecondaryLabel}</Link>
140:               </Button>
141:             </div>
142:           </div>
143:         </section>
144: 
145:         <div className="w-full border-t border-white/10 bg-black/20 backdrop-blur-sm py-8 relative z-10">
146:           <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
147:             <div className="flex flex-col items-center text-center">
148:               <span className="text-2xl md:text-3xl font-semibold text-white">+200</span>
149:               <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
150:                 empresas conectadas
151:               </span>
152:             </div>
153:             <div className="flex flex-col items-center text-center border-l border-white/10 pl-6 max-md:border-l-0 max-md:pl-0">
154:               <span className="text-2xl md:text-3xl font-semibold text-white">99.9%</span>
155:               <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
156:                 uptime garantizado
157:               </span>
158:             </div>
159:             <div className="flex flex-col items-center text-center border-l border-white/10 pl-6">
160:               <span className="text-2xl md:text-3xl font-semibold text-white">7 años</span>
161:               <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
162:                 de trayectoria
163:               </span>
164:             </div>
165:             <div className="flex flex-col items-center text-center border-l border-white/10 pl-6 max-md:border-l-0 max-md:pl-0">
166:               <span className="text-2xl md:text-3xl font-semibold text-white">+36%</span>
167:               <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
168:                 crecimiento neto
169:               </span>
170:             </div>
171:           </div>
172:         </div>
173:       </div>
174: 
175:       <section className="w-full bg-muted/30 py-20 px-6 border-b border-border/50">
176:         <div className="max-w-7xl mx-auto flex flex-col gap-12">
177:           <div className="flex flex-col items-center text-center gap-2">
178:             <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
179:               Lo que hacemos por tu empresa
180:             </h2>
181:             <p className="text-base text-muted-foreground max-w-2xl font-normal">
182:               Soluciones integradas de telecomunicaciones para empresas que necesitan fiabilidad,
183:               velocidad y soporte 24/7.
184:             </p>
185:           </div>
186: 
187:           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
188:             {SERVICES.map((item) => (
189:               <Card
190:                 key={item.id}
191:                 className="border border-border/60 rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-start text-left w-full"
192:               >
193:                 <CardHeader className="gap-3 p-0 flex flex-col items-start w-full">
194:                   <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
195:                     <item.icon className="size-6" />
196:                   </div>
197:                   <CardTitle className="text-xl font-semibold text-card-foreground tracking-tight w-full">
198:                     {item.title}
199:                   </CardTitle>
200:                   <CardDescription className="text-sm leading-relaxed font-normal w-full">
201:                     {item.desc}
202:                   </CardDescription>
203:                 </CardHeader>
204:               </Card>
205:             ))}
206:           </div>
207:         </div>
208:       </section>
209: 
210:       <section className="w-full bg-accent/30 py-24 px-6 border-b border-border/50">
211:         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center justify-items-center">
212:           <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
213:             <div className="flex flex-col gap-2">
214:               <span className="text-xs font-semibold text-primary tracking-widest uppercase">
215:                 {about.eyebrow}
216:               </span>
217:               <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl leading-tight">
218:                 {about.title}
219:               </h2>
220:             </div>
221:             <p className="text-base text-muted-foreground leading-relaxed font-normal">
222:               {about.description}
223:             </p>
224:             <div className="flex flex-col gap-6 mt-4">
225:               <div className="flex gap-4 items-start">
226:                 <span className="text-xl font-semibold text-primary/40 bg-primary/5 size-8 rounded-lg flex items-center justify-center shrink-0">
227:                   01
228:                 </span>
229:                 <div>
230:                   <h4 className="text-base font-semibold text-foreground">
231:                     {about.features[0].title}
232:                   </h4>
233:                   <p className="text-sm text-muted-foreground mt-1 font-normal">
234:                     {about.features[0].desc}
235:                   </p>
236:                 </div>
237:               </div>
238:               <div className="flex gap-4 items-start">
239:                 <span className="text-xl font-semibold text-primary/40 bg-primary/5 size-8 rounded-lg flex items-center justify-center shrink-0">
240:                   02
241:                 </span>
242:                 <div>
243:                   <h4 className="text-base font-semibold text-foreground">
244:                     {about.features[1].title}
245:                   </h4>
246:                   <p className="text-sm text-muted-foreground mt-1 font-normal">
247:                     {about.features[1].desc}
248:                   </p>
249:                 </div>
250:               </div>
251:               <div className="flex gap-4 items-start">
252:                 <span className="text-xl font-semibold text-primary/40 bg-primary/5 size-8 rounded-lg flex items-center justify-center shrink-0">
253:                   03
254:                 </span>
255:                 <div>
256:                   <h4 className="text-base font-semibold text-foreground">
257:                     {about.features[2].title}
258:                   </h4>
259:                   <p className="text-sm text-muted-foreground mt-1 font-normal">
260:                     {about.features[2].desc}
261:                   </p>
262:                 </div>
263:               </div>
264:             </div>
265:           </div>
266:           <div className="lg:col-span-5 w-full flex flex-col items-center justify-center self-stretch overflow-hidden rounded-2xl shadow-md border border-border/30 bg-card transition-shadow hover:shadow-lg">
267:             <img
268:               src={teamImg}
269:               alt="Bopacorp Team"
270:               className="size-full object-cover aspect-[5/6]"
271:             />
272:           </div>
273:         </div>
274:       </section>
275: 
276:       <section className="w-full text-white relative overflow-hidden py-24 px-6 bg-gradient-to-r from-hero via-hero-mid to-primary">
277:         <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
278:           <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-xs font-normal text-white/90 tracking-wider uppercase">
279:             {cta.eyebrow}
280:           </div>
281:           <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
282:             {cta.titleParts[0]}
283:             <br className="hidden sm:block" /> <span className="text-primary">{cta.highlight}</span>
284:             {cta.titleParts[1]}
285:           </h2>
286:           <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto font-normal">
287:             {cta.description}
288:           </p>
289:           <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2 w-full">
290:             <Button
291:               size="lg"
292:               variant="secondary"
293:               className="rounded-md font-medium px-8 w-full sm:w-auto"
294:             >
295:               <MessageCircle className="mr-2 size-4" />
296:               {cta.primaryLabel}
297:             </Button>
298:             <Button
299:               size="lg"
300:               variant="outline"
301:               className="bg-transparent border-white text-white hover:bg-white/10 rounded-md font-medium px-8 w-full sm:w-auto"
302:             >
303:               {cta.secondaryLabel}
304:             </Button>
305:           </div>
306:         </div>
307:       </section>
308:     </div>
309:   );
310: }

(End of file - total 310 lines)
</content>
```

---

## Assistant (Plan · Kimi K2.6 · 68.2s)

_Thinking:_

I now have all the information needed to create an exhaustive plan for Option 3 (Stale-While-Revalidate with persistent caching between sessions).

Key constraints from AGENTS.md:
- Function size ≤ 10 lines
- noUnusedLocals: true, noUnusedParameters: true
- verbatimModuleSyntax: true — use `import type { … }` for type-only imports
- `.js` extensions in imports
- Semantic tokens only, no `dark:` overrides, gap-* not space-y-*, size-* not w-X h-X
- Conditional classes through `cn()`
- UI copy in Spanish

Plan structure:
1. Overview & Goals
2. Architecture & Data Flow
3. Dependencies to install
4. New/Modified Files (detailed)
5. Migration Steps for LandingPage.tsx
6. Error Handling & Edge Cases
7. Skeleton Design
8. Testing Strategy
9. Rollback Plan

Let me think about the implementation approach.

**Approach: TanStack Query v5 + idb-keyval**
- Install `@tanstack/react-query`, `@tanstack/react-query-persist-client`, `idb-keyval`
- Create `src/lib/query-client.ts` with QueryClient and persister
- Wrap app with `PersistQueryClientProvider` in `main.tsx`
- Replace `useCmsLanding` with `useQuery` + `queryKey: ['cms', 'landing']`
- Configure `staleTime: 5 * 60 * 1000` (5 min) and `gcTime: 24 * 60 * 60 * 1000` (24h)
- Configure persister with `maxAge: 7 * 24 * 60 * 60 * 1000` (7 days) and `idbKeyVal` storage
- Modify `LandingPage.tsx` to use `isLoading` / `isFetching` states properly

Wait, but if we use TanStack Query, the first visit would show skeleton until data loads. Subsequent visits show cached data instantly. But what if the cache is stale? TanStack Query by default shows stale data immediately and refetches in background. This is exactly the SWR pattern.

For the skeleton on first visit, I need to design a `LandingPageSkeleton` component that matches the structure of LandingPage.tsx. The existing `PageLoader` is too generic.

But wait - the user asked "la pagina espera mientras se responde?" - meaning "should the page wait while it responds?" And we discussed Option 3 as the Stale-While-Revalidate. So for the first visit: yes, it should wait (show skeleton). For subsequent visits: show cached immediately, refresh in background.

Actually, with TanStack Query + persist, even the first visit could potentially show cached data if it exists. But if it's truly the first visit ever, there's no cache, so it shows skeleton.

One concern: `id-keyval` adds a dependency. We could also use the built-in `createSyncStoragePersister` with `localStorage`, but localStorage has ~5MB limit and is blocking. For a landing page CMS, localStorage is probably fine, but `idb-keyval` is better for larger payloads and non-blocking.

Actually, `@tanstack/react-query-persist-client` can work with `createAsyncStoragePersister` which can be backed by any async storage. `idb-keyval` is the common choice.

Let me think about the exact file structure:

**New files:**
- `src/lib/query-client.ts` — QueryClient instance + persister setup
- `src/modules/landing/components/landing-skeleton.tsx` — Skeleton matching landing layout
- `src/modules/landing/hooks/use-cms-landing.ts` — Refactored to use `useQuery`
- `src/modules/landing/hooks/use-cms-landing-content.ts` — (Optional) Keep the CMS resolution logic separate

**Modified files:**
- `src/main.tsx` — Wrap with `PersistQueryClientProvider`
- `src/modules/landing/pages/LandingPage.tsx` — Use new hook and skeleton states
- `package.json` — Add dependencies

Wait, `useCmsLanding` currently returns `{ blocks, loading, error, retry }`. With TanStack Query, it should return whatever `useQuery` returns, but wrapped for the module's needs.

I should also think about whether to keep the fallback logic. With persistent caching, fallbacks become less important because we almost always have *some* cached data. But for the very first visit before API resolves, we still need skeleton. After the first successful load, the cache persists.

Actually, should we keep the hardcoded fallbacks as a "last resort" if cache is empty AND API fails? That might be useful. But the user seemed to imply they want to move away from hardcoded text. Let's plan to remove fallbacks from the page flow, but we could keep them as an error state fallback (show cached data if available, otherwise show error, never show hardcoded). The user asked about hardcoded text earlier, so the plan should aim to eliminate reliance on it.

Let me design the skeleton carefully. The landing page has:
1. Hero section (banner bg, centered text, 2 buttons, stats bar below)
2. Services section (3 cards)
3. About section (text left, image right)
4. CTA section (gradient bg, centered text, 2 buttons)

The skeleton should mirror this structure to avoid layout shifts.

For the stats in the hero (+200, 99.9%, etc.) - these are currently hardcoded and not in CMS. The plan should address whether to also move these to CMS. I'll include it as an optional step.

Also, the `SERVICES` array is hardcoded. The plan should note that if we want services from CMS too, we'd need a different endpoint or more blocks. I'll note this as a separate concern.

Let me draft the plan sections:

### 1. Resumen Ejecutivo
Option 3 = Stale-While-Revalidate (SWR) con persistencia entre sesiones vía IndexedDB. Primera visita: skeleton → API → cache. Visitas posteriores: cache instantáneo → revalidación silenciosa.

### 2. Arquitectura y Flujo de Datos
```
Primera vez (sin cache):
Usuario navega a / → LandingPage monta → useQuery('cms/landing') → cache miss → isLoading=true
→ Renderiza <LandingSkeleton /> → Fetch GET /cms/landing → Éxito → Guarda en TanStack Query cache
→ Persiste en IndexedDB via PersistQueryClientProvider → Renderiza contenido real

Visitas posteriores:
Usuario navega a / → useQuery('cms/landing') → cache HIT en IndexedDB → isLoading=false (datos stale disponibles)
→ Renderiza inmediatamente con cache → TanStack Query hace refetch silencioso en background
→ Si hay cambios: UI se actualiza suavemente. Si no hay cambios: usuario no nota nada.
```

### 3. Dependencias
`npm install @tanstack/react-query @tanstack/react-query-persist-client idb-keyval`

### 4. Archivos Nuevos y Modificados

**Nuevos:**
- `src/lib/query-client.ts`
- `src/modules/landing/components/landing-skeleton.tsx`

**Modificados:**
- `package.json`
- `src/main.tsx`
- `src/modules/landing/hooks/use-cms-landing.ts`
- `src/modules/landing/pages/LandingPage.tsx`

### 5. Detalle de Implementación por Archivo

**`src/lib/query-client.ts`**
- Importar `QueryClient`, `PersistQueryClientProvider`, `createAsyncStoragePersister`
- Importar `get`, `set`, `del` from `idb-keyval`
- Configurar `QueryClient` con `defaultOptions: { queries: { staleTime: 5 * 60 * 1000, gcTime: 24 * 60 * 60 * 1000, refetchOnWindowFocus: false } }`
- Crear persister con `createAsyncStoragePersister({ storage: { getItem, setItem, removeItem } })` backed by idb-keyval
- Exportar `queryClient` and `persister`

**`src/main.tsx`**
- Importar `PersistQueryClientProvider`
- Wrap `<AuthProvider>` inside `<PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: 7 * 24 * 60 * 60 * 1000 }}>`
- Ensure `App` remains inside.

**`src/modules/landing/hooks/use-cms-landing.ts`**
- Remove all manual useState/useEffect logic
- Use `useQuery` with `queryKey: ['cms', 'landing']`
- Use `queryFn` that calls `request<CmsLandingResponse>({ method: 'GET', url: '/cms/landing' })`
- Return `{ blocks: data?.blocks ?? null, isLoading, isFetching, isError, error, retry: refetch }`

**`src/modules/landing/components/landing-skeleton.tsx`**
- Mirror the exact layout structure of LandingPage
- Use `Skeleton` from `@/components/ui/skeleton`
- Sections: HeroSkeleton, StatsSkeleton, ServicesSkeleton, AboutSkeleton, CtaSkeleton
- Combine into `LandingPageSkeleton`
- Must match spacing, max-widths, and grid layouts to prevent CLS

**`src/modules/landing/pages/LandingPage.tsx`**
- Import `useCmsLanding` from new hook
- Import `LandingPageSkeleton`
- Use `isLoading` to determine if skeleton should show
- Use `isFetching` to optionally show a subtle "updating" indicator (optional)
- Remove hardcoded fallback logic from `getHeroCms`, `getAboutCms`, etc. OR keep them as a last-resort error fallback
- The decision: if cache exists, always show it. If no cache and loading, show skeleton. If error and no cache, show error state.

Wait, I need to think about the exact rendering states with TanStack Query + persistence:

State matrix:
- `isLoading`: true when no cached data and fetching. Show skeleton.
- `isFetching`: true when fetching (even with cached data). Can show a subtle indicator or nothing.
- `data`: cached data (possibly stale).
- `error`: fetch error.

So the logic in LandingPage should be:
```tsx
const { blocks, isLoading, isError, error, retry } = useCmsLanding();

if (isLoading) return <LandingPageSkeleton />;
if (isError && !blocks) return <ErrorState message={error?.message} onRetry={retry} />;
// If we have blocks (from cache or fresh), render content
const { hero, about, cta } = getCmsContent(blocks);
return <...content...>;
```

This means if there's an error BUT we have stale cached data, we still show the content (maybe with a subtle toast). This is the SWR pattern.

But what about the fallback values? Currently `getHeroCms` etc. use hardcoded fallbacks. If we want to eliminate hardcoded text entirely, we should change the logic so that if `blocks` is null/empty, we don't render that section or show a placeholder. But the user seemed to want to keep the page functional even without CMS. Hmm.

Actually, looking back at the conversation, the user asked: "la pagina de landing esta jalando los datos desde el api o el texto aun esta hardcodeado?" They were concerned about hardcoded text. Then they asked about caching. And then "que tal si la pagina espera mientras se responde?"

So the plan should:
1. Move ALL text to come from CMS (or at least the sections that are currently dynamic: hero, about, cta)
2. For first-time users, show skeleton while loading
3. For returning users, show cached content instantly
4. The hardcoded fallbacks in `getHeroCms`, etc. should probably be removed OR kept only as an absolute last resort. I'll recommend removing them because with persistent cache, the only time we'd have no data is the very first visit, and a skeleton is acceptable there.

But wait, what about SERVICES and STATS? Those are still hardcoded. The plan should explicitly address them. I'll add a note that either:
- Option A: Also move SERVICES and STATS to CMS blocks (requires backend support)
- Option B: Keep them hardcoded for now as they are marketing constants
- Option C: Create a separate `useCmsServices` hook if backend exposes them

I'll recommend Option A as the cleanest but note it depends on backend changes.

### 6. Manejo de Errores y Edge Cases
- **API caído + sin cache**: Show `<ErrorState />` with retry button. No fallbacks.
- **API caído + con cache stale**: Show content from cache. Optionally show a toast "Contenido puede estar desactualizado" (via sonner).
- **Cache corrupto/inválido**: idb-keyval returns null, TanStack Query treats as cache miss.
- **Incognito mode / IndexedDB bloqueado**: Degrade gracefully to in-memory only (TanStack Query default).
- **Tamaño de payload**: CMS landing data is small text (<100KB), well within limits.
- **Race conditions on logout**: `queryClient.clear()` on logout to prevent leaking cached landing data to next user? Actually landing is public, so no PII. But good practice anyway.

### 7. Diseño del Skeleton
The skeleton must prevent CLS (Cumulative Layout Shift). It should use the exact same CSS classes and structure as the real content, just with `Skeleton` components replacing text.

I need to detail the skeleton sections:
- **Hero**: Full-width div with `bg-hero`, skeleton for h1 (w-3/4 h-12), skeleton for p (w-2/3 h-6), skeleton for buttons (w-48 h-10 x2)
- **Stats bar**: 4 columns, skeleton for number (w-16 h-8) and label (w-24 h-4)
- **Services**: h2 skeleton (w-64 h-8), p skeleton (w-96 h-5), 3 card skeletons with icon placeholder, title, desc
- **About**: Left side: eyebrow, title, desc, 3 features with number placeholders. Right side: image placeholder (aspect-[5/6])
- **CTA**: Gradient bg, centered skeletons for eyebrow, title, desc, buttons

### 8. Estrategia de Migración y Rollback
- Step 1: Install dependencies
- Step 2: Create `query-client.ts` and wire in `main.tsx`
- Step 3: Create `landing-skeleton.tsx`
- Step 4: Refactor `use-cms-landing.ts`
- Step 5: Update `LandingPage.tsx`
- Step 6: Test: First visit (clear site data), returning visit, error simulation
- Rollback: Revert commits. The old hook can be kept as `use-cms-landing-legacy.ts` during migration.

### 9. Performance & SEO Considerations
- FCP (First Contentful Paint): On return visits, instant because cache is synchronous from IndexedDB (actually async, but very fast).
- CLS: Skeleton prevents layout shift by matching final layout.
- SEO: Landing is public. Googlebot will see skeleton on first crawl, but with proper caching headers (from previous discussion), subsequent crawls get cached content. The skeleton should be server-renderable if SSR is ever added.

Wait, one important thing about `PersistQueryClientProvider`: the restoration from IndexedDB is asynchronous. On first app mount, the provider might not have restored the cache yet when `LandingPage` renders. This means `useQuery` might briefly show `isLoading: true` even if IndexedDB has data, because the cache hasn't been hydrated into memory yet.

To handle this, `PersistQueryClientProvider` has an `onSuccess` callback, but components inside will render before hydration is complete. However, TanStack Query v5 handles this: queries with `persisted` data will be in a `status: 'success'` state immediately after hydration if the data was restored. But there's a brief moment during restoration.

Actually, looking at TanStack Query docs: the provider rehydrates the cache before rendering children? No, it uses React state for hydration status. The children render, but queries that have persisted data will be initialized with that data. So the user should see instant content.

Let me verify: `PersistQueryClientProvider` in v5 takes a `persistOptions` and renders children immediately. The queries will read from the restored cache as soon as it's available. If a query is mounted before restoration completes, it might fetch. But typically restoration is very fast (<50ms).

To be safe, we can set `staleTime` to Infinity during restoration and then let it refetch. But that's overkill. For a landing page, even if one extra request happens, it's fine.

### 10. TypeScript & Code Quality Compliance
- Function size ≤ 10 lines: The new hook will be ~8 lines. The skeleton component will need to be composed of small sub-components.
- `.js` extensions in imports.
- `import type` for type-only imports.
- `cn()` for conditional classes.

Let me also check if `react-query` has any peer dependencies issues with React 19. TanStack Query v5 supports React 19.

Now, regarding the existing `PageLoader` and `ErrorState`:
- `PageLoader` is generic and not specific to landing. We should create a specific `LandingPageSkeleton` because the layout is very specific. We can reuse `Skeleton` primitive.
- `ErrorState` can be reused for API errors.

One more thing: Should we also plan for invalidating the cache when an admin updates the CMS? With the current setup, the cache will live up to `gcTime` (24h) and `maxAge` (7 days). If an admin changes the landing content, returning users won't see it until the cache expires or is manually invalidated. 

Options:
1. **Time-based expiration**: Accept that changes take up to 5 minutes (`staleTime`) to propagate to active users, and up to 24h for inactive users. This is simplest.
2. **Version-based invalidation**: Backend returns a `version` or `updatedAt` in the response. The frontend compares and invalidates if changed. But TanStack Query already does this via `staleTime` + refetch.
3. **Manual invalidation via admin panel**: If the admin panel is in the same React app, it could call `queryClient.invalidateQueries({ queryKey: ['cms', 'landing'] })` after saving. This is elegant but requires the admin to be in the same SPA domain.

I'll include this as a consideration in the plan.

### Final Plan Structure

I'll present the plan in Spanish since the user communicates in Spanish and the UI is Spanish.

Plan sections:
1. **Resumen Ejecutivo** (What is Option 3 in this context)
2. **Arquitectura de Datos** (Diagram of first visit vs returning visit)
3. **Stack Técnico** (Libraries)
4. **Nuevos Archivos** (Detailed specs for each new file)
5. **Archivos Modificados** (Detailed specs for each modified file)
6. **Flujo de Estados de Renderizado** (Matrix: isLoading, isFetching, isError, data)
7. **Diseño del Skeleton** (Detailed section-by-section skeleton design)
8. **Manejo de Errores y Edge Cases**
9. **Consideraciones de Seguridad y Privacidad**
10. **Pasos de Implementación** (Ordered checklist)
11. **Rollback Plan**
12. **Preguntas Pendientes para el Usuario** (To resolve before execution)

I need to make sure I don't make any edits. The user explicitly said "Planifica exahustivamente" and plan mode is active. So I will only present the plan.

Let me refine the skeleton component design. Since function size must be ≤10 lines, I need to break the skeleton into many small components:

```
LandingPageSkeleton
├── HeroSkeleton
│   ├── HeroContentSkeleton
│   └── StatsBarSkeleton
├── ServicesSkeleton
│   ├── ServicesHeaderSkeleton
│   └── ServicesGridSkeleton
│       └── ServiceCardSkeleton (x3)
├── AboutSkeleton
│   ├── AboutContentSkeleton
│   └── AboutImageSkeleton
└── CTASkeleton
```

Each component should be ≤10 lines. This is a bit verbose but follows the project's coding standards.

For the `use-cms-landing.ts` hook, it should be very small:

```ts
import { useQuery } from '@tanstack/react-query';
import { request } from '@/services/api.js';
import type { CmsLandingResponse } from '../types.js'; // or inline

export function useCmsLanding() {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['cms', 'landing'],
    queryFn: fetchCmsLanding,
    staleTime: 5 * 60 * 1000,
  });
  return { blocks: data?.blocks ?? null, isLoading, isFetching, isError, error, retry: refetch };
}

function fetchCmsLanding() {
  return request<CmsLandingResponse>({ method: 'GET', url: '/cms/landing' });
}
```

Wait, `fetchCmsLanding` is 1 line (well, 3 with return type if explicit). That's fine.

But I need to check: does the existing `useCmsLanding` interface need to be preserved? Currently it returns `{ blocks, loading, error, retry }`. With TanStack Query, `isLoading` is more nuanced (no data + fetching). `isFetching` is true even with data. I should map these clearly.

Also, I should define the types in a shared place. Currently `ContentBlockResponse` and `CmsLandingResponse` are in the hook file. It might be cleaner to extract them to `src/modules/landing/types.ts`. But that's optional. I'll include it in the plan as a recommendation.

Let me also consider: the `request` helper throws `ApiError` on non-success responses. TanStack Query will catch this and set `error`. Good.

What about the `SERVICES` array? The user asked about hardcoded text. The plan should explicitly state that with this caching strategy, the hardcoded fallbacks in `getHeroCms`, `getAboutCms`, `getCtaCms` become unnecessary because we always either have cached data or show skeleton/error. We can remove the fallback parameters or keep them as an absolute last resort.

I think the best recommendation is:
- **Remove fallbacks entirely** for CMS-driven sections. If the CMS doesn't have a block, show an empty string or hide that element.
- **Keep SERVICES and STATS hardcoded** (for now) unless backend is updated to provide them.
- **Future step**: Add `services` and `stats` blocks to CMS and fetch them via the same or separate endpoint.

Now let me think about `idb-keyval` vs `localStorage`. `idb-keyval` is 600 bytes, zero-config, and async. It's the right choice.

One more edge case: If the backend changes the shape of the response, old cached data might be incompatible. TanStack Query doesn't automatically validate schema. We should include a `version` in the queryKey or in the persisted data. Simplest: include an app version in the `bust` option of the persister, or manually clear the cache on deployments.

Actually, `createAsyncStoragePersister` supports a `serialize`/`deserialize` where we could add a version, but the simplest approach is to bump the `queryKey` if the schema changes, e.g., `['cms', 'landing', 'v2']`.

I'll add this as a "Cache Invalidation on Breaking Changes" note.

Let me also check if `src/index.css` or tailwind config has any custom utilities I should know about for the skeleton. The `Skeleton` component uses `bg-muted` and `animate-pulse`. That's standard.

Alright, I think I have enough for a truly exhaustive plan. Let me write it out clearly and comprehensively.

Wait, one more thing: the `PersistQueryClientProvider` hydration. To ensure the skeleton doesn't flash unnecessarily on returning visits, we should consider the `isRestoring` state. Actually, `useIsRestoring()` hook from `@tanstack/react-query` tells us if the provider is still restoring from persistence. We could use it to show the skeleton only during restoration + loading. But in practice, restoration from IndexedDB is so fast that it's not needed. I'll mention it as an optional optimization.

Also, `LandingPage.tsx` is 310 lines. The plan should address whether to split it into sub-components. Given the function size rule (≤10 lines), the current `LandingPage` component is way over the limit. However, the user didn't ask me to refactor the page itself, only to add caching. But following the project's conventions, I should note that `LandingPage` should be refactored into smaller components as part of this work or as a prerequisite. Actually, looking at the current `LandingPage`, it's one big function with JSX markup. The AGENTS.md says: "Exception: React component return JSX (pure markup)". So it's allowed to be large if it's pure markup. But the helper functions (`getHeroCms`, etc.) are also in the same file and some are ≤10 lines, but `getCmsContent` is 3 lines, etc. The big function is the render. So it's fine.

But `getHeroCms` etc. should probably be moved to a separate file `src/modules/landing/lib/cms-landing.ts` to keep the page component clean. I'll suggest this in the plan.

Now I'll write the final comprehensive plan.

Aquí tienes el plan exhaustivo para implementar la **Opción 3: Stale-While-Revalidate con persistencia entre sesiones** en la landing page.

---

# Plan: Caché Persistente Híbrido (SWR) para Landing Page

## 1. Resumen Ejecutivo

Reemplazar el hook manual `useCmsLanding` por **TanStack Query v5** con persistencia en **IndexedDB** via `idb-keyval`. Esto logra:

- **Primera visita**: La página muestra un skeleton mientras carga el CMS desde el API. Al recibir la respuesta, se renderiza el contenido real y se guarda en disco.
- **Visitas posteriores**: El contenido se renderiza **instantáneamente** desde IndexedDB. TanStack Query refresca silenciosamente en background. Si hay cambios, la UI se actualiza sin interrupciones. Si no hay cambios, el usuario no nota nada.
- **Entre sesiones**: El caché sobrevive cierres de pestaña, navegador y reinicios de sistema.

Se elimina la dependencia en textos hardcodeados como fallback; la única experiencia posible es: **skeleton → contenido real → caché persistente**.

---

## 2. Arquitectura de Datos

### Flujo: Primera visita (sin caché)
```
Usuario entra a /
  └─ PersistQueryClientProvider (restaura caché: vacío)
      └─ LandingPage monta
          └─ useQuery(['cms', 'landing'])
              ├─ cache miss → isLoading = true
              ├─ renderiza <LandingPageSkeleton />
              └─ fetch GET /cms/landing
                  ├─ éxito → almacena en caché RAM + IndexedDB
                  └─ re-renderiza con contenido real
```

### Flujo: Visita recurrente (con caché)
```
Usuario entra a /
  └─ PersistQueryClientProvider (restaura caché desde IndexedDB: <50ms)
      └─ LandingPage monta
          └─ useQuery(['cms', 'landing'])
              ├─ cache hit (stale) → isLoading = false, isFetching = true
              ├─ renderiza inmediatamente con caché
              └─ refetch silencioso en background
                  ├─ sin cambios → nada
                  └─ con cambios → re-renderiza suavemente
```

### Flujo: Error con caché stale
```
API caído / 500
  └─ useQuery tiene datos stale en caché
      ├─ isError = true, pero data existe
      ├─ renderiza contenido del caché (usuario nunca ve pantalla en blanco)
      └─ (opcional) toast: "Contenido puede estar desactualizado"
```

### Flujo: Error sin caché
```
API caído / 500 + sin caché previo
  └─ isLoading = false, isError = true, data = undefined
      └─ renderiza <ErrorState /> con botón "Reintentar"
```

---

## 3. Stack Técnico

| Librería | Versión | Rol |
|---|---|---|
| `@tanstack/react-query` | ^5.x | Máquina de estado para fetching, caché en RAM, deduplicación, background refetch |
| `@tanstack/react-query-persist-client` | ^5.x | Provider que sincroniza el caché de RAM con almacenamiento persistente |
| `idb-keyval` | ^6.x | Wrapper minúsculo sobre IndexedDB (asíncrono, no bloqueante, sin límite estricto de 5MB) |

> **¿Por qué no `localStorage`?** Es bloqueante (sincrono), comparte espacio con todo el dominio (~5MB), y no maneja bien objetos grandes. IndexedDB es la API de persistencia estructurada del navegador.

---

## 4. Nuevos Archivos

### `src/lib/query-client.ts`
- Instancia global `QueryClient`.
- Configuración `defaultOptions`:
  - `staleTime: 5 * 60 * 1000` (5 min) — tiempo antes de considerar los datos "viejos" y necesitar refetch.
  - `gcTime: 24 * 60 * 60 * 1000` (24h) — tiempo que los datos inactivos viven en RAM.
  - `refetchOnWindowFocus: false` — para la landing pública, evita refetch agresivo al cambiar de pestaña.
- Persister: `createAsyncStoragePersister` usando `idb-keyval`.
- `maxAge: 7 * 24 * 60 * 60 * 1000` (7 días) — datos en IndexedDB más viejos se descartan.
- **Cache busting**: la `queryKey` incluye una versión interna (`['cms', 'landing', 'v1']`) para invalidar automáticamente si el backend cambia el schema de respuesta.

### `src/modules/landing/components/landing-skeleton.tsx`
Skeleton específico que replica **exactamente** el layout de `LandingPage.tsx` para evitar CLS. Usa el componente `Skeleton` de shadcn.

Estructura interna (cada sub-componente ≤10 líneas):
- `HeroSkeleton` — banner oscuro, placeholder de título (w-3/4, h-12), párrafo (w-2/3, h-6), 2 botones (w-48, h-10).
- `StatsBarSkeleton` — 4 columnas, placeholder número (w-16, h-8) + label (w-24, h-4).
- `ServicesSkeleton` — header (h2 w-64, p w-96), grid 3 columnas con tarjetas (icono círculo, título w-48, desc w-full).
- `AboutSkeleton` — layout 12-columnas: izquierda (eyebrow, title, desc, 3 features numeradas), derecha (rectángulo `aspect-[5/6]`).
- `CTASkeleton` — gradiente, eyebrow pill, título grande (w-3/4), párrafo (w-2/3), 2 botones.

### `src/modules/landing/lib/cms-landing.ts` (extracción de lógica)
Mueve las funciones puras de resolución de CMS desde `LandingPage.tsx` para mantener el componente limpio:
- `resolveCms(blocks, key, fallback)` (aunque los fallbacks ya no se usarán en el flujo feliz).
- `getHeroCms(r)`, `getAboutCms(r)`, `getCtaCms(r)`.
- `splitAtHighlight(text, highlight)`.
- `getCmsContent(blocks)`.

Tipos exportados:
- `ContentBlockResponse`, `CmsLandingResponse`, `Blocks`, `LandingContent`.

---

## 5. Archivos Modificados

### `package.json`
Agregar a `dependencies`:
```json
"@tanstack/react-query": "^5.74.0",
"@tanstack/react-query-persist-client": "^5.74.0",
"idb-keyval": "^6.2.1"
```

### `src/main.tsx`
Importar `PersistQueryClientProvider` y envolver la aplicación:

```tsx
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, persister } from '@/lib/query-client.js';

createRoot(rootElement).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 7 * 24 * 60 * 60 * 1000 }}
    >
      <TooltipProvider>
        <AuthProvider>
          <App />
          <Toaster position="bottom-right" richColors closeButton />
        </AuthProvider>
      </TooltipProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
);
```

### `src/modules/landing/hooks/use-cms-landing.ts`
Reemplazar todo el estado manual por `useQuery`:

```ts
import { useQuery } from '@tanstack/react-query';
import { request } from '@/services/api.js';
import type { CmsLandingResponse } from '../lib/cms-landing.js';

function fetchCmsLanding() {
  return request<CmsLandingResponse>({ method: 'GET', url: '/cms/landing' });
}

export function useCmsLanding() {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['cms', 'landing', 'v1'],
    queryFn: fetchCmsLanding,
    staleTime: 5 * 60 * 1000,
  });

  return {
    blocks: data?.blocks ?? null,
    isLoading,
    isFetching,
    isError,
    error,
    retry: refetch,
  };
}
```

> Nota: `isLoading` en TanStack Query v5 significa **"no hay datos Y está fetching"**, que es exactamente lo que necesitamos para decidir entre skeleton y contenido.

### `src/modules/landing/pages/LandingPage.tsx`
Cambios estructurales:

1. **Importar** `LandingPageSkeleton` y el nuevo `useCmsLanding`.
2. **Reemplazar** la lógica de renderizado por el flujo de estados:
   ```tsx
   const { blocks, isLoading, isError, error, retry } = useCmsLanding();

   if (isLoading) return <LandingPageSkeleton />;
   if (isError && !blocks) {
     return <ErrorState message={error?.message} onRetry={retry} />;
   }

   const { hero, about, cta } = getCmsContent(blocks);
   return ( ... contenido actual ... );
   ```
3. **Eliminar** los textos hardcodeados de los fallbacks de `getHeroCms` / `getAboutCms` / `getCtaCms`, o al menos no usarlos en el flujo normal. Si `blocks` existe, usamos lo que viene del CMS. Si no existe, ya se manejó arriba con skeleton/error.
4. **Opcional**: Si `isFetching` es true (refetch en background), agregar un indicador visual sutil en la esquina superior (spinner diminuto) o omitirlo para no distraer.

---

## 6. Matriz de Estados de Renderizado

| Estado | `isLoading` | `isFetching` | `isError` | `blocks` | UI Renderizada |
|---|---|---|---|---|---|
| **Primera carga** | `true` | `true` | `false` | `null` | `LandingPageSkeleton` |
| **Caché stale + refetch** | `false` | `true` | `false` | `Objeto` | Contenido real + indicador sutil (opcional) |
| **Caché + refetch exitoso** | `false` | `false` | `false` | `Objeto` | Contenido real |
| **Caché + refetch fallido** | `false` | `false` | `true` | `Objeto` | Contenido real + toast de advertencia (opcional) |
| **Sin caché + error** | `false` | `false` | `true` | `null` | `ErrorState` con retry |
| **Sin caché + error + retry** | `true` | `true` | `false` | `null` | `LandingPageSkeleton` |

---

## 7. Diseño Detallado del Skeleton

Objetivo: **Cumulative Layout Shift (CLS) = 0**. El skeleton debe ocupar exactamente el mismo espacio que el contenido final.

### Sección Hero
```tsx
<div className="w-full border-b border-border text-white relative overflow-hidden bg-hero py-24 md:py-32">
  <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-10">
    <Skeleton className="h-12 w-3/4 max-w-3xl" />
    <Skeleton className="h-6 w-2/3 max-w-2xl" />
    <div className="flex flex-wrap justify-center gap-4 pt-2">
      <Skeleton className="h-10 w-48 rounded-md" />
      <Skeleton className="h-10 w-40 rounded-md" />
    </div>
  </div>
</div>
```

### Stats Bar
```tsx
<div className="w-full py-8 bg-black/20 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex flex-col items-center text-center gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    ))}
  </div>
</div>
```

### Servicios
```tsx
<section className="w-full bg-muted/30 py-20 px-6">
  <div className="max-w-7xl mx-auto flex flex-col gap-12">
    <div className="flex flex-col items-center text-center gap-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-96" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-border/60 rounded-xl p-6 flex flex-col gap-3">
          <Skeleton className="size-12 rounded-xl" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  </div>
</section>
```

### Sobre Nosotros
Replicar el grid `lg:grid-cols-12` con el texto a la izquierda (7 cols) y la imagen a la derecha (5 cols).

### CTA
Replicar el gradiente con skeletons centrados para eyebrow, título, párrafo y botones.

---

## 8. Manejo de Errores y Edge Cases

| Escenario | Estrategia |
|---|---|
| **API caído, sin caché** | `ErrorState` con mensaje de error y botón "Reintentar". |
| **API caído, con caché stale** | Renderiza caché. Opcional: `toast.info('Contenido cargado desde caché')`. |
| **IndexedDB bloqueado / modo incógnito** | TanStack Query degrada a caché en RAM. No persistencia entre sesiones, pero SWR sigue funcionando dentro de la sesión. |
| **Payload corrupto en IndexedDB** | `idb-keyval` devuelve `undefined`. TanStack Query lo trata como cache miss → skeleton + fetch. |
| **Schema del backend cambia** | La `queryKey` incluye versión (`v1`). Para un breaking change, se cambia a `v2`, invalidando automáticamente todo el caché antiguo. |
| **Usuario hace logout** | Landing es pública, no hay PII. No es necesario limpiar caché. Si en el futuro hay contenido personalizado, llamar `queryClient.clear()` en logout. |
| **Múltiples pestañas abiertas** | TanStack Query no sincroniza caché entre pestañas por defecto, pero cada pestaña restaura desde IndexedDB al montar. BroadcastChannel puede agregarse si se necesita sincronización real-time entre pestañas. |

---

## 9. Consideraciones de Backend (Complementarias)

Aunque el caché persistente es 100% frontend, estos headers del backend mejorarían dramáticamente la experiencia:

```http
Cache-Control: public, max-age=0, must-revalidate
ETag: "<hash-del-contenido>"
```

¿Por qué `max-age=0`? Porque **el frontend ya controla la caché** via IndexedDB. El navegador no necesita duplicar la lógica en su HTTP cache. El `ETag` permite que el backend responda `304 Not Modified` cuando TanStack Query hace el refetch, ahorrando ancho de banda.

---

## 10. Pasos de Implementación (Checklist Ordenada)

1. **Instalar dependencias**:
   ```bash
   npm install @tanstack/react-query @tanstack/react-query-persist-client idb-keyval
   ```

2. **Crear `src/lib/query-client.ts`**:
   - QueryClient con `staleTime`, `gcTime`, `refetchOnWindowFocus`.
   - Persister con `idb-keyval`.
   - Exportar `queryClient` y `persister`.

3. **Modificar `src/main.tsx`**:
   - Importar `PersistQueryClientProvider`.
   - Reemplazar el render tree para incluir el provider alrededor de `AuthProvider`.

4. **Crear `src/modules/landing/lib/cms-landing.ts`**:
   - Extraer tipos (`CmsLandingResponse`, `Blocks`, etc.).
   - Extraer funciones de resolución (`getHeroCms`, `getAboutCms`, etc.).
   - Eliminar los fallbacks hardcodeados o reducirlos a strings vacíos.

5. **Crear `src/modules/landing/components/landing-skeleton.tsx`**:
   - Implementar cada sub-sección como componente independiente (≤10 líneas cada uno).
   - Componer `LandingPageSkeleton`.

6. **Refactorizar `src/modules/landing/hooks/use-cms-landing.ts`**:
   - Reemplazar por `useQuery` con `queryKey: ['cms', 'landing', 'v1']`.

7. **Modificar `src/modules/landing/pages/LandingPage.tsx`**:
   - Importar nuevo hook y skeleton.
   - Agregar lógica de estados (`isLoading`, `isError`).
   - Importar funciones de `cms-landing.ts`.
   - Remover las funciones inline de resolución CMS.
   - Verificar que no queden dependencias de textos hardcodeados en el flujo principal.

8. **Verificar TypeScript y Biome**:
   ```bash
   npm run check
   ```

9. **Pruebas manuales**:
   - **Test A (Primera visita)**: DevTools → Application → Storage → Clear site data. Recargar. Debe verse skeleton → contenido.
   - **Test B (Visita recurrente)**: Recargar normal. Debe verse contenido instantáneo (sin skeleton). En Network debe aparecer el fetch a `/cms/landing` en background.
   - **Test C (Offline con caché)**: DevTools → Network → Offline. Recargar. Debe verse el contenido del caché.
   - **Test D (Offline sin caché)**: Clear site data + Offline. Debe verse `ErrorState`.
   - **Test E (Error 500)**: Usar DevTools para throttle/override a 500. Con caché previo, debe mostrar contenido + error sutil.

---

## 11. Plan de Rollback

Cada paso es reversible de forma independiente:

- **Paso 1**: Desinstalar paquetes (`npm uninstall ...`).
- **Paso 2-5**: Eliminar archivos nuevos.
- **Paso 6**: Restaurar `use-cms-landing.ts` original (se puede dejar como `use-cms-landing.legacy.ts` durante la migración).
- **Paso 7**: Revertir `LandingPage.tsx` al commit anterior.

El único punto de no retorno sería si el backend cambia el formato de respuesta basándose en la nueva arquitectura, pero este plan **no toca el backend**.

---

## 12. Preguntas Pendientes para Ti

Antes de ejecutar, necesito que me confirmes:

1. **¿Los textos hardcodeados actuales (hero, about, cta) son placeholders o son los reales de Bopacorp?**  
   Esto define si los eliminamos por completo o los dejamos como fallback absoluto de emergencia.

2. **¿Quieres que el skeleton muestre también las secciones de `SERVICES` y `STATS` (que hoy están hardcodeadas)?**  
   Es decir, ¿el skeleton cubre la página completa o solo las partes que vienen del CMS?

3. **¿Quieres que los `SERVICES` y `STATS` también migren al CMS en este mismo PR, o eso es trabajo futuro del backend?**

4. **¿Con qué frecuencia cambia el contenido de la landing?**  
   Si es diario, ajusto `staleTime` a 1 min. Si es semanal, lo dejo en 5-10 min.

5. **¿Prefieres que implemente con TanStack Query (plan arriba) o prefieres una solución custom sin dependencias nuevas usando `IndexedDB` + `useEffect`?**  
   La custom sería ~200 líneas más de código propio a mantener, pero evita agregar 3 paquetes npm.

Responde estas 5 preguntas y procedo con la implementación exacta.

---

## N2: Implementación de caché para `useCmsLanding`

**Objetivo:** Eliminar el flash del skeleton en cada visita a la landing page.

**Estrategia recomendada:** localStorage con timestamp (stale-while-revalidate manual)

**Motivo:**
- El proyecto ya usa `localStorage` para tokens (`auth-storage.ts`), por lo que la infraestructura está validada.
- El payload de `/cms/landing` es pequeño (< 10 KB), bien dentro del límite de ~5 MB.
- No requiere nuevas dependencias.
- Es más simple que IndexedDB o Service Workers para este caso de uso.

**Plan de implementación:**

1. Crear `src/modules/landing/hooks/cms-cache.ts` con funciones `loadCmsCache()`, `saveCmsCache(data, timestamp)` y `isCacheValid(timestamp, maxAgeMs)`.

2. Modificar `useCmsLanding`:
   - Al montar, intentar hidratar `blocks` desde `localStorage`.
   - Si hay caché válido (< 24h), setear `blocks` inmediatamente y `loading: false`.
   - Independientemente del caché, disparar un fetch en background.
   - Si el fetch es exitoso, guardar en `localStorage` y actualizar estado.
   - Si el fetch falla pero hay caché, mantener el caché visible (no mostrar error).

3. Ajustar `LandingPage`:
   - Cambiar `if (loading) return <LandingPageSkeleton />` por `if (loading && !blocks)` para permitir mostrar contenido stale mientras se refresca.

**Ventajas:**
- Primera visita: skeleton → contenido real (como ahora).
- Visitas siguientes (misma sesión o sesiones futuras): contenido instantáneo + refresh silencioso.
- Si el backend cae, la landing sigue funcionando con el último caché válido.

**Alternativas descartadas:**
- **TanStack Query + persistQueryClient:** Añade ~12 KB de dependencias y requiere `<QueryClientProvider>` en `main.tsx`. Excesivo para un solo endpoint.
- **IndexedDB / idb-keyval:** El payload es demasiado pequeño para justificar la complejidad async.
- **Service Worker + Cache API:** Demasiado overhead para una sola URL de CMS.
- **HTTP Cache-Control (backend):** Requiere modificar el backend. Viable en paralelo, pero no cubre el caso de que el frontend quiera controlar la experiencia de skeleton.
