# Registro de evidencia de testing — BOPACORP Web

**Estado de Fase 5:** CMS, contenido, imágenes y sanitización ejecutados; se conserva la evidencia de Fases 1–4.
**Regla:** `Existente` o `Implementado` no significa `Pass`; el resultado debe observarse en una ejecución reproducible.

## 1. Identificación de la ejecución

| Campo | Valor |
|---|---|
| Repositorio Web | `bopacorp-web` |
| SHA Web | `a89b0b7` + working tree de Fase 5 |
| SHA API | No aplica para pruebas con dobles deterministas |
| SHA Shared | `0.3.2` instalado; no modificado |
| Rama | `main` |
| Fecha y hora | `2026-08-15T17:28:36-05:00` |
| Responsable | Agente Codex |
| Sistema operativo | Linux |
| Node | `v22.22.2` |
| npm | `10.9.7` |
| Navegador | Pendiente / no aplica |
| Ambiente | Local, Vitest con `jsdom` |
| Base URL | `http://test.local/api/v1` simulada por setup, sin backend real |
| Datos usados | Fixtures sintéticas de usuarios, tokens, permisos y respuestas API; sin credenciales reales |

## 2. Línea base de comandos

| Comando | Estado inicial | Fecha | SHA | Resultado | Artifact |
|---|---|---|---|---|---|
| `npm ci` | No ejecutado; se usó `npm install` para instalar el runner | 2026-08-15 | `1311e685edfc` | Not run | — |
| `npm run lint` | Pendiente | 2026-08-15 | `1311e685edfc` | Pass | Log de consola |
| `npx tsc -b --noEmit` | Pendiente | 2026-08-15 | `1311e685edfc` | Pass | Log de consola |
| `npm run build` | Pendiente | 2026-08-15 | `1311e685edfc` | Pass | `dist/` y log |
| `npm run test:run` | No configurado en baseline | 2026-08-15 | `1311e685edfc` | Pass | 1 archivo / 2 tests |
| `npm run test:coverage` | No configurado en baseline | 2026-08-15 | `1311e685edfc` | Pass | `coverage/index.html`, `coverage/lcov.info` |
| `npm run test:e2e` | No configurado en baseline | — | — | Not run | Pendiente de Fase 8 |

La instalación de Fase 1 se realizó con `npm install --save-dev vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`: agregó 94 paquetes y terminó correctamente. npm reportó 12 vulnerabilidades de auditoría (3 moderate, 9 high); no se ejecutó `npm audit fix` porque queda fuera del alcance de esta fase.

## 3. Registro de ejecuciones unit/component/integración

Copiar una fila por corrida significativa y conservar el log o artifact.

| ID corrida | Comando/suite | Alcance | Fecha | SHA | Resultado | Fallos | Artifact |
|---|---|---|---|---|---|---|---|
| WEB-RUN-001 | `npm run test:run` | Smoke de Vitest en `jsdom` y resolución del alias `@/` | 2026-08-15 | `1311e685edfc` | Pass | — | Consola: 1 archivo, 2 tests |
| WEB-RUN-002 | `npm run test:run` | Auth, RBAC, storage, JWT, Login y API boundary | 2026-08-15 | `5e1b103cc128` + WT | Pass | — | Consola: 15 archivos, 58 tests |
| WEB-RUN-003 | `npm run test:run` | Regresión completa más catálogo público, filtros, PlanCard, cotización y contacto | 2026-08-15 | `b9078e7` + WT | Pass | — | Consola: 24 archivos, 85 tests |
| WEB-RUN-004 | `npm run test:run` | Regresión completa más empleabilidad, detalle de vacante, postulación, CV y errores API | 2026-08-15 | `b9078e7` + WT | Pass | — | Consola: 33 archivos, 124 tests |
| WEB-RUN-005 | `npm run test:run` | Regresión completa más CMS, contenido, edición de texto/imágenes y sanitización | 2026-08-15 | `a89b0b7` + WT | Pass | — | Consola: 45 archivos, 166 tests |

## 4. Registro de cobertura

La cobertura debe indicar exactamente qué archivos fueron incluidos. No reportar un porcentaje sin el denominador.

