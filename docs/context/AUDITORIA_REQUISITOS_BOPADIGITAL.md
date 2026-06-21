# Auditoría de Requisitos — BOPADIGITAL

**Fecha:** 17 de junio de 2026
**Repositorios auditados:** `bopacorp-api`, `bopacorp-crm`, `bopacorp-web`
**Documento de referencia:** BOPADIGITAL Requirements Specification Document (Nov 2025)

---

## Leyenda

- ✅ Implementado completamente
- ⚠️ Parcial — backend o frontend existe pero incompleto
- ❌ No implementado

---

## 1. Sitio Web Público — CAT (Catálogo de Servicios y Sitio Web)

| ID | Requisito | API | Web | Estado |
|---|---|---|---|---|
| RF-CAT-001 | Catálogo organizado por categorías (Voz, Conectividad, Digitales) | ✅ Catálogo completo + categorías jerárquicas | ⚠️ 6 tarjetas estáticas sin integración con backend | **⚠️ Parcial** |
| RF-CAT-002 | Ver costos, beneficios y condiciones por servicio | ✅ Precio, beneficios, condiciones legales/temporales/edad | ❌ Sin páginas de detalle | **❌ Falta frontend** |
| RF-CAT-003 | Filtrar por categoría, cobertura y precio | ✅ API soporta filtros | ❌ Sin filtros en ServicesPage | **❌ Falta frontend** |
| RF-CAT-004 | Contactar asesor para iniciar negociación | ✅ Endpoint público contact-requests | ⚠️ Botones CTA existen pero sin funcionalidad real | **⚠️ Parcial** |
| RF-CAT-005 | Ver historia, misión, visión y valores de BOPACORP | ✅ Bloques de contenido CMS | ✅ AboutPage con contenido CMS | **✅ Listo** |

**Puntaje CAT: 1/5 completo, 2 parciales, 2 faltantes**

---

## 2. Sitio Web Público — CMS (Gestión de Contenido)

| ID | Requisito | API | Web/CRM | Estado |
|---|---|---|---|---|
| RF-CMS-001 | Acceso al panel de administración con credenciales | ✅ Autenticación JWT | ✅ LoginPage + RequireAuth | **✅ Listo** |
| RF-CMS-002 | Editar textos, imágenes y enlaces del sitio web | ✅ CRUD de bloques de contenido + carga de imágenes | ✅ Panel CMS con diálogo de edición | **✅ Listo** |
| RF-CMS-003 | Crear nuevos productos y servicios en el catálogo | ✅ POST catalog-items | ✅ CRM: CatalogItemCreatePage | **✅ Listo** |
| RF-CMS-004 | Actualizar información de productos existentes | ✅ PATCH catalog-items | ✅ CRM: Edición en detalle de catálogo | **✅ Listo** |
| RF-CMS-005 | Eliminar productos y servicios del catálogo | ✅ DELETE catalog-items | ✅ CRM: Acción de eliminación | **✅ Listo** |

**Puntaje CMS: 5/5 completo**

---

## 3. Sitio Web Público — EMP (Empleabilidad y Postulaciones)

| ID | Requisito | API | Web | Estado |
|---|---|---|---|---|
| RF-EMP-001 | Ver vacantes disponibles (título, descripción, requisitos, fecha) | ✅ GET /vacancies/published | ✅ JobsPage + JobDetailPage | **✅ Listo** |
| RF-EMP-002 | Formulario de postulación con datos personales | ✅ POST /apply | ✅ ApplyDialog con todos los campos | **✅ Listo** |
| RF-EMP-003 | Subir CV en formato PDF | ✅ Carga de PDF (50MB) | ✅ UploadResumeField (PDF, 5MB) | **✅ Listo** |
| RF-EMP-004 | Validar campos obligatorios antes de enviar | ✅ Validación Zod | ✅ Validación en cliente | **✅ Listo** |
| RF-EMP-005 | Notificación visual y por correo al enviar postulación | ✅ Respuesta visual | ⚠️ Visual ✅, Correo ❌ | **⚠️ Falta correo** |
| RF-EMP-006 | Informar al candidato del resultado de su postulación | ✅ Gestión de estados | ❌ Sin notificación por correo | **❌ Falta correo** |

