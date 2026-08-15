# Plan de testing por fases — BOPACORP Web

**Proyecto:** BOPADIGITAL — BOPACORP S.A.
**Repositorio principal:** `bopacorp-web`
**Repositorios relacionados:** `bopacorp-api`, `bopacorp-shared`
**Fecha base:** 15 de agosto de 2026
**Responsable:** equipo de desarrollo/testing del proyecto
**Estado:** plan definido; ejecución pendiente de registrar.

---

## 1. Objetivo

Llevar el testing de `bopacorp-web` desde una situación sin suite automatizada hasta una estrategia reproducible que proteja los flujos públicos y administrativos que realmente viven en este repositorio.

El resultado esperado es poder afirmar, con evidencia actual:

1. Qué código frontend es crítico y qué código queda fuera con justificación.
2. Qué casos protegen cada regla importante.
3. Qué pruebas son unitarias, de componentes, de integración o end-to-end.
4. Qué porcentaje de cobertura se obtuvo y sobre qué conjunto se calculó.
5. Qué escenarios pasan, fallan o están bloqueados.
6. Qué límites dependen de la API, storage, correo o ambiente.

La meta propuesta es cubrir al menos el **80% del código crítico**, no prometer 80% global sin justificar el conjunto medido.

## 2. Línea base comprobada

### 2.1 Stack y alcance actual

El repo usa React 19, TypeScript 6, Vite 8, React Router 7, Tailwind CSS 4, shadcn/ui, Axios, React Hook Form, Zod, `@bopacorp/shared`, `sonner` e i18n.

Las rutas actuales son:

- públicas: `/`, `/servicios`, `/nosotros`, `/empleos`, `/empleos/:id`, `/terminos` y `/privacidad`;
- autenticación: `/login`;
- administración: `/admin/cms`, protegida por sesión, rol administrativo y permiso `content_blocks.read`.

Los módulos con lógica de negocio son:

- `src/modules/auth`: login, sesión, roles, permisos y guards;
- `src/services`: Axios, refresh token, almacenamiento local, JWT y errores;
- `src/modules/catalog`: catálogo público, categorías, segmentos y filtros;
- `src/modules/contact`: formulario público de cotización/contacto;
- `src/modules/employability`: vacantes, detalle y postulación con CV;
- `src/modules/cms`: secciones, bloques, búsqueda, edición de texto e imágenes;
- `src/shared`: loaders, errores, estados vacíos, sanitización y protección de cambios sin guardar.

### 2.2 Pruebas y scripts existentes

La revisión estática encontró:

- no hay `vitest`, `@testing-library/react`, `jsdom` ni `@playwright/test` declarados;
- no existe un script `test`, `test:run`, `test:coverage` o `test:e2e`;
- no hay archivos de prueba ni directorio `e2e/`;
- `npm run lint`, `npx tsc -b --noEmit` y `npm run build` sí están definidos o disponibles como verificaciones del repo;
- no existe evidencia actual de cobertura, CI de tests, reporte HTML/LCOV o ejecución de aceptación.

La existencia de código de aplicación o de documentación histórica no equivale a un resultado `Pass`.

### 2.3 Limitaciones de la línea base

- La cobertura actual del frontend es desconocida porque todavía no hay runner.
- No se ha definido un `coverage.include` para el conjunto crítico.
- No hay fixtures ni cuentas de prueba documentadas.
- No hay ambiente de aceptación registrado para Web.
- No se ha verificado desde este repo el envío real de correos de contacto o confirmación de postulación.
- No se debe contar el CRUD de productos del CRM como funcionalidad del Web; aquí el catálogo público es de solo lectura.
- La carga de imágenes CMS depende de la API y del storage; jsdom solo puede probar la decisión de la interfaz, no la persistencia real.
- `src/lib/sanitize.ts` existe, pero su integración con la renderización pública de contenido debe verificarse; no se debe asumir protección XSS solo por la existencia del helper.

## 3. Definición de alcance

### 3.1 Código crítico incluido

El conjunto crítico inicial incluye:

#### Autenticación, sesión y autorización

- `src/services/api.ts`;
- `src/services/auth.service.ts`;
- `src/services/auth-storage.ts`;
- `src/services/jwt.ts`;
- `src/modules/auth/context/AuthContext.tsx`;
- `src/modules/auth/pages/LoginPage.tsx`;
- `src/modules/auth/components/RequireAuth.tsx`;
- `src/modules/auth/components/RequireAdminRole.tsx`;
- `src/modules/admin/components/PermissionRoute.tsx`;
- `src/modules/auth/components/Can.tsx`;
- `src/modules/auth/hooks/usePermission.ts`.

#### Catálogo y contacto público