| ID | Comando | Include/exclude | Lines | Functions | Branches | Statements | SHA | Artifact |
|---|---|---|---:|---:|---:|---:|---|---|
| WEB-COV-001 | `npm run test:coverage` | `coverageInclude` y `coverageExclude` definidos en `vite.config.ts`; detalle abajo | 1.28% (13/1010) | 0% (0/308) | 0.25% (2/791) | 1.17% (13/1106) | `1311e685edfc` | `coverage/index.html`, `coverage/lcov.info` |
| WEB-COV-002 | `npm run test:coverage` | Mismo conjunto crítico; suites de Fase 2 agregadas al smoke baseline | 24.77% (250/1009) | 20.77% (64/308) | 15.67% (124/791) | 23.64% (261/1104) | `5e1b103cc128` + WT | `coverage/index.html`, `coverage/lcov.info` |
| WEB-COV-003 | `npm run test:coverage` | Mismo conjunto crítico; suites de Fase 3 agregadas | 47.08% (476/1011) | 43.83% (135/308) | 33.58% (267/795) | 45.52% (504/1107) | `b9078e7` + WT | `coverage/index.html`, `coverage/lcov.info` |
| WEB-COV-004 | `npm run test:coverage` | Mismo conjunto crítico; suites de Fase 4 agregadas | 66.10% (669/1012) | 64.28% (198/308) | 63.14% (502/795) | 64.71% (717/1108) | `b9078e7` + WT | `coverage/lcov-report/index.html`, `coverage/lcov.info` |
| WEB-COV-005 | `npm run test:coverage` | Mismo conjunto crítico; suites de Fase 5 agregadas | 89.82% (909/1012) | 89.61% (276/308) | 78.61% (625/795) | 87.81% (973/1108) | `a89b0b7` + WT | `coverage/lcov-report/index.html`, `coverage/lcov.info` |

El `include` de cobertura comprende `src/App.tsx`, `src/services/**/*.ts`, los módulos de autenticación, administración, catálogo, contacto, empleabilidad y CMS, las páginas/hooks públicos priorizados y los helpers compartidos listados en `vite.config.ts`. El `exclude` omite `src/test/**`, tests, declaraciones, assets y primitivas `src/components/ui/**`. La cobertura de Fase 5 sube a 89.82% en líneas (909/1012), con 87.81% de statements (973/1108); continúa como métrica informativa hasta revisar el conjunto crítico, branches y E2E en la Fase 9.

### Archivos críticos no cubiertos

| Archivo | Líneas/decisiones | Riesgo | Caso pendiente | Acción |
|---|---|---|---|---|
| `src/App.tsx`, `src/services/**` y módulos críticos incluidos | Líneas globales sobre 80% después de Fase 5, pero branches globales en 78.61% y sin E2E/API coordinado | UI transversal, contratos reales y journeys de navegador aún no tienen evidencia | Implementar WEB-UI, contratos coordinados y WEB-E2E; revisar decisiones restantes | Completar Fases 6–8 y activar el gate final en Fase 9 |
| `AuthContext.tsx`, `LoginPage.tsx`, `api.ts`, `auth.service.ts` | Ramas restantes: AuthContext 79.16%, LoginPage 78.26%, API 72.22%; `auth.service.ts` cubre wrappers parcialmente | Decisiones residuales de transporte y errores no cambian el resultado de los casos P0 ejecutados | Revisar líneas no cubiertas antes del gate final | Mantener gate informativo en Fase 2 y cerrar cobertura crítica en Fase 9 |

## 5. Registro de aceptación E2E

Cada ejecución debe registrar precondiciones y resultado observado, no solo una captura.

| ID | Rol | Ambiente | Precondiciones | Resultado esperado | Resultado observado | Estado | Evidencia | Retest |
|---|---|---|---|---|---|---|---|---|
| WEB-E2E-001 | Visitante | Pendiente | Catálogo sembrado | Filtra y envía contacto | Pendiente | Not run | — | — |
| WEB-E2E-002 | Candidato | Pendiente | Vacante y PDF de prueba | Valida y recibe confirmación | Pendiente | Not run | — | — |
| WEB-E2E-003 | Administrador | Pendiente | Cuenta CMS y bloque de prueba | Edita texto y se refleja | Pendiente | Not run | — | — |
| WEB-E2E-004 | Administrador | Pendiente | Bloque visual y storage | Sube imagen y refresca | Pendiente | Not run | — | — |
| WEB-E2E-005 | Sin permiso | Pendiente | Usuario sin permiso CMS | Deniega o redirige | Pendiente | Not run | — | — |
| WEB-E2E-006 | Visitante | Pendiente | Error controlado/retry | Recupera el flujo | Pendiente | Not run | — | — |

