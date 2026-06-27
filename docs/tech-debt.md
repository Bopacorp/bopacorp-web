# Deuda Técnica

## ZOD-I18N — Mensajes de validación Zod no soportan i18n

**Estado**: Resuelto (`@bopacorp/shared@0.2.41`)
**Prioridad**: Baja
**Afecta**: `@bopacorp/shared` + `bopacorp-web` + `bopacorp-crm`

### Problema

Los schemas de Zod en `@bopacorp/shared` tienen mensajes de validación hardcodeados en español. Cuando el frontend está en inglés, los errores de formulario (ej: "Correo electrónico no válido", "La contraseña es obligatoria") siguen apareciendo en español.

Schemas afectados:
- `LoginRequestSchema` — email, password
- `CorporateEmailSchema` — refine message
- `CreateUserRequestSchema` — todos los campos
- `PasswordSchema` — min/max
- Cualquier otro schema con `.min()`, `.max()`, `.refine()` con mensajes custom

### Solución propuesta

1. **Shared**: cambiar mensajes de Zod a keys de i18n:
   ```ts
   // Antes
   z.string().min(1, 'La contraseña es obligatoria')
   // Después
   z.string().min(1, { message: 'validation.passwordRequired' })
   ```

2. **Frontend**: resolver keys con `t()` al mostrar errores:
   ```tsx
   <FieldError>{t(form.formState.errors.email.message!)}</FieldError>
   ```

3. **Locales**: agregar keys `validation.*` a `es.json` y `en.json`

4. **Backend**: no requiere cambios funcionales — los keys llegan en responses de validación y el frontend los traduce

### Impacto del cambio

- Bump de `@bopacorp/shared` (minor)
- Actualizar formularios en `bopacorp-web` y `bopacorp-crm` para resolver keys con `t()`
- Agregar ~15-20 keys de validación a archivos de traducción