**Puntaje EMP: 4/6 completo, 1 parcial, 1 faltante (ambos por correo electrónico)**

---

## 4. Aplicación Interna — CRM (Gestión de Relación con Clientes)

| ID | Requisito | API | CRM Frontend | Estado |
|---|---|---|---|---|
| RF-CRM-001 | Registrar cliente (RUC, razón social, servicios, facturación) | ✅ | ✅ CreateBusinessClientDialog | **✅ Listo** |
| RF-CRM-002 | Actualizar información de clientes asignados | ✅ | ✅ Edición en panel lateral | **✅ Listo** |
| RF-CRM-003 | Filtrar/buscar por etapa de negociación o fecha de visita | ✅ | ⚠️ Filtro por estado ✅, fecha de visita solo ordenamiento | **⚠️ Parcial** |
| RF-CRM-004 | Programar visitas presenciales | ✅ | ✅ CreateVisitDialog | **✅ Listo** |
| RF-CRM-005 | Registrar visita con fecha, hora, observaciones y GPS | ✅ Campos GPS en BD | ⚠️ Formulario existe, captura GPS automática no confirmada | **⚠️ Parcial** |
| RF-CRM-006 | Supervisor ve ubicación GPS por visita | ✅ GPS almacenado | ⚠️ Datos mostrados, sin visualización en mapa | **⚠️ Parcial** |
| RF-CRM-007 | Ver historial de visitas | ✅ | ✅ VisitsTab | **✅ Listo** |
| RF-CRM-008 | Actualizar estado de negociación | ✅ | ✅ ChangeStateDialog + Kanban drag-and-drop | **✅ Listo** |
| RF-CRM-009 | Supervisor registra nuevos clientes | ✅ | ✅ Con control de permisos | **✅ Listo** |
| RF-CRM-010 | Supervisor actualiza información de clientes | ✅ | ✅ | **✅ Listo** |
| RF-CRM-011 | Supervisor desactiva clientes | ✅ Soft delete + isActive | ✅ Acción de eliminación | **✅ Listo** |
| RF-CRM-012 | Supervisor asigna clientes a asesores | ✅ Campo advisorId | ⚠️ Sin UI dedicada de asignación | **⚠️ Parcial** |
| RF-CRM-013 | Supervisor ve clientes por asesor | ✅ | ✅ Filtro por asesor | **✅ Listo** |
| RF-CRM-014 | Supervisor remueve clientes del portafolio del asesor | ✅ Setear advisorId=null | ⚠️ Sin acción explícita de "desasignar" | **⚠️ Parcial** |
| RF-CRM-015 | Supervisor ve actividad reciente de todos los asesores | ⚠️ Sin endpoint de feed de actividad | ⚠️ OverviewPage es placeholder | **⚠️ Parcial** |
| RF-CRM-016 | Gerencia: contactos/visitas/cierres por asesor | ❌ Sin endpoint de agregación | ⚠️ KPIs placeholder | **❌ Faltante** |
| RF-CRM-017 | Gerencia: monto facturado, servicios vendidos, ingreso promedio | ❌ Sin endpoint | ❌ | **❌ Faltante** |
| RF-CRM-018 | Gerencia: terminales/equipos vendidos por asesor | ❌ | ❌ | **❌ Faltante** |
| RF-CRM-019 | Gerencia: clientes por etapa del embudo por asesor | ⚠️ Datos consultables | ⚠️ Kanban por estado, sin agregación por asesor | **⚠️ Parcial** |
| RF-CRM-020 | Supervisor: filtrar por etapa, fecha, asesor | ✅ | ✅ Filtros existentes | **✅ Listo** |
| RF-CRM-021 | Asesores solo ven/modifican sus propios clientes | ✅ Basado en permisos | ✅ Auto-filtrado por ID de usuario | **✅ Listo** |
| RF-CRM-022 | Supervisor ve historial de modificaciones por asesor | ✅ Tabla audit_logs | ❌ Sin UI para log de auditoría | **❌ Faltante** |