- `src/modules/catalog/catalog.service.ts`;
- `src/modules/catalog/hooks/use-public-catalog-items.ts`;
- `src/modules/catalog/hooks/use-public-categories.ts`;
- `src/modules/catalog/hooks/use-public-segments.ts`;
- `src/modules/landing/pages/ServicesPage.tsx`;
- `src/modules/catalog/components/PlanCard.tsx`;
- `src/modules/contact/contact.service.ts`;
- `src/modules/contact/hooks/use-contact-request.ts`;
- `src/modules/contact/components/ContactRequestDialog.tsx`;
- `src/modules/contact/components/ContactSuccessDialog.tsx`.

#### Empleabilidad y archivos públicos

- `src/modules/employability/employability.service.ts`;
- `src/modules/employability/hooks/use-published-vacancies.ts`;
- `src/modules/employability/hooks/use-public-job-vacancy.ts`;
- `src/modules/employability/hooks/use-apply-job-vacancy.ts`;
- `src/modules/landing/pages/JobsPage.tsx`;
- `src/modules/landing/pages/JobDetailPage.tsx`;
- `src/modules/employability/components/ApplyDialog.tsx`;
- `src/modules/employability/components/UploadResumeField.tsx`;
- `src/modules/employability/components/ApplySuccessDialog.tsx`.

#### CMS y contenido administrable

- `src/modules/cms/cms.service.ts`;
- `src/modules/cms/useSections.ts`;
- `src/modules/cms/useContentBlocks.ts`;
- `src/modules/cms/CmsAdminPage.tsx`;
- `src/modules/cms/components/CmsEditDialog.tsx`;
- `src/modules/cms/components/CmsImageUploadField.tsx`;
- `src/modules/cms/components/CmsSearchBar.tsx`;
- `src/lib/sanitize.ts`;
- `src/modules/landing/hooks/use-cms-landing.ts`.

#### Estados transversales y navegación

- `src/App.tsx`;
- `src/shared/errors/index.ts`;
- `src/shared/errors/auth.ts`;
- `src/shared/ui/page-loader.tsx`;
- `src/shared/ui/error-state.tsx`;
- `src/shared/ui/empty-state.tsx`;
- `src/shared/hooks/use-unsaved-guard.ts`.

### 3.2 Código que puede excluirse con justificación

- primitivas visuales de shadcn sin lógica de negocio propia;
- íconos, imágenes, fuentes, estilos y archivos generados;
- tipos que no ejecutan lógica;
- configuración estática sin decisiones de usuario;
- fixtures y archivos de prueba;
- contenido estático que no tenga interacción ni transformación;
- código muerto confirmado por análisis y revisión.

La exclusión debe quedar escrita en el informe de cobertura. Nunca se debe excluir un módulo solo porque sea difícil de probar.

### 3.3 Límites de alcance funcional

Este plan cubre el comportamiento implementado en el Web:

- catálogo público y filtros disponibles;
- contacto/cotización pública;
- vacantes públicas y postulación con PDF;
- login administrativo y autorización del CMS;
- edición actual de bloques de texto e imágenes.

Este plan no afirma que el Web implemente:

- creación, edición o eliminación administrativa de productos, que pertenece al CRM;
- negociaciones, clientes, visitas, documentos internos, matrices o reportes;
- envío real de correo, si no existe evidencia del proveedor y ambiente;
- resultado posterior de una postulación, porque el frontend actual solo muestra confirmación de recepción.

## 4. Estrategia de niveles de prueba

| Nivel | Propósito | Herramienta propuesta | Dependencia |
|---|---|---|---|
| Unitario | Validar transformaciones, decisiones, parsers y mapeos de error. | Vitest | Mocks locales. |
| Componente | Validar formularios, dialogs, guards, filtros y estados visibles. | Vitest + React Testing Library + user-event | Providers y servicios mockeados. |
| Integración frontend | Validar hooks/servicios contra respuestas API simuladas y contratos. | Vitest; MSW opcional | Mock o servidor estable. |
| Integración API | Validar que las rutas y contratos consumidos por Web respondan correctamente. | Suite de `bopacorp-api` | API, fixtures o dobles deterministas. |
| End-to-end | Validar journeys públicos y administrativos en navegador. | Playwright recomendado | Web, API, storage, cuentas y datos de prueba. |
| Aceptación manual | Validar responsive, teclado, descarga/carga, traducciones y ambiente real. | Navegador | Ambiente controlado y datos anonimizados. |

Una prueba RTL no demuestra que la API persista o autorice correctamente. Una prueba API no demuestra que el usuario pueda completar el formulario en el navegador.

## 5. Fases de ejecución

### Fase 0 — Congelar alcance, riesgos y datos

**Objetivo:** preparar una base reproducible antes de añadir casos.