## 6. Registro de casos ejecutados

| Caso | Requisito | Riesgo | Archivo/suite | Fecha | SHA | Esperado | Observado | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|---|
| WEB-AUTH-001..015 | Auth, RBAC y sesión | P0/P1 | `LoginPage.test.tsx`, `AuthContext.test.tsx`, guards, permission, JWT y storage suites | 2026-08-15 | `5e1b103cc128` + WT | Flujos válidos, inválidos, no autorizados y públicos se comportan según la matriz | 15 archivos de suite ejecutados; todos los casos seleccionados pasan | Pass | `WEB-RUN-002`, `WEB-COV-002` |
| WEB-API-001..013 | Configuración y Axios boundary | P0/P1 | `api-config.test.ts`, `api.test.ts`, `auth.service.test.ts` | 2026-08-15 | `5e1b103cc128` + WT | Envelopes, errores, headers, refresh único/concurrente y expiración se comportan según la matriz | 15 archivos de suite ejecutados; todos los casos seleccionados pasan | Pass | `WEB-RUN-002`, `WEB-COV-002` |
| WEB-CAT-001..013 | Catálogo público, filtros y tarjetas | P0/P1 | `catalog.service.test.ts`, hooks, `ServicesPage.test.tsx`, `PlanCard.test.tsx` | 2026-08-15 | `b9078e7` + WT | Endpoints, filtros, valores `0`, loading, vacío, error/retry, URL, cancelación, reloading, detalles, cotización y WhatsApp se comportan según la matriz | 5 suites nuevas dentro de 24 archivos; todos los casos de catálogo pasan | Pass | `WEB-RUN-003`, `WEB-COV-003` |
| WEB-CON-001..012 | Contacto y cotización | P0/P1 | `contact.service.test.ts`, `use-contact-request.test.ts`, `ContactRequestDialog.test.tsx`, `ContactSuccessDialog.test.tsx` | 2026-08-15 | `b9078e7` + WT | Validación, límites, trim, itemId, submit, estados, errores generales/campo, éxito, descarte y reset se comportan según la matriz | 4 suites nuevas dentro de 24 archivos; todos los casos de contacto pasan | Pass | `WEB-RUN-003`, `WEB-COV-003` |
| WEB-EMP-001..023 | Empleabilidad y postulación | P0/P1 | `employability.service.test.ts`, hooks de vacantes/postulación, `JobsPage.test.tsx`, `JobDetailPage.test.tsx`, `ApplyDialog.test.tsx`, `UploadResumeField.test.tsx`, `ApplySuccessDialog.test.tsx` | 2026-08-15 | `b9078e7` + WT | Endpoint y query, paginación, loading/vacío/error/retry, detalle, validación, PDF, tamaño, FormData, trim, submitting, errores API, éxito, reset y descarte se comportan según la matriz | 9 suites nuevas dentro de 33 archivos; los 23 casos de empleabilidad pasan | Pass | `WEB-RUN-004`, `WEB-COV-004` |
| WEB-CMS-001..023 | CMS, contenido, imágenes y sanitización | P0/P1 | `cms.service.test.ts`, hooks CMS, `CmsAdminPage.test.tsx`, componentes CMS, `sanitize.test.ts`, `use-cms-landing.test.ts`, `LandingPage.test.tsx` | 2026-08-15 | `a89b0b7` + WT | Secciones, paginación, búsqueda/debounce, estados vacío/error, edición de texto, límites, descarte, validación y upload de imágenes, refresh, toasts y seguridad de contenido se comportan según la matriz | 12 suites nuevas dentro de 45 archivos; los 23 casos CMS pasan | Pass | `WEB-RUN-005`, `WEB-COV-005` |

## 7. Registro de defectos y retests