**Puntaje CRM: 11/22 completo, 7 parciales, 4 faltantes**

---

## 5. Aplicación Interna — MAT (Matriz de Oferta)

| ID | Requisito | API | CRM Frontend | Estado |
|---|---|---|---|---|
| RF-MAT-001 | Crear matriz vinculada a cliente/negociación | ✅ | ⚠️ Solo vista de detalle, creación "próximamente" | **⚠️ Parcial** |
| RF-MAT-002 | Ingresar servicios/productos con cantidades, precios, totales | ✅ CRUD de líneas | ⚠️ Solo lectura, CRUD pendiente | **⚠️ Parcial** |
| RF-MAT-003 | Cálculo automático de subsidio | ✅ Campos existentes | ⚠️ Lógica de auto-cálculo no confirmada | **⚠️ Parcial** |
| RF-MAT-004 | Adjuntar archivos (PDF, Excel, JPG, PNG, 50MB) | ✅ CRUD de adjuntos | ⚠️ Solo vista | **⚠️ Parcial** |
| RF-MAT-005 | Guardar matrices como borradores | ✅ Estado DRAFT | ⚠️ Sin flujo de creación = sin flujo de borrador | **⚠️ Parcial** |
| RF-MAT-006 | Enviar para aprobación (→ Pendiente de Aprobación) | ✅ Endpoint de cambio de estado | ⚠️ Sin UI de cambio de estado | **⚠️ Parcial** |
| RF-MAT-007 | Ver historial de matrices | ✅ Endpoint de historial | ⚠️ Pestaña de historial existe | **⚠️ Parcial** |

**Puntaje MAT: 0/7 completo, 7 parciales (API lista, frontend mayormente solo lectura)**

---

## 6. Aplicación Interna — SUP (Supervisión y Aprobaciones)

| ID | Requisito | API | CRM Frontend | Estado |
|---|---|---|---|---|
| RF-SUP-001 | Ver matrices pendientes de aprobación | ✅ Filtro por estado | ⚠️ Sin vista dedicada de cola de pendientes | **⚠️ Parcial** |
| RF-SUP-002 | Revisar indicadores comerciales por matriz | ✅ Datos disponibles | ⚠️ MatrixDetailPage muestra parcialmente | **⚠️ Parcial** |
| RF-SUP-003 | Aprobar/rechazar con razón obligatoria de rechazo | ✅ Campo supervisorMessage | ⚠️ Sin UI de aprobar/rechazar | **⚠️ Parcial** |
| RF-SUP-004 | Ver historial de aprobaciones/rechazos | ✅ Endpoint de historial | ⚠️ Historial existe | **⚠️ Parcial** |
| RF-SUP-005 | Asesor notificado al aprobar/rechazar | ⚠️ Módulo de notificaciones existe, trigger automático incierto | ❌ Sin correo | **⚠️ Parcial** |
| RF-SUP-006 | Filtrar matrices por asesor, fecha, estado, subsidio | ✅ | ⚠️ UI de filtros no clara | **⚠️ Parcial** |

**Puntaje SUP: 0/6 completo, 6 parciales (bloqueado por gaps de MAT frontend)**

---

## 7. Aplicación Interna — DOC (Gestión Documental)

