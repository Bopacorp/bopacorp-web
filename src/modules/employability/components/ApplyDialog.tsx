import { AlertCircle, Send, X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
  ApplyFormErrors,
  ApplyFormValues,
  ApplyJobVacancyResponse,
} from '../employability.types.js';
import { useApplyJobVacancy } from '../hooks/use-apply-job-vacancy.js';
import { applyDetailsToErrors, hasApplyErrors, validateApplyForm } from '../lib/validation.js';
import { UploadResumeField } from './UploadResumeField.js';

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacancy: { id: string; title: string } | null;
  onSuccess?: (response: ApplyJobVacancyResponse) => void;
}

const EMPTY_VALUES: ApplyFormValues = {
  nationalId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  coverLetter: '',
};

export function ApplyDialog({ open, onOpenChange, vacancy, onSuccess }: ApplyDialogProps) {
  const [values, setValues] = useState<ApplyFormValues>(EMPTY_VALUES);
  const [file, setFile] = useState<File | null>(null);
  const [fileTouched, setFileTouched] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<ApplyFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof ApplyFormValues, boolean>>({
    nationalId: false,
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    address: false,
    coverLetter: false,
  });
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { state, submit, reset } = useApplyJobVacancy();

  useEffect(() => {
    if (!open) {
      setValues(EMPTY_VALUES);
      setFile(null);
      setFileTouched(false);
      setFileName('');
      setErrors({});
      setTouched({
        nationalId: false,
        firstName: false,
        lastName: false,
        email: false,
        phone: false,
        address: false,
        coverLetter: false,
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
      const fieldErrors = applyDetailsToErrors(state.details);
      setErrors(fieldErrors);
      setGeneralError(fieldErrors && Object.keys(fieldErrors).length > 0 ? null : state.message);
    }
  }, [state, onSuccess]);

  const submitting = state.kind === 'submitting';

  const handleField =
    (key: keyof ApplyFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
      setTouched((current) => ({ ...current, [key]: true }));
    };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    setFileTouched(true);
    setFileName(next?.name ?? '');
    if (errors.file) setErrors((current) => ({ ...current, file: undefined }));
  };

  const FIELD_ORDER: (keyof ApplyFormErrors)[] = [
    'nationalId',
    'firstName',
    'lastName',
    'email',
    'phone',
    'file',
  ];

  const FIELD_IDS: Record<keyof ApplyFormErrors, string> = {
    nationalId: 'apply-national-id',
    firstName: 'apply-first-name',
    lastName: 'apply-last-name',
    email: 'apply-email',
    phone: 'apply-phone',
    file: 'applicant-resume',
  };

  function focusFirstInvalidField(validation: ApplyFormErrors) {
    const firstKey = FIELD_ORDER.find((key) => validation[key]);
    if (!firstKey) return;
    if (firstKey === 'file') {
      setFileTouched(true);
    } else {
      setTouched((current) => ({ ...current, [firstKey]: true }));
    }
    const element = document.getElementById(FIELD_IDS[firstKey]);
    element?.focus();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vacancy) return;
    setGeneralError(null);
    const validation = validateApplyForm(values, file);
    if (hasApplyErrors(validation)) {
      setErrors(validation);
      focusFirstInvalidField(validation);
      return;
    }
    setErrors({});
    submit({
      vacancyId: vacancy.id,
      candidate: {
        nationalId: values.nationalId.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        address: values.address.trim() || undefined,
      },
      coverLetter: values.coverLetter,
      file: file as File,
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.nationalId && touched.nationalId) || undefined}>
              <FieldLabel htmlFor="apply-national-id">Cedula o RUC</FieldLabel>
              <Input
                id="apply-national-id"
                inputMode="numeric"
                value={values.nationalId}
                onChange={handleField('nationalId')}
                placeholder="1234567890"
                maxLength={20}
                disabled={submitting}
                required
              />
              {errors.nationalId && touched.nationalId && (
                <FieldError>{errors.nationalId}</FieldError>
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.firstName && touched.firstName) || undefined}>
                <FieldLabel htmlFor="apply-first-name">Nombre</FieldLabel>
                <Input
                  id="apply-first-name"
                  value={values.firstName}
                  onChange={handleField('firstName')}
                  maxLength={100}
                  disabled={submitting}
                  required
                />
                {errors.firstName && touched.firstName && (
                  <FieldError>{errors.firstName}</FieldError>
                )}
              </Field>
              <Field data-invalid={Boolean(errors.lastName && touched.lastName) || undefined}>
                <FieldLabel htmlFor="apply-last-name">Apellido</FieldLabel>
                <Input
                  id="apply-last-name"
                  value={values.lastName}
                  onChange={handleField('lastName')}
                  maxLength={100}
                  disabled={submitting}
                  required
                />
                {errors.lastName && touched.lastName && <FieldError>{errors.lastName}</FieldError>}
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.email && touched.email) || undefined}>
              <FieldLabel htmlFor="apply-email">Correo electronico</FieldLabel>
              <Input
                id="apply-email"
                type="email"
                value={values.email}
                onChange={handleField('email')}
                placeholder="tu@email.com"
                maxLength={150}
                disabled={submitting}
                required
              />
              {errors.email && touched.email && <FieldError>{errors.email}</FieldError>}
            </Field>

            <Field data-invalid={Boolean(errors.phone && touched.phone) || undefined}>
              <FieldLabel htmlFor="apply-phone">Telefono (opcional)</FieldLabel>
              <Input
                id="apply-phone"
                type="tel"
                value={values.phone}
                onChange={handleField('phone')}
                placeholder="+593 9..."
                maxLength={20}
                disabled={submitting}
              />
              {errors.phone && touched.phone && <FieldError>{errors.phone}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="apply-address">Direccion (opcional)</FieldLabel>
              <Input
                id="apply-address"
                value={values.address}
                onChange={handleField('address')}
                disabled={submitting}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="apply-cover-letter">Carta de presentacion (opcional)</FieldLabel>
              <Textarea
                id="apply-cover-letter"
                rows={4}
                value={values.coverLetter}
                onChange={handleField('coverLetter')}
                placeholder="Cuentanos por que te interesa este rol"
                disabled={submitting}
              />
            </Field>

            <UploadResumeField
              fileName={fileName}
              error={errors.file}
              touched={fileTouched}
              onChange={handleFile}
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
              <Send data-icon="inline-start" />
              {submitting ? 'Enviando...' : 'Enviar postulacion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