**Duración estimada:** 0.5–1 día.

### Actividades

- Confirmar el commit base de `bopacorp-web`, `bopacorp-api` y `bopacorp-shared`.
- Registrar Node, npm, sistema operativo, navegador y resolución usada para aceptación.
- Confirmar que se probarán solo rutas y funcionalidades actuales.
- Registrar la URL base sin guardar valores secretos.
- Decidir qué pruebas usarán mocks y cuáles usarán API real.
- Crear datos anonimizados: categorías, segmentos, servicios, vacantes y bloques CMS.
- Crear una cuenta administrativa temporal con `content_blocks.read` y una cuenta sin ese permiso.
- Preparar archivos `valid-resume.pdf`, `invalid-resume.txt`, archivo de 20 MB y archivo mayor a 20 MB.
- Preparar imágenes PNG/JPG/WEBP/AVIF válidas, una extensión no permitida y un archivo mayor a 5 MB.
- Confirmar que no se guardarán contraseñas, tokens, datos personales reales ni `.env` en el repositorio.

### Entregables

- alcance firmado por el equipo;
- inventario de rutas y roles;
- fixtures y archivos de prueba anonimizados;
- mapa riesgo → requisito → caso;
- SHA y ambiente de referencia.

### Criterio de salida

No se inicia la medición final de cobertura hasta conocer la revisión, ambiente y conjunto de código que se medirán.

### Fase 1 — Configurar el runner y medir la línea base

**Objetivo:** crear una ejecución reproducible y obtener la primera medición cuantitativa.

**Duración estimada:** 1–2 días.

### Actividades

1. Instalar Vitest, `@vitest/coverage-v8`, jsdom, React Testing Library, `user-event` y `jest-dom` como dependencias de desarrollo.
2. Configurar `test` en Vite con alias `@/`, entorno jsdom y `src/test/setup.ts`.
3. Agregar scripts `npm run test:run` y `npm run test:coverage`.
4. Generar reportes text, LCOV y HTML.
5. Crear utilidades de render con `AuthProvider`, router, i18n y providers mínimos.
6. Ejecutar la suite inicial, aunque el porcentaje sea bajo.
7. Ejecutar `npm run lint`, `npx tsc -b --noEmit` y `npm run build`.
8. Definir `coverage.include` para el conjunto crítico y excluir configuración, tipos y UI sin lógica.
9. Registrar SHA, fecha, Node, npm, comandos, resultados y errores.

### Decisión sobre umbrales

No se debe colocar de inmediato un umbral de 80% sobre todo `src/`. Primero se usarán gates informativos para ampliar la suite; el gate final exigirá al menos 80% de líneas del conjunto crítico y casos de decisión de seguridad, validación y archivos.

### Criterio de salida

El runner pasa de forma reproducible, existe una medición y el alcance de cobertura queda visible.

### Fase 2 — Autenticación, autorización y frontera HTTP

**Objetivo:** cerrar el perímetro de seguridad del panel CMS y la comunicación con la API.

**Duración estimada:** 2–3 días.

### Casos unitarios/componentes

- `VITE_API_URL` ausente o sin ruta `/api/` produce un error explícito al inicializar el cliente.
- Login válido guarda usuario y tokens.
- Login inválido muestra el mensaje correspondiente.
- Campos de login vacíos o inválidos no envían la solicitud.
- Usuario sin rol `admin` o `web-admin` no puede entrar al panel.
- Sesión almacenada se restaura y consulta `/auth/me` en ruta protegida.
- `/auth/me` fallido limpia la sesión.
- `AuthContext` reconoce como públicas las rutas reales `/`, `/servicios`, `/nosotros`, `/empleos` y sus detalles.
- `RequireAuth` muestra loader durante verificación y conserva la ruta original al redirigir.
- `RequireAdminRole` redirige a login si el rol no es administrativo.
- `PermissionRoute` muestra acceso denegado sin permiso.
- `Can` oculta una acción cuando falta permiso y la muestra cuando existe.
- `hasAnyPermission` permite la acción si existe al menos uno de los permisos.
- Logout limpia tokens y usuario aunque falle la revocación remota.
- JWT válido obtiene permisos y JWT inválido cae a permisos vacíos.

### Casos de Axios/API boundary

- Sobre `{ success: true, data }` se desenvuelve correctamente.
- Sobre paginado conserva `data` y `meta`.
- Error con `code`, `message` y `details` se convierte en `ApiError`.
- Detalles malformados se ignoran sin romper la solicitud.
- Rutas públicas no llevan Bearer ni intentan refresh ante 401.
- Rutas protegidas reciben `Authorization: Bearer`.
- 401 protegido obtiene refresh y reintenta una sola vez.
- Requests concurrentes esperan el mismo refresh.
- Refresh fallido limpia almacenamiento y redirige a `/login`.
- Refresh proactivo actualiza tokens cuando están próximos a vencer.
- Evento `bopacorp:token-refreshed` actualiza el usuario en el contexto.