| ID | Requisito | API | CRM Frontend | Estado |
|---|---|---|---|---|
| RF-DOC-001 | Adjuntar documentos a negociaciones | ✅ | ✅ DocumentUploadDialog | **✅ Listo** |
| RF-DOC-002 | Subir archivos hasta 50MB (PDF, JPG, PNG) | ✅ | ✅ | **✅ Listo** |
| RF-DOC-003 | Etiquetar cada documento por tipo | ✅ documentTypeId | ✅ Selector de tipo | **✅ Listo** |
| RF-DOC-004 | Coordinador define documentos obligatorios/opcionales | ✅ Campo isMandatory | ❌ Sin UI de administración de requisitos documentales | **⚠️ Parcial** |
| RF-DOC-005 | Consultar estado de documentación durante negociación | ✅ | ✅ NegotiationDocumentsTab | **✅ Listo** |
| RF-DOC-006 | Coordinador revisa documentos subidos | ✅ | ✅ Acciones aprobar/rechazar | **✅ Listo** |
| RF-DOC-007 | Descargar documentos individual o masivamente | ✅ Endpoint de descarga | ⚠️ Individual ✅, masiva ❌ | **⚠️ Parcial** |
| RF-DOC-008 | Notificación al revisar/aprobar/rechazar documentos | ⚠️ Notificaciones existen, trigger automático incierto | ❌ Sin correo | **⚠️ Parcial** |
| RF-DOC-009 | Ver asesores con documentos pendientes | ❌ Sin endpoint | ❌ Sin UI | **❌ Faltante** |

**Puntaje DOC: 5/9 completo, 3 parciales, 1 faltante**

---

## 8. Aplicación Interna — REP (Reportería)

| ID | Requisito | API | CRM Frontend | Estado |
|---|---|---|---|---|
| RF-REP-001 | Reportes de rendimiento por asesor/periodo | ⚠️ Exports existen, sin computación real | ⚠️ Placeholder | **⚠️ Parcial** |
| RF-REP-002 | Supervisor: reportes de ventas/cierres con filtros | ⚠️ | ⚠️ Placeholder | **⚠️ Parcial** |
| RF-REP-003 | Métricas clave (ventas, cierres, visitas, tiempo promedio) | ❌ Sin endpoint de métricas computadas | ⚠️ KPI cards placeholder | **❌ Faltante** |
| RF-REP-004 | Supervisor: métricas operativas | ❌ | ⚠️ Placeholder | **❌ Faltante** |
| RF-REP-005 | Comparar rendimiento vs objetivos | ✅ CRUD de objetivos de venta | ⚠️ Placeholder | **⚠️ Parcial** |
| RF-REP-006 | Gerente exporta reportes PDF/Excel | ⚠️ Endpoint de export existe | ⚠️ Descarga placeholder | **⚠️ Parcial** |
| RF-REP-007 | Supervisor exporta reportes PDF/Excel | Igual que arriba | Igual | **⚠️ Parcial** |
| RF-REP-008 | Visualización con gráficos/KPIs | ✅ Recharts instalado | ⚠️ Sin gráficos reales aún | **⚠️ Parcial** |
| RF-REP-009 | Acceso a reportes basado en roles | ✅ Sistema de permisos | ✅ Verificación de permisos | **✅ Listo** |
| RF-REP-010 | Asesor ve su propio rendimiento | ✅ Datos filtrables por asesor | ⚠️ Overview KPIs placeholder | **⚠️ Parcial** |

**Puntaje REP: 1/10 completo, 7 parciales, 2 faltantes**

---

## 9. Aplicación Interna — SEG (Seguridad Básica)

| ID | Requisito | API | CRM Frontend | Estado |
|---|---|---|---|---|
| RF-SEG-001 | Autenticación con usuario y contraseña | ✅ JWT + bcrypt | ✅ LoginPage | **✅ Listo** |
| RF-SEG-002 | Permisos según rol del usuario | ✅ RBAC completo (roles, permisos, módulos) | ✅ Componente Can + usePermission | **✅ Listo** |
| RF-SEG-003 | Rol Gerente hereda privilegios de Supervisor | ✅ Sistema de roles soporta herencia | ✅ | **✅ Listo** |

**Puntaje SEG: 3/3 completo**

---

## 10. Aplicación Interna — NOT (Notificaciones)

