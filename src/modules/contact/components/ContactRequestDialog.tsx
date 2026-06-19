import { AlertCircle, Send, X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
  ContactFormErrors,
  ContactFormValues,
  ContactRequestResponse,
} from '../contact.types.js';
import { useContactRequest } from '../hooks/use-contact-request.js';
import {
  contactDetailsToErrors,
  hasContactErrors,
  validateContactForm,
} from '../lib/validation.js';

interface ContactRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: string;
  onSuccess?: (response: ContactRequestResponse) => void;
}

const EMPTY_VALUES: ContactFormValues = {
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  message: '',
};

export function ContactRequestDialog({
  open,
  onOpenChange,
  itemId,
  onSuccess,
}: ContactRequestDialogProps) {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof ContactFormValues, boolean>>({
    clientName: false,
    clientEmail: false,
    clientPhone: false,
    message: false,
  });
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { state, submit, reset } = useContactRequest();

  useEffect(() => {
    if (!open) {
      setValues(EMPTY_VALUES);
      setErrors({});
      setTouched({
        clientName: false,
        clientEmail: false,
        clientPhone: false,
        message: false,
      });
      setGeneralError(null);
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (state.kind === 'success') {
      onSuccess?.(state.data);
    }
    if (state.kind === 'error') {
      const fieldErrors = contactDetailsToErrors(state.details);
      setErrors(fieldErrors);
      setGeneralError(fieldErrors && Object.keys(fieldErrors).length > 0 ? null : state.message);
    }
  }, [state, onSuccess]);

  const submitting = state.kind === 'submitting';

  const handleField =
    (key: keyof ContactFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
      setTouched((current) => ({ ...current, [key]: true }));
    };

  const FIELD_ORDER: (keyof ContactFormErrors)[] = ['clientName', 'clientEmail', 'clientPhone'];

  const FIELD_IDS: Record<keyof ContactFormErrors, string> = {
    clientName: 'contact-name',
    clientEmail: 'contact-email',
    clientPhone: 'contact-phone',
    message: 'contact-message',
  };

  function focusFirstInvalidField(validation: ContactFormErrors) {
    const firstKey = FIELD_ORDER.find((key) => validation[key]);
    if (!firstKey) return;
    setTouched((current) => ({ ...current, [firstKey]: true }));
    const element = document.getElementById(FIELD_IDS[firstKey]);
    element?.focus();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);
    const validation = validateContactForm(values);
    if (hasContactErrors(validation)) {
      setErrors(validation);
      focusFirstInvalidField(validation);
      return;
    }
    setErrors({});
    submit({
      clientName: values.clientName.trim(),
      clientEmail: values.clientEmail.trim(),
      clientPhone: values.clientPhone.trim() || undefined,
      message: values.message.trim() || undefined,
      itemId: itemId || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" showCloseButton={false}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-5 w-px bg-primary" />
              <DialogTitle className="font-brand text-lg font-semibold tracking-tight">
                Solicitar Cotizacion
              </DialogTitle>
            </div>
            <DialogDescription>
              Completa tus datos y un asesor comercial te contactara pronto.
            </DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar"
            disabled={submitting}
          >
            <X />
          </Button>
        </div>

        {generalError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.clientName && touched.clientName) || undefined}>
              <FieldLabel htmlFor="contact-name">Nombre completo</FieldLabel>
              <Input
                id="contact-name"
                value={values.clientName}
                onChange={handleField('clientName')}
                placeholder="Juan Perez"
                maxLength={200}
                disabled={submitting}
                required
              />
              {errors.clientName && touched.clientName && (
                <FieldError>{errors.clientName}</FieldError>
              )}
            </Field>

            <Field data-invalid={Boolean(errors.clientEmail && touched.clientEmail) || undefined}>
              <FieldLabel htmlFor="contact-email">Correo electronico</FieldLabel>
              <Input
                id="contact-email"
                type="email"
                value={values.clientEmail}
                onChange={handleField('clientEmail')}
                placeholder="tu@empresa.com"
                maxLength={150}
                disabled={submitting}
                required
              />
              {errors.clientEmail && touched.clientEmail && (
                <FieldError>{errors.clientEmail}</FieldError>
              )}
            </Field>

            <Field data-invalid={Boolean(errors.clientPhone && touched.clientPhone) || undefined}>
              <FieldLabel htmlFor="contact-phone">Telefono (opcional)</FieldLabel>
              <Input
                id="contact-phone"
                type="tel"
                value={values.clientPhone}
                onChange={handleField('clientPhone')}
                placeholder="+593 9..."
                maxLength={20}
                disabled={submitting}
              />
              {errors.clientPhone && touched.clientPhone && (
                <FieldError>{errors.clientPhone}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-message">Mensaje (opcional)</FieldLabel>
              <Textarea
                id="contact-message"
                rows={4}
                value={values.message}
                onChange={handleField('message')}
                placeholder="Cuentanos que necesitas para tu empresa"
                disabled={submitting}
              />
            </Field>
          </FieldGroup>

          <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="h-10 rounded-md px-6 text-sm font-medium"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-md px-6 text-sm font-medium"
            >
              <Send data-icon="inline-start" />
              {submitting ? 'Enviando...' : 'Enviar solicitud'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
