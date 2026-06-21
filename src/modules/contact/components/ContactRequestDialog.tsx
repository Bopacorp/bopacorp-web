import { CreateContactRequestSchema } from '@bopacorp/shared/catalog';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, Send, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button.js';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog.js';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { Textarea } from '@/components/ui/textarea.js';
import { useUnsavedGuard } from '@/shared/hooks/use-unsaved-guard.js';
import { DiscardChangesDialog } from '@/shared/ui/discard-changes-dialog.js';
import type { ContactRequestResponse } from '../contact.types.js';
import { useContactRequest } from '../hooks/use-contact-request.js';

type ContactFormValues = z.input<typeof CreateContactRequestSchema>;

interface ContactRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: string;
  onSuccess?: (response: ContactRequestResponse) => void;
}

export function ContactRequestDialog({
  open,
  onOpenChange,
  itemId,
  onSuccess,
}: ContactRequestDialogProps) {
  const { state, submit, reset } = useContactRequest();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(CreateContactRequestSchema),
    defaultValues: {
      itemId: undefined,
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      message: '',
    },
    mode: 'onTouched',
  });

  const { dirtyRef, showDiscard, handleDirtyChange, guardedClose, handleDiscard, cancelDiscard } =
    useUnsavedGuard({ onClose: () => onOpenChange(false) });

  useEffect(() => {
    handleDirtyChange(form.formState.isDirty);
  }, [form.formState.isDirty, handleDirtyChange]);

  useEffect(() => {
    if (!open) {
      form.reset();
      reset();
    }
  }, [open, reset, form]);

  useEffect(() => {
    if (state.kind === 'success') {
      dirtyRef.current = false;
      onSuccess?.(state.data);
    }
  }, [state, onSuccess, dirtyRef]);

  useEffect(() => {
    if (state.kind !== 'error' || !state.details?.length) return;

    form.clearErrors();

    for (const detail of state.details) {
      const field = detail.field as keyof ContactFormValues;
      if (field in form.getValues()) {
        form.setError(field, { type: 'manual', message: detail.message });
      }
    }
  }, [state, form]);

  const onSubmit = async (values: ContactFormValues) => {
    await submit({
      ...values,
      clientName: values.clientName.trim(),
      clientEmail: values.clientEmail.trim(),
      clientPhone: values.clientPhone?.trim() || undefined,
      message: values.message?.trim() || undefined,
      itemId: itemId || undefined,
    });
  };

  const submitting = state.kind === 'submitting' || form.formState.isSubmitting;
  const generalError = state.kind === 'error' && !state.details?.length ? state.message : null;

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : guardedClose())}>
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
              onClick={guardedClose}
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

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <FieldGroup>
              <Field data-invalid={form.formState.errors.clientName ? true : undefined}>
                <FieldLabel htmlFor="contact-name">Nombre completo</FieldLabel>
                <Input
                  id="contact-name"
                  placeholder="Juan Perez"
                  autoComplete="name"
                  disabled={submitting}
                  {...form.register('clientName')}
                />
                {form.formState.errors.clientName && (
                  <FieldError>{form.formState.errors.clientName.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={form.formState.errors.clientEmail ? true : undefined}>
                <FieldLabel htmlFor="contact-email">Correo electronico</FieldLabel>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="tu@empresa.com.ec"
                  autoComplete="email"
                  disabled={submitting}
                  {...form.register('clientEmail')}
                />
                {form.formState.errors.clientEmail && (
                  <FieldError>{form.formState.errors.clientEmail.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={form.formState.errors.clientPhone ? true : undefined}>
                <FieldLabel htmlFor="contact-phone">Telefono (opcional)</FieldLabel>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="0991234567"
                  autoComplete="tel"
                  maxLength={10}
                  disabled={submitting}
                  {...form.register('clientPhone', {
                    setValueAs: (value) => (value === '' ? undefined : value),
                  })}
                />
                {form.formState.errors.clientPhone && (
                  <FieldError>{form.formState.errors.clientPhone.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={form.formState.errors.message ? true : undefined}>
                <FieldLabel htmlFor="contact-message">Mensaje (opcional)</FieldLabel>
                <Textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Cuentanos que necesitas para tu empresa"
                  disabled={submitting}
                  {...form.register('message')}
                />
                {form.formState.errors.message && (
                  <FieldError>{form.formState.errors.message.message}</FieldError>
                )}
              </Field>
            </FieldGroup>

            <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={guardedClose}
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
                {submitting ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Send data-icon="inline-start" />
                )}
                {submitting ? 'Enviando...' : 'Enviar solicitud'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <DiscardChangesDialog open={showDiscard} onCancel={cancelDiscard} onDiscard={handleDiscard} />
    </>
  );
}
