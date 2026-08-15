# Registro de evidencia de testing — BOPACORP Web

**Estado de Fase 1:** runner, smoke test, cobertura y validaciones de calidad ejecutados.
**Regla:** `Existente` o `Implementado` no significa `Pass`; el resultado debe observarse en una ejecución reproducible.

## 1. Identificación de la ejecución

| Campo | Valor |
|---|---|
| Repositorio Web | `bopacorp-web` |
| SHA Web | `1311e685edfc` |
| SHA API | No aplica para Fase 1 |
| SHA Shared | No aplica para Fase 1 |
| Rama | `main` |
| Fecha y hora | `2026-08-15T15:37:40-05:00` |
| Responsable | Agente Codex |
| Sistema operativo | Linux |
| Node | `v22.22.2` |
| npm | `10.9.7` |
| Navegador | Pendiente / no aplica |
| Ambiente | Local, Vitest con `jsdom` |
| Base URL | `http://test.local/api/v1` simulada por setup, sin backend real |
| Datos usados | Smoke test sintético; no usa datos personales ni credenciales |

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

## 4. Registro de cobertura

La cobertura debe indicar exactamente qué archivos fueron incluidos. No reportar un porcentaje sin el denominador.

| ID | Comando | Include/exclude | Lines | Functions | Branches | Statements | SHA | Artifact |
|---|---|---|---:|---:|---:|---:|---|---|
| WEB-COV-001 | `npm run test:coverage` | `coverageInclude` y `coverageExclude` definidos en `vite.config.ts`; detalle abajo | 1.28% (13/1010) | 0% (0/308) | 0.25% (2/791) | 1.17% (13/1106) | `1311e685edfc` | `coverage/index.html`, `coverage/lcov.info` |

El `include` de cobertura comprende `src/App.tsx`, `src/services/**/*.ts`, los módulos de autenticación, administración, catálogo, contacto, empleabilidad y CMS, las páginas/hooks públicos priorizados y los helpers compartidos listados en `vite.config.ts`. El `exclude` omite `src/test/**`, tests, declaraciones, assets y primitivas `src/components/ui/**`. La cobertura es una línea base: todavía no se aplica el umbral de 80% porque los casos de negocio se implementan en las fases siguientes.

### Archivos críticos no cubiertos

| Archivo | Líneas/decisiones | Riesgo | Caso pendiente | Acción |
|---|---|---|---|---|
| `src/App.tsx`, `src/services/**` y módulos críticos incluidos | Cobertura de línea base menor al 80% con solo smoke tests | Autenticación, contratos HTTP y flujos de negocio aún no tienen casos dirigidos | Implementar casos WEB-AUTH, WEB-API, WEB-CAT, WEB-CON, WEB-EMP y WEB-CMS | Añadir suites por riesgo en Fases 2–7 y activar el gate al completar el alcance crítico |

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
| Pendiente | Pendiente | Pendiente | Pendiente | — | — | — | — | Not run | — |

## 7. Registro de defectos y retests

| Defecto | Caso afectado | Síntoma | Ambiente | Fix SHA | Fecha fix | Retest SHA | Resultado retest | Evidencia |
|---|---|---|---|---|---|---|---|---|
| Pendiente | Pendiente | — | — | — | — | — | Not run | — |

## 8. Registro de limitaciones y bloqueos

| ID | Limitación/bloqueo | Impacto | Responsable | Mitigación | Estado |
|---|---|---|---|---|---|
| WEB-BLOCK-001 | No existe runner de pruebas en la línea base | No se podía medir cobertura | Equipo Web | Ejecutar Fase 1 | Cerrado en Fase 1 |
| WEB-BLOCK-002 | Ambiente/API/storage de prueba no confirmado | Bloquea integración y E2E | Equipo API/Infra | Crear ambiente reproducible | Abierto |
| WEB-BLOCK-003 | Cuentas CMS de prueba no confirmadas | Bloquea RBAC y E2E administrativo | Equipo Web | Crear cuentas temporales | Abierto |
| WEB-BLOCK-004 | Correo real no verificado | No permite afirmar confirmación posterior | Equipo API | Probar proveedor o declarar futuro | Abierto |

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