| Defecto | Caso afectado | Síntoma | Ambiente | Fix SHA | Fecha fix | Retest SHA | Resultado retest | Evidencia |
|---|---|---|---|---|---|---|---|---|
| WEB-DEF-001 | WEB-AUTH-005, WEB-AUTH-015, WEB-API-013 | `AuthContext` usaba prefijos ingleses y `window.location.pathname`, por lo que rutas españolas y eventos bajo MemoryRouter podían tratarse como protegidos | Local/jsdom | `5e1b103cc128 + WT` | 2026-08-15 | `5e1b103cc128 + WT` | Pass: rutas `/servicios`, `/nosotros`, `/empleos` y token refresh event cubiertos | `WEB-RUN-002` |
| WEB-DEF-002 | WEB-CAT-001..003, WEB-CAT-008..009 | `usePublicCatalogItems` descartaba `categorySlug`, por lo que una consulta por slug podía perder el filtro antes de resolver el ID; además faltaba la regresión de respuesta tardía | Local/jsdom | `b9078e7 + WT` | 2026-08-15 | `b9078e7 + WT` | Pass: slug, precio `0`, navegación y cancelación cubiertos; el hook conserva el filtro | `WEB-RUN-003`, `WEB-COV-003` |
| WEB-DEF-003 | WEB-EMP-013..014 | El hook comprobaba `coverLetter.trim()` pero enviaba el valor original; el diálogo también podía entregar espacios sin recortar | Local/jsdom | `b9078e7 + WT` | 2026-08-15 | `b9078e7 + WT` | Pass: `FormData` omite cartas en blanco y envía la carta recortada; el diálogo recorta antes del submit | `WEB-RUN-004`, `WEB-COV-004` |

## 8. Registro de limitaciones y bloqueos

| ID | Limitación/bloqueo | Impacto | Responsable | Mitigación | Estado |
|---|---|---|---|---|---|
| WEB-BLOCK-001 | No existe runner de pruebas en la línea base | No se podía medir cobertura | Equipo Web | Ejecutar Fase 1 | Cerrado en Fase 1 |
| WEB-BLOCK-002 | Ambiente/API/storage de prueba no confirmado | Bloquea integración y E2E | Equipo API/Infra | Crear ambiente reproducible | Abierto |
| WEB-BLOCK-003 | Cuentas CMS de prueba no confirmadas | Bloquea RBAC y E2E administrativo | Equipo Web | Crear cuentas temporales | Abierto |
| WEB-BLOCK-004 | Correo real no verificado | No permite afirmar confirmación posterior | Equipo API | Probar proveedor o declarar futuro | Abierto |
| WEB-BLOCK-005 | La etiqueta de teléfono del diálogo indica “opcional”, pero `ApplyJobVacancyFormSchema` del paquete shared lo exige | La prueba local sigue el contrato instalado; requiere decisión de contrato/copy antes de afirmar opcionalidad | Equipo Web/API/Shared | Mantener la validación requerida y resolver la discrepancia antes de E2E | Abierto |

## 9. Evidencia mínima por caso

Antes de marcar `Pass`, verificar:

- [ ] el caso está relacionado con un requisito y riesgo;
- [ ] existe ruta de código actual;
- [ ] se ejecutó en una revisión conocida;
- [ ] se registraron fecha, ambiente y responsable;
- [ ] el resultado observado coincide con el esperado;
- [ ] existe screenshot, video, log, reporte o artifact adecuado;
- [ ] cualquier defecto tiene fix SHA y retest;
- [ ] no se exponen contraseñas, tokens ni datos personales reales.

## 10. Convención de artifacts

Usar nombres que permitan identificar escenario, fecha y commit:

```text
WEB-<ID>-<YYYY-MM-DD>-<short-sha>.png
WEB-<ID>-<YYYY-MM-DD>-<short-sha>.webm
WEB-<ID>-<YYYY-MM-DD>-<short-sha>.json
WEB-coverage-<YYYY-MM-DD>-<short-sha>.zip
```

Los artifacts deben quedar vinculados al caso y no reemplazar la descripción del resultado observado.

## 11. Criterio de cierre del registro

El registro queda listo para informe cuando cada caso seleccionado tiene resultado `Pass`, `Fail`, `Blocked` o `Not run`, y cualquier afirmación de funcionalidad está respaldada por SHA, fecha, ambiente y evidencia actual.