### Criterio de salida

No quedan caminos críticos de login, refresh, limpieza de sesión, permiso o error HTTP sin prueba.

### Fase 3 — Catálogo público y contacto

**Objetivo:** proteger la navegación comercial pública y la captura de solicitudes.

**Duración estimada:** 2–3 días.

### Catálogo

- Solicitud de catálogo usa `/public/catalog/items`.
- Categoría, segmento, precio mínimo y precio máximo se transforman en query params.
- Valores `0` no se pierden por ser falsy.
- Categorías y segmentos se cargan de forma independiente.
- Loading inicial muestra skeleton o estado equivalente.
- Error muestra mensaje y acción de reintento.
- Reintento vuelve a solicitar los datos.
- Lista vacía muestra estado vacío sin confundirlo con error.
- Cambiar filtros actualiza la consulta y los resultados.
- Debounce evita solicitudes excesivas cuando el filtro lo requiera.
- Recarga con datos existentes distingue `reloading` de carga inicial.
- Respuesta tardía de una consulta cancelada no sobrescribe la consulta actual.
- Tarjeta muestra detalles, beneficios y precio disponibles.
- Acción de cotización conserva el `itemId` del servicio seleccionado.
- Enlace de WhatsApp conserva la información esperada del servicio.

### Contacto/cotización

- Nombre y correo son obligatorios según el schema compartido.
- Correo inválido muestra error de campo.
- Teléfono y mensaje pueden omitirse cuando el contrato lo permita.
- Límites visibles de nombre, correo, teléfono y mensaje se respetan.
- Valores de texto se recortan antes de enviar.
- `itemId` se incluye cuando la solicitud parte de una tarjeta del catálogo.
- Submit válido llama al servicio con el payload esperado.
- Botón se deshabilita mientras se envía.
- Error general se muestra sin perder el formulario.
- Error con detalles de campo se asigna al campo correcto.
- Éxito muestra nombre, correo y fecha recibidos.
- Cerrar un formulario modificado pide confirmar descarte.
- Cerrar un formulario limpio no pide confirmación.
- Al cerrar, el formulario y el estado de envío se reinician.

### Criterio de salida

Los escenarios de catálogo y contacto tienen camino feliz, filtros, estados vacío/error, validación y recuperación documentados.

### Fase 4 — Empleabilidad y postulación

**Objetivo:** proteger el flujo público de consulta de vacantes y carga de CV.

**Duración estimada:** 2–4 días.

### Vacantes

- Listado usa la consulta de vacantes publicadas y conserva metadata de paginación.
- Búsqueda, página, límite y orden se envían al servicio.
- Loading, lista vacía, error y reintento se muestran correctamente.
- Cambiar de página no mezcla resultados anteriores con el nuevo estado.
- Detalle sin `id` no solicita la API.
- Detalle válido muestra información de la vacante.
- Vacante inexistente muestra error y acción de reintento.
- Ruta `/empleos/:id` permite volver al listado sin perder navegación.

### Formulario de postulación

- Campos obligatorios del schema compartido se validan antes de enviar.
- Correo, cédula, nombres y apellidos inválidos muestran errores observables.
- Teléfono, dirección y carta se tratan como opcionales cuando el contrato lo permite.
- No se puede enviar sin CV.
- Se acepta PDF.
- Se rechaza un MIME distinto de `application/pdf`.
- Se rechaza un archivo mayor a 20 MB.
- El nombre del archivo seleccionado se muestra de forma segura y truncada.
- Submit crea `FormData` con archivo, `vacancyId`, candidato y carta no vacía.
- Valores de texto se recortan antes de crear el payload.
- La interfaz se bloquea mientras se envía.
- Error `NOT_FOUND` comunica que la vacante ya no está disponible.
- Error `RATE_LIMITED` comunica el límite de postulaciones.
- Error `MULTER_ERROR` distingue tamaño y tipo de archivo.
- Error `CONFLICT` comunica una postulación activa duplicada.
- Errores de campos enviados por API se muestran en sus controles.
- Éxito muestra vacante, candidato y fecha recibidos.
- Al cerrar o completar, el estado del formulario se reinicia.
- Cerrar con cambios pide confirmación de descarte.

### Criterio de salida

El flujo candidato → vacante → formulario → PDF tiene casos válidos, inválidos, límite, error de API, éxito y recuperación.

### Fase 5 — CMS, contenido e imágenes

**Objetivo:** proteger el único flujo administrativo implementado en este repo.