| ID | Requisito | API | CRM Frontend | Estado |
|---|---|---|---|---|
| RF-NOT-001 | Notificaciones internas y por correo en eventos (aprobaciones, rechazos, revisiones) | ⚠️ CRUD existe, triggers automáticos no implementados, correo ❌ | ❌ Sin UI de notificaciones (sin ícono de campana, sin centro de notificaciones) | **❌ Faltante** |
| RF-NOT-002 | Ver historial de notificaciones recibidas | ✅ GET /notifications | ❌ Sin centro de notificaciones | **❌ Faltante** |

**Puntaje NOT: 0/2 completo, 2 faltantes**

---

## 11. Requisitos No Funcionales Clave

| ID | Requisito | Estado | Notas |
|---|---|---|---|
| RNF-001 | Tiempo de respuesta < 3s con 50 usuarios | ⚠️ | Sin pruebas de carga realizadas |
| RNF-002 | 99% disponibilidad en horario laboral | ⚠️ | Depende de infraestructura de despliegue |
| RNF-003 | Escalar de 7 a 25 asesores | ⚠️ | Sin pruebas de carga |
| RNF-004 | Contraseñas hasheadas con bcrypt + sal + mín 12 caracteres | ✅ | API usa bcrypt |
| RNF-005 | HTTPS con TLS 1.3 | ⚠️ | Configuración de despliegue, no verificado |
| RNF-006 | Compatibilidad Android 10-16, iOS 13-16.1, Chrome/Firefox/Edge | ⚠️ | Sin pruebas cross-browser/device (no existe app móvil) |
| RNF-007 | Responsive 360-1440px + WCAG 2.1 AA | ⚠️ | Tailwind responsive ✅, WCAG no probado |
| RNF-008 | Log de auditoría (logins, cargas, aprobaciones) | ✅ | Tablas audit_logs + login_logs |
| RNF-009 | Validación de archivos (PDF/JPG/PNG/XLSX, 50MB) | ✅ | Middleware Multer valida |
| RNF-010 | Backups automáticos diarios | ⚠️ | Depende de configuración de Supabase |
| RNF-011 | Cumplimiento OWASP Top 10 | ⚠️ | Sin auditoría de seguridad formal |
| RNF-012 | Arquitectura MVC cliente-servidor | ✅ | Módulos con routes/controller/service |
| RNF-013 | Cumplimiento Ley de Protección de Datos Ecuador | ⚠️ | Sin auditoría legal |
| RNF-014 | Encriptación AES-256 para documentos (tránsito y reposo) | ❌ | Campo encryptionMetadata existe pero sin implementación real |
| RNF-015 | Mensajes de error en español, ocultar detalles técnicos | ✅ | CRM tiene mensajes en español |
| RNF-016 | Consistencia de datos en escrituras concurrentes | ⚠️ | Sin pruebas de concurrencia |
| RNF-017 | Log de auditoría con usuario, acción, timestamp | ✅ | Tabla audit_logs |
| RNF-018 | Validación en cliente y servidor con feedback claro | ✅ | Zod en ambos lados |
| RNF-019 | Ejecución continua mínima 8 horas sin reinicio | ⚠️ | Sin pruebas de resistencia |
| RNF-020 | Documentación técnica y comentarios estándar | ⚠️ | CLAUDE.md y DESIGN.md existen, código poco comentado |
| RNF-021 | Cobertura de pruebas unitarias ≥ 80% | ❌ | vitest configurado pero sin evidencia de cobertura |
| RNF-022 | Actualizaciones con máximo 15 min de inactividad | ⚠️ | Sin CI/CD verificado |
| RNF-023 | Datos personales anonimizados en ambientes de prueba | ❌ | Sin evidencia |
| RNF-024 | Sesión expira tras 15 min de inactividad | ⚠️ | JWT expirable, timeout por inactividad no explícito |
| RNF-025 | Restauración de BD sin interrumpir operaciones | ⚠️ | Depende de Supabase |
| RNF-026 | Endpoints protegidos con JWT de 15 min de expiración | ⚠️ | Configurable via env, no verificado el valor |

