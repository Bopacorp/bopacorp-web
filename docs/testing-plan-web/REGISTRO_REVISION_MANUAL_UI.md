# Registro de revisión manual UI — BOPACORP Web

Esta checklist cubre los casos que no pueden validarse de forma fiable con Vitest y `jsdom`: viewport real, CSS responsive, foco visual, contraste y persistencia visual del tema. No se ejecutó un servidor ni un navegador durante la Fase 6; por eso los resultados permanecen como `Not run`.

## Precondiciones

- [ ] `npm run dev` disponible con `VITE_API_URL` configurada en el ambiente de prueba.
- [ ] Backend de prueba accesible y datos públicos de catálogo/vacantes sembrados.
- [ ] Cuenta administrativa temporal disponible para el flujo CMS.
- [ ] Navegador con DevTools y captura de evidencia habilitados.

## Matriz manual

| ID | Viewport | Ruta | Flujo/check | Resultado esperado | Observado | Estado | Artifact |
|---|---:|---|---|---|---|---|---|
| WEB-UI-006-A | 375×812 | `/` | Header, navegación móvil, menú lateral y footer | No hay overflow horizontal; menú abre/cierra y los enlaces navegan | No ejecutado por el agente | Not run | — |
| WEB-UI-006-B | 375×812 | `/servicios` | Filtros, tarjetas, cotización y estados loading/error/vacío | Controles caben en pantalla y el diálogo no corta contenido | No ejecutado por el agente | Not run | — |
| WEB-UI-006-C | 375×812 | `/nosotros` | Contenido público y navegación móvil | Texto, imágenes y enlaces permanecen utilizables | No ejecutado por el agente | Not run | — |
| WEB-UI-006-D | 375×812 | `/empleos` | Lista, vacío/error, detalle y postulación | Formulario y carga de CV son utilizables sin zoom horizontal | No ejecutado por el agente | Not run | — |
| WEB-UI-006-E | 1280×800 | `/`, `/servicios`, `/nosotros`, `/empleos` | Header desktop, grids, footer y dialogs | Layout estable en escritorio; no aparecen elementos móviles incorrectos | No ejecutado por el agente | Not run | — |
| WEB-UI-007-A | 375×812 / 1280×800 | Rutas públicas | Tab, Shift+Tab, Enter, Escape y foco en menú/dialogs | Orden de foco lógico; Escape cierra sin perder datos; Enter no envía formularios inválidos | No ejecutado por el agente | Not run | — |
| WEB-UI-007-B | 375×812 / 1280×800 | Rutas públicas y `/admin/cms` | Cambiar idioma ES/EN y tema claro/oscuro/sistema | Copy, labels, contraste y controles siguen siendo utilizables | No ejecutado por el agente | Not run | — |

## Criterio de cierre

Cambiar cada fila a `Pass` solo con navegador, fecha, ambiente, revisión/SHA y screenshot/video asociado. Las pruebas automatizadas relacionadas están registradas en `REGISTRO_EVIDENCIA_WEB.md`; no sustituyen esta revisión visual.
