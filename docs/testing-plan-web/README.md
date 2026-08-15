# Plan de testing del frontend Web BOPACORP

Plan separado para elevar la cobertura y la evidencia de pruebas del frontend `bopacorp-web`, en coordinación con `bopacorp-api` y `@bopacorp/shared`.

## Archivos

- [`PLAN_TESTING_WEB.md`](./PLAN_TESTING_WEB.md): estrategia, alcance y ejecución por fases.
- [`MATRIZ_CASOS_PRUEBA_WEB.md`](./MATRIZ_CASOS_PRUEBA_WEB.md): casos de prueba, capa, requisito, prioridad y estado.
- [`REGISTRO_EVIDENCIA_WEB.md`](./REGISTRO_EVIDENCIA_WEB.md): plantilla para registrar comandos, cobertura, CI, aceptación, defectos y retests.

## Línea base comprobada

Al 15 de agosto de 2026, el repositorio tiene React 19, TypeScript, Vite, React Router, Axios, React Hook Form, Zod, shadcn/ui e i18n. No tiene runner de pruebas configurado, scripts `test`, archivos `*.test.*`/`*.spec.*`, suite de navegador ni evidencia de cobertura.

El alcance actual del Web es:

- sitio público y catálogo de servicios;
- formulario público de contacto/cotización;
- listado, detalle y postulación a vacantes con CV PDF;
- login y panel CMS protegido;
- edición de bloques de contenido e imágenes desde `/admin/cms`.

El CRM comercial, negociaciones, visitas, documentos internos, matrices y reportes pertenecen a `bopacorp-crm` y no se deben contar como cobertura de este repositorio.

## Meta

Alcanzar al menos 80% de cobertura del conjunto de código frontend crítico definido en el plan, con pruebas de decisión para autenticación/RBAC, frontera HTTP, filtros, validaciones de formularios, carga de archivos, estados de UI y edición CMS. La meta no se interpreta como 80% global de cada primitiva visual.

## Estado

Este paquete define el trabajo; no afirma que las fases estén ejecutadas. Cada resultado debe cerrarse con comando, SHA, fecha, ambiente, resultado y artifact verificable.

## Fuentes relacionadas

- [`docs/context/AUDITORIA_REQUISITOS_BOPADIGITAL.md`](../context/AUDITORIA_REQUISITOS_BOPADIGITAL.md)
- [`docs/requirements-compliance.md`](../requirements-compliance.md)
- [`../../../Bopadigital/06-project2p/requirements-test-traceability.md`](../../../Bopadigital/06-project2p/requirements-test-traceability.md), cuando el repositorio vecino esté disponible en la ruta esperada.
