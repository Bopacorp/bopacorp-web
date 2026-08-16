# Matriz de casos de prueba del Web

**Estado:** casos definidos y resultados actualizados con las corridas disponibles; no marcar `Pass` sin evidencia reproducible.
**Leyenda:** `Pendiente` significa que el caso todavía debe implementarse, ejecutarse o contar con evidencia actual; `Not run` identifica una revisión que requiere ambiente o herramienta todavía no disponible. Los casos read-only de Fase 7 pasan a `Pass` únicamente después de una corrida contra un API HTTP alcanzable; las mutaciones se ejecutan solo con flags explícitos y conservan su resultado real.

## 1. Baseline y configuración

| ID | Capa | Caso | Prioridad | Estado | Destino sugerido |
|---|---|---|---|---|---|
| WEB-BASE-001 | Configuración | Runner Vitest ejecuta un test mínimo en jsdom | P0 | Pass | `src/test/` |
| WEB-BASE-002 | Configuración | Alias `@/` funciona dentro de los tests | P0 | Pass | `vite.config.ts` / tests |
| WEB-BASE-003 | Configuración | Cobertura genera text, LCOV y HTML | P0 | Pass | `coverage/` |
| WEB-BASE-004 | Calidad | Lint, typecheck y build pasan en la revisión base | P0 | Pass | CI |
| WEB-BASE-005 | Calidad | El gate de cobertura del código crítico exige al menos 80% de líneas | P0 | Pass | `vite.config.ts` / CI |

## 2. Autenticación y autorización

| ID | Capa | Caso | Prioridad | Estado | Destino sugerido |
|---|---|---|---|---|---|
| WEB-AUTH-001 | Componente | Login válido inicia sesión y navega al destino solicitado | P0 | Pass | `LoginPage.test.tsx` |
| WEB-AUTH-002 | Componente | Login inválido muestra error de autenticación | P0 | Pass | `LoginPage.test.tsx` |
| WEB-AUTH-003 | Componente | Campos de login vacíos o inválidos no envían | P0 | Pass | `LoginPage.test.tsx` |
| WEB-AUTH-004 | Unitario | Usuario sin rol `admin`/`web-admin` es rechazado | P0 | Pass | `AuthContext.test.tsx` |
| WEB-AUTH-005 | Integración | Sesión almacenada consulta `/auth/me` en ruta protegida | P0 | Pass | `AuthContext.test.tsx` |
| WEB-AUTH-006 | Integración | Fallo de `/auth/me` limpia usuario y tokens | P0 | Pass | `AuthContext.test.tsx` |
| WEB-AUTH-007 | Componente | `RequireAuth` muestra loader durante la verificación | P1 | Pass | `RequireAuth.loader.test.tsx` |
| WEB-AUTH-008 | Componente | `RequireAuth` redirige a login y conserva `from` | P0 | Pass | `RequireAuth.test.tsx` |
| WEB-AUTH-009 | Componente | `RequireAdminRole` redirige a usuario no administrativo | P0 | Pass | `RequireAdminRole.test.tsx` |
| WEB-AUTH-010 | Componente | `PermissionRoute` muestra acceso denegado sin permiso | P0 | Pass | `PermissionRoute.test.tsx` |
| WEB-AUTH-011 | Componente | `Can` oculta una acción sin permiso | P0 | Pass | `Can.test.tsx` |
| WEB-AUTH-012 | Componente | `Can` muestra una acción con alguno de los permisos permitidos | P1 | Pass | `Can.test.tsx` |
| WEB-AUTH-013 | Integración | Logout limpia sesión aunque falle la revocación remota | P0 | Pass | `AuthContext.test.tsx` |
| WEB-AUTH-014 | Unitario | JWT válido obtiene permisos y JWT inválido cae a permisos vacíos | P1 | Pass | `jwt.test.ts` / `auth.service.test.ts` |
| WEB-AUTH-015 | Integración | `AuthContext` reconoce las rutas públicas reales en español | P0 | Pass | `AuthContext.test.tsx` |

## 3. Cliente HTTP y contratos