**Duración estimada:** 3–4 días.

### Secciones y bloques

- Secciones se solicitan desde `/catalog/content-blocks/sections`.
- Loading inicial muestra skeleton.
- Error inicial muestra `ErrorState` y permite reintentar.
- La primera sección se selecciona automáticamente.
- Cambio de pestaña solicita los bloques correspondientes.
- Listado usa página 1 y límite 50 según el servicio actual.
- Búsqueda se envía después del debounce de 300 ms.
- Limpiar búsqueda elimina el filtro.
- Estado sin resultados distingue archivo vacío de búsqueda sin coincidencias.
- Metadata de cantidad y última actualización se muestra con datos conocidos.
- Respuesta tardía cancelada no modifica la sección actual.

### Edición de texto

- Abrir un bloque carga su contenido actual.
- Bloque no visual permite editar texto.
- El textarea respeta `maxLength` de 10 000 caracteres.
- Guardar texto llama `PATCH /catalog/content-blocks/:id`.
- Respuesta exitosa actualiza solo el bloque editado y muestra toast.
- Error de API conserva el diálogo y muestra feedback.
- Botón guardar se bloquea mientras se guarda.
- Cerrar sin cambios no muestra descarte.
- Cerrar con cambios muestra diálogo de descarte.
- Cancelar descarte conserva la edición.
- Confirmar descarte limpia el diálogo y el estado local.

### Edición de imágenes

- Bloques `IMAGE` o `BANNER` muestran carga de imagen.
- Se aceptan PNG, JPEG, WEBP y AVIF.
- Se rechaza un formato no permitido.
- Se rechaza una imagen mayor a 5 MB.
- Archivo válido genera preview.
- Limpiar imagen elimina preview y valor seleccionado.
- Guardar se deshabilita si un bloque visual no tiene archivo nuevo.
- Guardar envía `POST /uploads/images` con `contentKey` y `FormData`.
- Después de subir, se recarga el bloque y se muestra toast.
- Error de upload conserva el diálogo y evita afirmar éxito.
- No se guardan archivos reales o datos sensibles en los fixtures.

### Seguridad de contenido

- El helper `sanitizeHtml` elimina payloads HTML peligrosos.
- La ruta pública que renderice contenido CMS se verifica explícitamente; si no usa el helper, el caso queda como defecto o limitación.
- Payloads maliciosos no generan HTML ejecutable en la vista pública después de corregir o confirmar esa integración.
- Tokens no aparecen en texto visible, logs de prueba ni screenshots.

### Criterio de salida

Un administrador autorizado puede listar y editar texto/imágenes con estados de carga, error, validación, cancelación y recuperación; el alcance se limita a los bloques actuales.

### Fase 6 — Estados transversales, accesibilidad y responsive

**Objetivo:** validar comportamiento observable común a todos los módulos.

**Duración estimada:** 1–2 días.

### Casos

- `PageLoader` muestra mensaje cuando recibe uno y skeleton cuando no.
- `ErrorState` traduce códigos conocidos y conserva mensajes desconocidos.
- Botón de retry ejecuta el callback correcto.
- `EmptyState` muestra título, descripción, ícono y acción según props.
- Dialogs tienen título accesible, foco razonable y cierre controlado.
- Inputs tienen label asociado y `aria-invalid`/estado de error cuando corresponde.
- Formularios no envían con Enter cuando faltan campos obligatorios.
- Teclado puede abrir, completar, cancelar y cerrar los flujos principales.
- Las rutas públicas funcionan en viewport móvil y escritorio.
- El cambio español/inglés no rompe navegación ni estados principales.
- El modo claro/oscuro no oculta errores, focus ni acciones críticas.
- Formularios no pierden datos silenciosamente al intentar cerrar.

La revisión visual y responsive requiere navegador; no se considera cubierta solo con jsdom.

### Fase 7 — Integración con API y contratos

**Objetivo:** demostrar que los tests frontend consumen el contrato real esperado y no ocultan drift.

**Responsable principal:** `bopacorp-api`, coordinado con este plan.

### Casos coordinados

- Respuestas `{ success, data, error }` usadas por `request` y `requestPaginated`.
- Errores de validación con `details` compatibles con el mapeo de formularios.
- Contratos de catálogo, contacto, vacantes, postulación y CMS.
- `401` protegido, `403` de permiso, `404` de recurso, `409` de duplicado y `429`/rate limit cuando aplique.
- Validación real de tipo y tamaño de CV e imagen.
- Persistencia de actualización CMS y upload en storage de prueba.
- CORS y URL de API del ambiente de prueba.

### Entregables

- reporte de pruebas API relacionado;
- matriz de respuestas esperadas y observadas;
- SHA coordinado de API, Web y Shared;
- caso de contrato cuando exista drift de versiones.