**Puntaje RNF: 8/26 confirmados, 15 parciales/no verificados, 3 no implementados**

---

## Cuadro Resumen

| Módulo | Total | ✅ Listo | ⚠️ Parcial | ❌ Faltante |
|--------|-------|---------|-----------|------------|
| **CAT** (Catálogo) | 5 | 1 | 2 | 2 |
| **CMS** (Gestión Contenido) | 5 | 5 | 0 | 0 |
| **EMP** (Empleabilidad) | 6 | 4 | 1 | 1 |
| **CRM** (Gestión Clientes) | 22 | 11 | 7 | 4 |
| **MAT** (Matriz de Oferta) | 7 | 0 | 7 | 0 |
| **SUP** (Supervisión) | 6 | 0 | 6 | 0 |
| **DOC** (Documentos) | 9 | 5 | 3 | 1 |
| **REP** (Reportería) | 10 | 1 | 7 | 2 |
| **SEG** (Seguridad) | 3 | 3 | 0 | 0 |
| **NOT** (Notificaciones) | 2 | 0 | 0 | 2 |
| **TOTAL** | **75** | **30 (40%)** | **33 (44%)** | **12 (16%)** |

---

## Brechas Principales (Orden de Prioridad)

### 1. UI de Notificaciones (NOT) — Prioridad: CRÍTICA
**Impacto:** Bloquea SUP-005, DOC-008, NOT-001, NOT-002
**Estado:** API completamente lista (CRUD de notificaciones). Frontend tiene cero implementación — no hay ícono de campana, no hay centro de notificaciones, no hay indicador de no leídas.
**Acción requerida:**
- Crear componente NotificationCenter en bopacorp-crm (campana en header + dropdown/panel)
- Implementar triggers automáticos en API al cambiar estados (matrices, documentos)
- Considerar WebSocket/SSE para notificaciones en tiempo real

### 2. CRUD de Matriz de Oferta (MAT) — Prioridad: CRÍTICA
**Impacto:** Bloquea los 7 requisitos MAT + los 6 requisitos SUP (13 requisitos total)
**Estado:** API completamente lista con todos los endpoints. Frontend tiene solo vista de detalle en modo lectura. Crear, editar, líneas de item, adjuntos y cambio de estado están marcados como "próximamente".
**Acción requerida:**
- Formulario de creación de matriz (vincular a negociación)
- CRUD de líneas de item (agregar/editar/eliminar productos con cantidades y precios)
- Carga de adjuntos
- Flujo de estados: Borrador → Enviar para aprobación → Aprobado/Rechazado
- Vista de cola de pendientes para supervisores

### 3. Dashboards de Reportería (REP) — Prioridad: ALTA
**Impacto:** 9 de 10 requisitos REP incompletos
**Estado:** Recharts instalado como dependencia. Página de reportes es placeholder con KPI cards estáticos. API tiene CRUD de objetivos y endpoint de exports, pero sin endpoints de métricas computadas.
**Acción requerida:**
- Crear endpoints de agregación en API (ventas por asesor, cierres, visitas, facturación)
- Implementar dashboard real con gráficos (barras, líneas, KPIs)
- Implementar generación y exportación de reportes PDF/Excel
- Comparación rendimiento vs objetivos

### 4. Envío de Correos Electrónicos — Prioridad: ALTA
**Impacto:** Bloquea EMP-005, EMP-006, SUP-005, DOC-008, NOT-001
**Estado:** Cero integración de correo en todo el proyecto. Endpoints de forgot-password y reset-password existen pero sin envío real.
**Acción requerida:**
- Integrar servicio de correo (Resend, SendGrid, o Amazon SES)
- Enviar correos en: confirmación de postulación, resultado de postulación, aprobación/rechazo de matrices, revisión de documentos, reset de contraseña