| ID | Capa | Caso | Prioridad | Estado | Destino sugerido |
|---|---|---|---|---|---|
| WEB-API-001 | Unitario | `VITE_API_URL` ausente produce error explícito | P0 | Pass | `api-config.test.ts` |
| WEB-API-002 | Unitario | URL sin `/api/` produce error explícito | P1 | Pass | `api-config.test.ts` |
| WEB-API-003 | Unitario | Sobre exitoso devuelve `data` | P0 | Pass | `api.test.ts` |
| WEB-API-004 | Unitario | Sobre paginado devuelve `data` y `meta` | P1 | Pass | `api.test.ts` |
| WEB-API-005 | Unitario | Error con detalles se convierte en `ApiError` | P0 | Pass | `api.test.ts` |
| WEB-API-006 | Unitario | Detalles inválidos no rompen la normalización | P1 | Pass | `api.test.ts` |
| WEB-API-007 | Unitario | Rutas públicas no agregan Bearer ni hacen refresh por 401 | P0 | Pass | `api.test.ts` |
| WEB-API-008 | Unitario | Ruta protegida recibe Bearer token | P0 | Pass | `api.test.ts` |
| WEB-API-009 | Integración | 401 protegido refresca y reintenta una sola vez | P0 | Pass | `api.test.ts` |
| WEB-API-010 | Integración | Requests concurrentes esperan el mismo refresh | P1 | Pass | `api.test.ts` |
| WEB-API-011 | Integración | Refresh fallido limpia storage y redirige a login | P0 | Pass | `api.test.ts` |
| WEB-API-012 | Integración | Refresh proactivo actualiza el token próximo a vencer | P1 | Pass | `api.test.ts` |
| WEB-API-013 | Integración | Evento de token refrescado actualiza el usuario | P1 | Pass | `AuthContext.test.tsx` / `api.test.ts` |

## 4. Catálogo público

| ID | Capa | Caso | Prioridad | Estado | Destino sugerido |
|---|---|---|---|---|---|
| WEB-CAT-001 | Unitario | Servicio solicita `/public/catalog/items` | P0 | Pass | `catalog.service.test.ts` |
| WEB-CAT-002 | Unitario | Categoría y segmento se envían como filtros | P1 | Pass | `catalog.service.test.ts` |
| WEB-CAT-003 | Unitario | Precio mínimo/máximo, incluido `0`, se conserva | P0 | Pass | `catalog.service.test.ts` |
| WEB-CAT-004 | Componente | Catálogo muestra loading inicial | P1 | Pass | `ServicesPage.test.tsx` |
| WEB-CAT-005 | Componente | Error de catálogo muestra retry | P0 | Pass | `ServicesPage.test.tsx` |
| WEB-CAT-006 | Componente | Lista vacía muestra estado vacío | P1 | Pass | `ServicesPage.test.tsx` |
| WEB-CAT-007 | Componente | Cambiar categoría/segmento actualiza resultados | P0 | Pass | `ServicesPage.test.tsx` |
| WEB-CAT-008 | Componente | Filtros mantienen la navegación esperada en URL | P1 | Pass | `ServicesPage.test.tsx` |
| WEB-CAT-009 | Integración | Respuesta tardía cancelada no sobrescribe filtros actuales | P1 | Pass | `use-public-catalog-items.test.ts` |
| WEB-CAT-010 | Componente | Recarga con datos muestra estado de reloading | P1 | Pass | `use-public-catalog-items.test.ts` |
| WEB-CAT-011 | Componente | Tarjeta muestra precio, beneficios y detalles disponibles | P1 | Pass | `PlanCard.test.tsx` |
| WEB-CAT-012 | Componente | Cotización conserva el servicio seleccionado | P0 | Pass | `PlanCard.test.tsx` |
| WEB-CAT-013 | Componente | Enlace de WhatsApp contiene la información esperada | P1 | Pass | `PlanCard.test.tsx` |

## 5. Contacto y cotización

| ID | Capa | Caso | Prioridad | Estado | Destino sugerido |
|---|---|---|---|---|---|
| WEB-CON-001 | Componente | Nombre y correo obligatorios muestran errores | P0 | Pass | `ContactRequestDialog.test.tsx` |
| WEB-CON-002 | Componente | Correo inválido no permite submit | P0 | Pass | `ContactRequestDialog.test.tsx` |
| WEB-CON-003 | Componente | Teléfono y mensaje opcionales pueden omitirse | P1 | Pass | `ContactRequestDialog.test.tsx` |
| WEB-CON-004 | Componente | Límites visibles de campos se respetan | P1 | Pass | `ContactRequestDialog.test.tsx` |
| WEB-CON-005 | Integración | Submit recorta textos y conserva `itemId` | P0 | Pass | `ContactRequestDialog.test.tsx` |
| WEB-CON-006 | Unitario | Servicio usa `/contact-requests` y payload esperado | P0 | Pass | `contact.service.test.ts` |
| WEB-CON-007 | Componente | Submit deshabilita controles mientras envía | P1 | Pass | `ContactRequestDialog.test.tsx` |
| WEB-CON-008 | Componente | Error general conserva formulario y muestra feedback | P0 | Pass | `ContactRequestDialog.test.tsx` |
| WEB-CON-009 | Componente | Errores API por campo se asignan al control correcto | P0 | Pass | `ContactRequestDialog.test.tsx` |
| WEB-CON-010 | Componente | Éxito muestra nombre, correo y fecha recibidos | P1 | Pass | `ContactSuccessDialog.test.tsx` |
| WEB-CON-011 | Componente | Formulario modificado pide confirmar descarte | P1 | Pass | `ContactRequestDialog.test.tsx` |
| WEB-CON-012 | Componente | Cerrar reinicia formulario y estado de envío | P1 | Pass | `ContactRequestDialog.test.tsx` |