### Implementación en el Web

- `vitest.integration.config.ts` separa la suite HTTP de los tests deterministas y no modifica la configuración de cobertura.
- `npm run test:integration` ejecuta `src/integration/**/*.test.ts` contra la URL entregada por `VITE_API_URL`.
- Las cuentas se inyectan con `VITE_WEB_TEST_CMS_EMAIL`, `VITE_WEB_TEST_CMS_PASSWORD`, `VITE_WEB_TEST_LIMITED_EMAIL` y `VITE_WEB_TEST_LIMITED_PASSWORD`; sus valores no deben versionarse ni aparecer en logs.
- Contacto, actualización CMS y postulación requieren `VITE_WEB_TEST_ALLOW_MUTATIONS=true`; el upload requiere además `VITE_WEB_TEST_ALLOW_STORAGE_MUTATIONS=true`.
- La suite cubre sobres públicos, `auth/me`, 401, 403, 404, 422 con `details`, catálogo, vacantes, CMS, contacto y multipart de postulación. Los casos 409/429 y validaciones de tamaño que puedan consumir cuota quedan para una corrida controlada del ambiente.

Ejemplo de ejecución con variables temporales del ambiente (sin escribirlas en `.env` ni en el repositorio):

```bash
VITE_API_URL=http://localhost:3000/api/v1 \
VITE_WEB_TEST_CMS_EMAIL="$CMS_TEST_EMAIL" \
VITE_WEB_TEST_CMS_PASSWORD="$CMS_TEST_PASSWORD" \
VITE_WEB_TEST_LIMITED_EMAIL="$LIMITED_TEST_EMAIL" \
VITE_WEB_TEST_LIMITED_PASSWORD="$LIMITED_TEST_PASSWORD" \
npm run test:integration
```

La primera corrida debe ejecutarse desde un entorno que pueda resolver la URL del API. Si el servidor corre en otro namespace, contenedor o máquina, se debe usar un hostname alcanzable en `VITE_API_URL` y registrar el SHA real de API/Web/Shared.

### Resultado observado — 2026-08-15

- API local `http://localhost:3000/api/v1`, API `4018bd5`, Shared `0.3.2` y Web `cf33057` más working tree de Fase 7.
- Contratos públicos: `7/7` passed; auth/RBAC: `4/4` passed.
- Mutaciones: `4/4` passed: contacto, postulación multipart, actualización/restauración CMS y upload/restauración de imagen.
- Resultado acumulado de la fase para el alcance HTTP ejecutado: `15/15` passed.
- El fixture de PDF usa 10 KB para satisfacer el contrato de tamaño mínimo del API; el PDF sintético inicial de 4 bytes producía `0.00 MB` y fue corregido en el test.
- Fase 8 — E2E en navegador, revisión visual y responsive — permanece pendiente.

### Criterio de salida

El Web y la API presentan el mismo contrato para los escenarios aceptados y toda diferencia conocida está documentada.

### Fase 8 — Pruebas end-to-end del Web

**Objetivo:** demostrar journeys completos en navegador.

**Herramienta recomendada:** Playwright.

**Duración estimada:** 3–5 días, sin contar preparación del ambiente.

### Preparación

- Añadir `@playwright/test` como dependencia de desarrollo.
- Crear `playwright.config.ts` y `baseURL` configurable.
- Definir `npm run test:e2e` y `npm run test:e2e:report`.
- Preparar API, storage y datos semilla de prueba.
- Usar cuentas temporales desde secretos del ambiente; nunca versionar contraseñas.
- Generar reportes HTML, screenshots y traces solo cuando aporten evidencia o expliquen un fallo.

### Journeys mínimos

| ID | Perfil | Journey |
|---|---|---|
| WEB-E2E-01 | Visitante | Abrir servicios → filtrar catálogo → abrir/cotizar servicio → enviar contacto. |
| WEB-E2E-02 | Candidato | Abrir empleos → consultar vacante → intentar formulario inválido → enviar PDF válido. |
| WEB-E2E-03 | Administrador CMS | Login → abrir CMS → buscar bloque → editar texto → verificar resultado público. |
| WEB-E2E-04 | Administrador CMS | Abrir bloque visual → cargar imagen válida → guardar → verificar preview/resultado. |
| WEB-E2E-05 | Usuario sin permiso | Intentar `/admin/cms` → confirmar redirección o acceso denegado. |
| WEB-E2E-06 | Visitante | Forzar error de catálogo/contacto → usar retry → confirmar recuperación. |

No se debe convertir en E2E el CRUD de productos, negociaciones, visitas o reportes porque no son rutas de este repo.

### Criterio de salida

