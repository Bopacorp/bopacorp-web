import { ApplyJobVacancyFormSchema } from '@bopacorp/shared/employability';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, Send, X } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button.js';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog.js';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { Textarea } from '@/components/ui/textarea.js';
import type { ApplyJobVacancyResponse } from '../employability.types.js';
import { useApplyJobVacancy } from '../hooks/use-apply-job-vacancy.js';
import { UploadResumeField } from './UploadResumeField.js';

const MAX_FILE_BYTES = 20 * 1024 * 1024;

const ApplyFormSchema = ApplyJobVacancyFormSchema.extend({
  file: z
    .instanceof(File, { message: 'Adjunta tu CV en PDF' })
    .refine((f) => f.type === 'application/pdf', 'Solo se aceptan archivos PDF')
    .refine((f) => f.size <= MAX_FILE_BYTES, 'El archivo supera el tamaño máximo (20 MB)'),
});

type ApplyFormValues = z.input<typeof ApplyFormSchema>;

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacancy: { id: string; title: string } | null;
  onSuccess?: (response: ApplyJobVacancyResponse) => void;
}

const FIELD_MAP: Record<string, keyof ApplyFormValues> = {
  'candidate.nationalId': 'nationalId',
  'candidate.firstName': 'firstName',
  'candidate.lastName': 'lastName',
  'candidate.email': 'email',
  'candidate.phone': 'phone',
  'candidate.address': 'address',
  file: 'file',
};

export function ApplyDialog({ open, onOpenChange, vacancy, onSuccess }: ApplyDialogProps) {
  const { state, submit, reset } = useApplyJobVacancy();

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(ApplyFormSchema),
    defaultValues: {
      nationalId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      coverLetter: '',
      file: undefined,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      reset();
    }
  }, [open, reset, form]);

  useEffect(() => {
    if (state.kind === 'success') {
      onSuccess?.(state.data);
    }
  }, [state, onSuccess]);

  useEffect(() => {
    if (state.kind !== 'error' || !state.details?.length) return;

    form.clearErrors();

    for (const detail of state.details) {
      const field = FIELD_MAP[detail.field];
      if (field) {
        form.setError(field, { type: 'manual', message: detail.message });
      }
    }
  }, [state, form]);

  const onSubmit = async (values: ApplyFormValues) => {
    if (!vacancy) return;

    await submit({
      vacancyId: vacancy.id,
      candidate: {
        nationalId: values.nationalId,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || undefined,
        address: values.address?.trim() || undefined,
      },
      coverLetter: values.coverLetter || '',
      file: values.file,
    });
  };

  const submitting = state.kind === 'submitting' || form.formState.isSubmitting;
  const generalError = state.kind === 'error' && !state.details?.length ? state.message : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" showCloseButton={false}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-5 w-px bg-primary" />
              <DialogTitle className="font-brand text-lg font-semibold tracking-tight">
                Postular a {vacancy?.title ?? 'la vacante'}
              </DialogTitle>
            </div>
            <DialogDescription>
              Completa tus datos y adjunta tu CV en PDF. Los campos marcados son obligatorios.
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <FieldGroup>
            <Field data-invalid={form.formState.errors.nationalId ? true : undefined}>
              <FieldLabel htmlFor="apply-national-id">Cedula</FieldLabel>
              <Input
                id="apply-national-id"
                inputMode="numeric"
                placeholder="1234567890"
                disabled={submitting}
                {...form.register('nationalId')}
              />
              {form.formState.errors.nationalId && (
                <FieldError>{form.formState.errors.nationalId.message}</FieldError>
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={form.formState.errors.firstName ? true : undefined}>
                <FieldLabel htmlFor="apply-first-name">Nombre</FieldLabel>
                <Input
                  id="apply-first-name"
                  maxLength={50}
                  disabled={submitting}
                  {...form.register('firstName')}
                />
                {form.formState.errors.firstName && (
                  <FieldError>{form.formState.errors.firstName.message}</FieldError>
                )}
              </Field>
              <Field data-invalid={form.formState.errors.lastName ? true : undefined}>
                <FieldLabel htmlFor="apply-last-name">Apellido</FieldLabel>
                <Input
                  id="apply-last-name"
                  maxLength={50}
                  disabled={submitting}
                  {...form.register('lastName')}
                />
                {form.formState.errors.lastName && (
                  <FieldError>{form.formState.errors.lastName.message}</FieldError>
                )}
              </Field>
            </div>

            <Field data-invalid={form.formState.errors.email ? true : undefined}>
              <FieldLabel htmlFor="apply-email">Correo electronico</FieldLabel>
              <Input
                id="apply-email"
                type="email"
                placeholder="tu@email.com"
                maxLength={150}
                disabled={submitting}
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <FieldError>{form.formState.errors.email.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={form.formState.errors.phone ? true : undefined}>
              <FieldLabel htmlFor="apply-phone">Telefono (opcional)</FieldLabel>
              <Input
                id="apply-phone"
                type="tel"
                placeholder="+593 9..."
                maxLength={12}
                disabled={submitting}
                {...form.register('phone', {
                  setValueAs: (value) => (value === '' ? undefined : value),
                })}
              />
              {form.formState.errors.phone && (
                <FieldError>{form.formState.errors.phone.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={form.formState.errors.address ? true : undefined}>
              <FieldLabel htmlFor="apply-address">Direccion (opcional)</FieldLabel>
              <Input
                id="apply-address"
                maxLength={255}
                disabled={submitting}
                {...form.register('address')}
              />
              {form.formState.errors.address && (
                <FieldError>{form.formState.errors.address.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={form.formState.errors.coverLetter ? true : undefined}>
              <FieldLabel htmlFor="apply-cover-letter">Carta de presentacion (opcional)</FieldLabel>
              <Textarea
                id="apply-cover-letter"
                rows={4}
                placeholder="Cuentanos por que te interesa este rol"
                disabled={submitting}
                {...form.register('coverLetter')}
              />
              {form.formState.errors.coverLetter && (
                <FieldError>{form.formState.errors.coverLetter.message}</FieldError>
              )}
            </Field>

            <Controller
              name="file"
              control={form.control}
              render={({ field }) => (
                <UploadResumeField
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.file?.message}
                  disabled={submitting}
                />
              )}
            />
          </FieldGroup>

          <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="h-11 rounded-md px-6 text-sm font-medium"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-md px-6 text-sm font-medium"
            >
              {submitting ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <Send data-icon="inline-start" />
              )}
              {submitting ? 'Enviando...' : 'Enviar postulacion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