## 6. Empleabilidad y postulación

| ID | Capa | Caso | Prioridad | Estado | Destino sugerido |
|---|---|---|---|---|---|
| WEB-EMP-001 | Unitario | Listado usa endpoint de vacantes publicadas y query | P0 | Pass | `employability.service.test.ts` |
| WEB-EMP-002 | Componente | Listado conserva metadata de paginación | P1 | Pass | `JobsPage.test.tsx` |
| WEB-EMP-003 | Componente | Loading, vacío, error y retry funcionan | P0 | Pass | `JobsPage.test.tsx` |
| WEB-EMP-004 | Unitario | Detalle sin id no solicita la API | P1 | Pass | `use-public-job-vacancy.test.ts` |
| WEB-EMP-005 | Componente | Detalle válido muestra la vacante | P0 | Pass | `JobDetailPage.test.tsx` |
| WEB-EMP-006 | Componente | Vacante inexistente muestra error y retry | P0 | Pass | `JobDetailPage.test.tsx` |
| WEB-EMP-007 | Componente | Campos obligatorios del formulario se validan | P0 | Pass | `ApplyDialog.test.tsx` |
| WEB-EMP-008 | Componente | Cédula, nombres, apellidos y correo inválidos muestran error | P0 | Pass | `ApplyDialog.test.tsx` |
| WEB-EMP-009 | Componente | No se puede enviar sin CV | P0 | Pass | `ApplyDialog.test.tsx` |
| WEB-EMP-010 | Componente | Se acepta PDF y se muestra su nombre | P0 | Pass | `UploadResumeField.test.tsx` |
| WEB-EMP-011 | Componente | Se rechaza MIME distinto de PDF | P0 | Pass | `ApplyDialog.test.tsx` |
| WEB-EMP-012 | Componente | Se rechaza PDF mayor a 20 MB | P0 | Pass | `ApplyDialog.test.tsx` |
| WEB-EMP-013 | Integración | `FormData` contiene archivo, vacante, candidato y carta | P0 | Pass | `use-apply-job-vacancy.test.ts` |
| WEB-EMP-014 | Integración | Submit recorta campos antes de enviar | P1 | Pass | `ApplyDialog.test.tsx` |
| WEB-EMP-015 | Componente | Estado submitting bloquea formulario | P1 | Pass | `ApplyDialog.test.tsx` |
| WEB-EMP-016 | Unitario | `NOT_FOUND` se transforma en mensaje de vacante no disponible | P0 | Pass | `use-apply-job-vacancy.test.ts` |
| WEB-EMP-017 | Unitario | `RATE_LIMITED` se transforma en mensaje de límite | P1 | Pass | `use-apply-job-vacancy.test.ts` |
| WEB-EMP-018 | Unitario | `MULTER_ERROR` distingue tamaño y tipo | P0 | Pass | `use-apply-job-vacancy.test.ts` |
| WEB-EMP-019 | Unitario | `CONFLICT` se transforma en duplicado de postulación | P0 | Pass | `use-apply-job-vacancy.test.ts` |
| WEB-EMP-020 | Componente | Errores de campos API se asignan al formulario | P0 | Pass | `ApplyDialog.test.tsx` |
| WEB-EMP-021 | Componente | Éxito muestra vacante, candidato y fecha | P1 | Pass | `ApplySuccessDialog.test.tsx` |
| WEB-EMP-022 | Componente | Cierre o éxito reinicia estado y formulario | P1 | Pass | `ApplyDialog.test.tsx` |
| WEB-EMP-023 | Componente | Cambios sin guardar piden confirmación | P1 | Pass | `ApplyDialog.test.tsx` |