Los journeys mínimos pasan en un ambiente reproducible y el reporte HTML identifica cualquier fallo, screenshot y trace.

### Fase 9 — Cerrar cobertura y quality gate

**Objetivo:** alcanzar y demostrar la meta del código crítico.

### Actividades

1. Ejecutar toda la suite unit/component.
2. Ejecutar cobertura con el `include` final.
3. Revisar líneas y ramas no cubiertas del conjunto crítico.
4. Priorizar decisiones de auth, permisos, validaciones, errores, archivos y sanitización.
5. Eliminar tests frágiles o dependientes de implementación interna.
6. Añadir el umbral mínimo solo al conjunto crítico.
7. Ejecutar lint, typecheck y build.
8. Ejecutar E2E en ambiente de prueba estable.
9. Guardar artifacts y actualizar matriz/registro.

### Gate propuesto

| Métrica | Gate final |
|---|---:|
| Tests unit/component críticos | 100% deben pasar |
| Cobertura de líneas del conjunto crítico | ≥ 80% |
| Decisiones de auth/RBAC | Válidas, inválidas y no autorizadas cubiertas |
| Formularios y archivos | Casos válidos, inválidos y límite cubiertos |
| Lint | Sin errores |
| Typecheck | Sin errores |
| Build | Exitoso |
| E2E mínimos | Todos pasan en ambiente de prueba |

El porcentaje global puede reportarse como información adicional, pero no reemplaza el gate del conjunto crítico.

### Fase 10 — Evidencia para informe, manual y rúbrica

**Objetivo:** convertir resultados ejecutados en evidencia académica y operativa reproducible.

### Evidencia mínima por ejecución

- repositorio y commit SHA;
- fecha y hora;
- sistema operativo, Node, npm y navegador;
- ambiente y URL base sin secretos;
- comando o caso ejecutado;
- resultado observado y casos fallidos;
- porcentaje de cobertura y archivos incluidos;
- artifact HTML/LCOV o reporte Playwright;
- screenshot/video solo si aporta evidencia;
- defecto, fix SHA y retest si existió.

### Cadena de trazabilidad

Cada caso debe seguir la cadena:

```text
Riesgo → Requisito → Caso de prueba → Resultado observado → Evidencia → Retest
```

### Entregables finales

- `MATRIZ_CASOS_PRUEBA_WEB.md` actualizado;
- `REGISTRO_EVIDENCIA_WEB.md` con ejecuciones reales;
- reporte HTML/LCOV de cobertura;
- reporte Playwright de aceptación;
- capítulo de testing del informe final;
- runbook de demostración Web;
- lista de limitaciones y casos bloqueados.

## 6. Técnicas de diseño de pruebas

### Particiones de equivalencia

Aplicar a correos, teléfonos, campos obligatorios, filtros, roles, permisos, respuestas API y archivos:

- válido;
- vacío;
- inválido;
- duplicado;
- no autorizado;
- no encontrado;
- fuera de alcance.

### Valores límite

Probar siempre:

- 0, 1, máximo y máximo + 1;
- texto vacío, longitud máxima y longitud máxima + 1;
- archivo vacío, justo en el límite y sobre el límite;
- primera y última página;
- precio mínimo/máximo y rangos invertidos;
- token vigente, próximo a vencer y expirado.

### Tablas de decisión

Usar combinaciones de sesión, rol, permiso, ruta y acción para auth/RBAC; y combinación de archivo, MIME, tamaño y estado para uploads.

### Pruebas de estados

Representar `idle → submitting → success/error` para formularios y `loading → loaded/error/empty` para hooks. Probar que un error no deje la interfaz en un estado falso.

### Tests parametrizados

Usar `it.each` para códigos de error, formatos de archivo, permisos, estados y límites cuando la regla sea la misma.

### Fixtures, mocks y builders

- usar fixtures deterministas y anonimizadas;
- mockear Axios/API en unit y component tests;
- usar MSW o ambiente de integración para contratos más cercanos a red;
- limpiar mocks, timers, localStorage y URL entre casos;
- evitar depender de fechas, orden o contenido mutable sin congelarlo.

### Arrange–Act–Assert

Cada test debe separar preparación, ejecución y aserciones observables. No basta con afirmar que una función interna fue llamada.

## 7. Fixtures y datos de prueba

### Perfiles

- `admin-test`: rol `admin` y permiso `content_blocks.read`;
- `web-admin-test`: rol `web-admin` y permiso `content_blocks.read`;
- `no-cms-permission-test`: usuario autenticado sin `content_blocks.read`;
- `invalid-session-test`: token ausente, vencido o inválido.

### Datos públicos

- catálogo con varias categorías y segmentos;
- servicio con precio mínimo, máximo y beneficios;
- respuesta vacía;
- vacante publicada y vacante inexistente;
- respuesta de postulación exitosa y estados de error.

