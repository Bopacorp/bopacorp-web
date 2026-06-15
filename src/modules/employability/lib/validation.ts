import { ApiError } from '@/services/api.js';
import type {
  ApplyFormErrors,
  ApplyFormValues,
  ApplyValidationDetail,
} from '../employability.types.js';

const MAX_NAME = 100;
const MAX_NATIONAL_ID = 20;
const MAX_PHONE = 20;
const MAX_PDF_BYTES = 20 * 1024 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateString(value: string, min: number, max: number, required: boolean): string | null {
  const trimmed = value.trim();
  if (required && trimmed.length < min) return `Debe tener al menos ${min} caracteres.`;
  if (trimmed.length > max) return `Debe tener maximo ${max} caracteres.`;
  return null;
}

export function validateApplyForm(values: ApplyFormValues, file: File | null): ApplyFormErrors {
  const errors: ApplyFormErrors = {};
  const nationalId = validateString(values.nationalId, 1, MAX_NATIONAL_ID, true);
  if (nationalId) errors.nationalId = nationalId;
  const firstName = validateString(values.firstName, 1, MAX_NAME, true);
  if (firstName) errors.firstName = firstName;
  const lastName = validateString(values.lastName, 1, MAX_NAME, true);
  if (lastName) errors.lastName = lastName;
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Correo electronico no valido.';
  if (values.phone.trim().length > MAX_PHONE) errors.phone = `Maximo ${MAX_PHONE} caracteres.`;
  if (!file) errors.file = 'Adjunta tu CV en PDF.';
  else if (file.type !== 'application/pdf') errors.file = 'Solo se aceptan archivos PDF.';
  else if (file.size > MAX_PDF_BYTES) errors.file = 'El archivo supera el tamano maximo (20 MB).';
  return errors;
}

export function hasApplyErrors(errors: ApplyFormErrors): boolean {
  return Object.values(errors).some((value) => Boolean(value));
}

function mapDetailFieldToKey(detailField: string): keyof ApplyFormErrors | null {
  if (detailField === 'candidate.nationalId') return 'nationalId';
  if (detailField === 'candidate.firstName') return 'firstName';
  if (detailField === 'candidate.lastName') return 'lastName';
  if (detailField === 'candidate.email') return 'email';
  if (detailField === 'candidate.phone') return 'phone';
  if (detailField === 'file') return 'file';
  return null;
}

export function applyDetailsToErrors(
  details: ApplyValidationDetail[] | undefined,
): ApplyFormErrors {
  const errors: ApplyFormErrors = {};
  if (!details) return errors;
  for (const detail of details) {
    const key = mapDetailFieldToKey(detail.field);
    if (key && !errors[key]) errors[key] = detail.message;
  }
  return errors;
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return 'Error desconocido';
}