## 7. CMS y contenido

| ID | Capa | Caso | Prioridad | Estado | Destino sugerido |
|---|---|---|---|---|---|
| WEB-CMS-001 | Unitario | Servicio lista secciones con endpoint correcto | P0 | Pass | `cms.service.test.ts` |
| WEB-CMS-002 | Componente | Loading inicial muestra skeleton | P1 | Pass | `CmsAdminPage.test.tsx` |
| WEB-CMS-003 | Componente | Error inicial muestra retry | P0 | Pass | `CmsAdminPage.test.tsx` |
| WEB-CMS-004 | Componente | Primera sección se selecciona automáticamente | P1 | Pass | `CmsAdminPage.test.tsx` |
| WEB-CMS-005 | Unitario | Listado envía página, límite, sección y búsqueda | P0 | Pass | `cms.service.test.ts` |
| WEB-CMS-006 | Componente | Búsqueda espera el debounce de 300 ms | P1 | Pass | `CmsAdminPage.test.tsx` |
| WEB-CMS-007 | Componente | Limpiar búsqueda elimina el filtro | P1 | Pass | `CmsSearchBar.test.tsx` |
| WEB-CMS-008 | Componente | Vacío y sin resultados muestran mensajes distintos | P1 | Pass | `CmsArchiveEmpty.test.tsx` |
| WEB-CMS-009 | Componente | Abrir bloque carga contenido actual | P0 | Pass | `CmsEditDialog.test.tsx` |
| WEB-CMS-010 | Componente | Texto se limita a 10 000 caracteres | P1 | Pass | `CmsEditDialog.test.tsx` |
| WEB-CMS-011 | Integración | Guardar texto usa PATCH y actualiza el bloque | P0 | Pass | `CmsAdminPage.test.tsx` |
| WEB-CMS-012 | Componente | Error de actualización conserva diálogo y muestra feedback | P0 | Pass | `CmsAdminPage.test.tsx` |
| WEB-CMS-013 | Componente | Bloque visual muestra carga de imagen | P0 | Pass | `CmsImageUploadField.test.tsx` |
| WEB-CMS-014 | Componente | PNG, JPEG, WEBP y AVIF son aceptados | P0 | Pass | `CmsImageUploadField.test.tsx` |
| WEB-CMS-015 | Componente | Formato no permitido se rechaza | P0 | Pass | `CmsAdminPage.test.tsx` |
| WEB-CMS-016 | Componente | Imagen mayor a 5 MB se rechaza | P0 | Pass | `CmsAdminPage.test.tsx` |
| WEB-CMS-017 | Componente | Preview y limpiar imagen funcionan | P1 | Pass | `CmsImageUploadField.test.tsx` |
| WEB-CMS-018 | Integración | Upload envía `contentKey` y FormData | P0 | Pass | `cms.service.test.ts` |
| WEB-CMS-019 | Integración | Upload exitoso refresca bloques y muestra toast | P0 | Pass | `CmsAdminPage.test.tsx` |
| WEB-CMS-020 | Componente | Guardar se deshabilita sin archivo o con error de imagen | P0 | Pass | `CmsEditDialog.test.tsx` |
| WEB-CMS-021 | Componente | Descarte conserva o elimina edición según decisión | P1 | Pass | `CmsAdminPage.test.tsx` |
| WEB-CMS-022 | Unitario | Contenido público pasa por sanitización | P0 | Pass | `sanitize.test.ts` |
| WEB-CMS-023 | Seguridad | HTML malicioso no queda ejecutable en la landing | P0 | Pass | `LandingPage.test.tsx` |

## 8. Estados, accesibilidad y navegación

| ID | Capa | Caso | Prioridad | Estado | Destino sugerido |
|---|---|---|---|---|---|
| WEB-UI-001 | Unitario | `PageLoader` muestra mensaje o skeleton según props | P1 | Pass | `page-loader.test.tsx` |
| WEB-UI-002 | Componente | `ErrorState` traduce códigos conocidos | P1 | Pass | `error-state.test.tsx` |
| WEB-UI-003 | Componente | Retry de `ErrorState` ejecuta callback | P1 | Pass | `error-state.test.tsx` |
| WEB-UI-004 | Componente | Inputs y dialogs tienen labels/títulos accesibles | P0 | Pass | `App.test.tsx`, layouts y dialogs |
| WEB-UI-005 | Componente | Errores exponen estado inválido observable | P1 | Pass | `ContactRequestDialog.test.tsx`, `ApplyDialog.test.tsx`, `CmsEditDialog.test.tsx` |
| WEB-UI-006 | Manual | Flujos principales funcionan en móvil y escritorio | P1 | Pendiente | [`REGISTRO_REVISION_MANUAL_UI.md`](./REGISTRO_REVISION_MANUAL_UI.md) |
| WEB-UI-007 | Manual | Teclado, foco, idioma y modo oscuro no rompen acciones | P1 | Pendiente | [`REGISTRO_REVISION_MANUAL_UI.md`](./REGISTRO_REVISION_MANUAL_UI.md) |
| WEB-UI-008 | Componente | Wildcard redirige a una ruta pública o CMS válida | P1 | Pass | `App.test.tsx` |