### 5. Páginas de Detalle del Catálogo Público (CAT) — Prioridad: ALTA
**Impacto:** RF-CAT-001, RF-CAT-002, RF-CAT-003
**Estado:** API tiene modelo de datos rico con beneficios, condiciones, precios por categoría. El sitio web muestra 6 tarjetas hardcodeadas sin datos del backend.
**Acción requerida:**
- Conectar ServicesPage con API del catálogo
- Crear páginas de detalle de servicio (precio, beneficios, condiciones)
- Implementar filtros por categoría, cobertura y precio
- Integrar formulario de contacto funcional (RF-CAT-004)

### 6. Agregación KPI de Gerencia (CRM-016/017/018) — Prioridad: ALTA
**Impacto:** 3 requisitos CRM + soporta módulo REP
**Estado:** Sin endpoints de API que computen agregados por asesor (monto facturado, servicios vendidos, equipos, promedios). Los datos crudos existen en las tablas de negociaciones, visitas y clientes.
**Acción requerida:**
- Crear endpoints de agregación en API: /reports/advisor-metrics, /reports/funnel-summary
- Implementar queries SQL que calculen: total facturado por asesor, servicios vendidos, equipos, clientes por etapa del embudo

### 7. Captura GPS y Vista de Mapa (CRM-005/006) — Prioridad: MEDIA
**Impacto:** RF-CRM-005, RF-CRM-006
**Estado:** API almacena coordenadas GPS (latitud, longitud, precisión, timestamp). Frontend necesita captura automática via Geolocation API y visualización en mapa para supervisores.
**Acción requerida:**
- Integrar navigator.geolocation en formulario de creación de visita
- Agregar componente de mapa (Leaflet/Mapbox) para verificación de supervisores

### 8. Encriptación de Documentos (RNF-014) — Prioridad: MEDIA
**Impacto:** RNF-014 (requisito de seguridad)
**Estado:** Esquema de BD tiene campo encryptionMetadata (JSONB) pero no hay implementación real de encriptación AES-256.
**Acción requerida:**
- Implementar encriptación AES-256 en carga de documentos
- Encriptar archivos en reposo (storage) y en tránsito (ya cubierto por HTTPS)

### 9. Historial de Auditoría para Supervisores (CRM-022) — Prioridad: MEDIA
**Impacto:** RF-CRM-022
**Estado:** Tabla audit_logs existe y registra cambios. Sin UI en el CRM para que supervisores consulten el historial de modificaciones por asesor.
**Acción requerida:**
- Crear endpoint de consulta de audit_logs filtrable por usuario/tabla/periodo
- Crear vista en CRM mostrando historial de cambios por asesor

### 10. Asesores con Documentos Pendientes (DOC-009) — Prioridad: BAJA
**Impacto:** RF-DOC-009
**Estado:** Sin endpoint ni UI.
**Acción requerida:**
- Crear query que agrupe documentos pendientes por asesor
- Crear vista para coordinadores

---

## Observaciones Adicionales

### Aplicación Móvil
El documento de requisitos menciona una "aplicación móvil interna" como componente clave. Actualmente **no existe aplicación móvil nativa**. El CRM es una aplicación web responsive. Si bien funciona en dispositivos móviles via navegador, no es una app nativa con acceso a funcionalidades del dispositivo como GPS nativo, cámara, o notificaciones push — funcionalidades mencionadas en los requisitos.

### Cobertura de Pruebas
vitest está configurado en la API pero no se evidencia cobertura de pruebas unitarias. El RNF-021 exige ≥ 80% de cobertura en código crítico. Actualmente no hay evidencia de que se cumpla.

### Paquete Compartido
Existe `@bopacorp/shared` que contiene tipos TypeScript y esquemas Zod compartidos entre API, CRM y Web. Buena práctica de arquitectura que facilita consistencia en validaciones.

### Arquitectura de Base de Datos
PostgreSQL multi-esquema bien organizado (app_auth, core, catalog, crm, documents, matrices, employability, notifications, reports). Diseño relacional sólido con constraints, índices y soft deletes consistentes.