### Datos CMS

- secciones con cero, uno y varios bloques;
- bloque de texto editable;
- bloque `IMAGE`;
- bloque `BANNER`;
- búsqueda con coincidencias y sin coincidencias;
- error de listado, actualización y upload.

### Archivos

- `valid-resume.pdf`;
- `invalid-resume.txt`;
- archivo PDF de exactamente 20 MB;
- archivo PDF mayor a 20 MB;
- `valid-image.png`;
- `valid-image.jpg`;
- `valid-image.webp`;
- `valid-image.avif`;
- `invalid-image.gif` o `.exe`;
- imagen de exactamente 5 MB y mayor a 5 MB.

No se deben versionar archivos de candidatos, credenciales, tokens, capturas con datos reales ni bases de producción.

## 8. CI y calendario de ejecución

### Pull request

Cuando los scripts estén configurados, ejecutar:

```bash
npm ci
npm run lint
npx tsc -b --noEmit
npm run test:coverage
npm run build
```

El artifact debe incluir:

- resumen de consola;
- `coverage/lcov.info`;
- `coverage/index.html`;
- reportes de fallos;
- reporte Playwright cuando el pipeline de aceptación se ejecute.

### Ejecución nocturna o manual

Ejecutar Playwright contra un ambiente de prueba estable. No depender de producción para que CI pase.

### Release candidate

Ejecutar unit/component, integración de contrato, E2E, smoke de rutas públicas, login CMS, validación del despliegue y revisión manual de los escenarios del reporte.

## 9. Riesgos y bloqueos

| Riesgo | Consecuencia | Mitigación |
|---|---|---|
| No existe runner en Web | No se puede medir cobertura ni automatizar componentes. | Configurar Vitest/RTL en Fase 1. |
| No hay ambiente o API estable | E2E e integración fallan por infraestructura. | Mocks para unit/component y ambiente separado. |
| Falta cuenta CMS de prueba | No se puede cerrar auth/RBAC/E2E. | Crear cuenta temporal y rotar secretos. |
| Contrato Shared/API cambia | Formularios o servicios pueden quedar desalineados. | Fijar SHA y ejecutar contrato coordinado. |
| Upload depende de storage | Un test visual puede parecer correcto aunque no persista. | Separar test de componente, integración y E2E. |
| Correo no verificable | No se puede afirmar confirmación por email. | Declararlo bloqueado o futuro hasta probar proveedor real. |
| Datos sensibles en artifacts | Exposición de información personal o credenciales. | Fixtures anonimizadas y revisión antes de publicar. |
| Tests frágiles por copy/DOM | Cambios visuales producen falsos negativos. | Consultas accesibles y aserciones de comportamiento. |
| Cobertura solo de helpers | Porcentaje alto pero poco representativo. | Incluir formularios, hooks, guards, servicios y decisiones críticas. |

## 10. Criterios de terminado

El plan se considera terminado cuando:

- [ ] el conjunto crítico está definido y justificado;
- [ ] la línea base tiene SHA, fecha y comandos reproducibles;
- [ ] Vitest/RTL y cobertura están configurados;
- [ ] auth, RBAC y API boundary tienen pruebas completas;
- [ ] catálogo y contacto tienen pruebas de filtros, validación y errores;
- [ ] empleabilidad cubre vacantes, PDF, límites y errores de postulación;
- [ ] CMS cubre listado, búsqueda, edición de texto, imágenes y descarte;
- [ ] la sanitización y los estados comunes tienen pruebas;
- [ ] API y Web confirman contratos y respuestas de error;
- [ ] los E2E mínimos pasan en un ambiente de prueba;
- [ ] la cobertura del código crítico es ≥80%;
- [ ] lint, typecheck y build pasan;
- [ ] CI conserva artifacts;
- [ ] cada caso del informe tiene evidencia actual;
- [ ] limitaciones, descopes y bloqueos están declarados.

## 11. Orden recomendado de ejecución

1. Fase 0: alcance, cuentas y fixtures.
2. Fase 1: baseline y runner.
3. Fase 2: auth/API boundary.
4. Fase 3: catálogo y contacto.
5. Fase 4: empleabilidad y CV.
6. Fase 5: CMS e imágenes.
7. Fase 6: estados, accesibilidad y responsive.
8. Fase 7: integración API/contratos.
9. Fase 8: E2E.
10. Fase 9: cobertura y gates.
11. Fase 10: evidencia y rúbrica.

No se debe empezar por Playwright si todavía no existe una línea base, fixtures y cuentas de prueba. El navegador valida el journey, pero no sustituye las pruebas unitarias de reglas y permisos.