## 9. Integración HTTP con API

| ID | Capa | Caso | Prioridad | Estado | Destino sugerido |
|---|---|---|---|---|---|
| WEB-API-014 | Integración | Catálogo, CMS público y vacantes devuelven sobres exitosos compatibles con `request` y `requestPaginated` | P0 | Pass | `src/integration/public-api.contract.test.ts` |
| WEB-API-015 | Integración | `/auth/me` sin token devuelve 401 y CMS sin permiso devuelve 403; el cliente los transforma en `ApiError` | P0 | Pass | `src/integration/auth-permissions.contract.test.ts` |
| WEB-API-016 | Integración | Recurso público inexistente devuelve 404 `RESOURCE_NOT_FOUND` | P0 | Pass | `src/integration/public-api.contract.test.ts` |
| WEB-API-017 | Integración | Validación de contacto y postulación devuelve `details`/error envelope compatible | P0 | Pass | `src/integration/public-api.contract.test.ts` |
| WEB-CON-013 | Integración | Contacto válido persiste y devuelve la respuesta consumida por el frontend | P0 | Pass | `src/integration/mutation-api.contract.test.ts` |
| WEB-EMP-024 | Integración | Postulación válida envía multipart con PDF, candidato, vacante y carta | P0 | Pass | `src/integration/mutation-api.contract.test.ts` |
| WEB-CMS-024 | Integración | CMS autorizado lista, actualiza, verifica y restaura un bloque de texto | P0 | Pass | `src/integration/mutation-api.contract.test.ts` |
| WEB-CMS-025 | Integración | Upload de imagen actualiza el bloque y restaura el body usando storage de prueba | P1 | Pass | `src/integration/mutation-api.contract.test.ts` |

La suite es opt-in. Requiere `VITE_API_URL`, una cuenta con permisos CMS (`VITE_WEB_TEST_CMS_EMAIL`/`VITE_WEB_TEST_CMS_PASSWORD`) y una cuenta sin permisos CMS (`VITE_WEB_TEST_LIMITED_EMAIL`/`VITE_WEB_TEST_LIMITED_PASSWORD`). Las mutaciones requieren además `VITE_WEB_TEST_ALLOW_MUTATIONS=true`; el upload requiere `VITE_WEB_TEST_ALLOW_STORAGE_MUTATIONS=true`. Ninguna credencial se versiona.

## 10. End-to-end

| ID | Capa | Perfil | Journey | Prioridad | Estado |
|---|---|---|---|---|---|
| WEB-E2E-001 | E2E | Visitante | Catálogo → filtros → cotización/contacto | P0 | Pass |
| WEB-E2E-002 | E2E | Candidato | Vacantes → detalle → formulario inválido → PDF válido | P0 | Pass |
| WEB-E2E-003 | E2E | Administrador | Login → CMS → editar texto → verificar vista pública | P0 | Pass |
| WEB-E2E-004 | E2E | Administrador | CMS → imagen válida → guardar → verificar resultado | P1 | Not run |
| WEB-E2E-005 | E2E | Sin permiso | Intentar `/admin/cms` y confirmar denegación/redirección | P0 | Not run |
| WEB-E2E-006 | E2E | Visitante | Error de catálogo/contacto → retry → recuperación | P1 | Not run |

La demo ejecuta el alcance reducido `WEB-E2E-001..003` con Playwright; `WEB-E2E-004..006` quedan `Not run` para evitar ampliar innecesariamente la cobertura.

## 11. Regla de estado

Un caso solo puede marcarse `Pass` cuando el [registro de evidencia](./REGISTRO_EVIDENCIA_WEB.md) contiene comando o pasos reales, revisión/SHA, fecha, ambiente, resultado observado y artifact asociado.
