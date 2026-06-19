import type {
  ContactFormErrors,
  ContactFormValues,
  ContactValidationDetail,
} from '../contact.types.js';

const MAX_NAME = 200;
const MAX_EMAIL = 150;
const MAX_PHONE = 20;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const name = values.clientName.trim();
  if (name.length === 0) errors.clientName = 'El nombre es obligatorio.';
  else if (name.length > MAX_NAME) errors.clientName = `Maximo ${MAX_NAME} caracteres.`;

  const email = values.clientEmail.trim();
  if (email.length === 0) errors.clientEmail = 'El correo es obligatorio.';
  else if (email.length > MAX_EMAIL) errors.clientEmail = `Maximo ${MAX_EMAIL} caracteres.`;
  else if (!EMAIL_RE.test(email)) errors.clientEmail = 'Correo electronico no valido.';

  const phone = values.clientPhone.trim();
  if (phone.length > MAX_PHONE) errors.clientPhone = `Maximo ${MAX_PHONE} caracteres.`;

  return errors;
}

export function hasContactErrors(errors: ContactFormErrors): boolean {
  return Object.values(errors).some((value) => Boolean(value));
}

function mapDetailFieldToKey(detailField: string): keyof ContactFormErrors | null {
  if (detailField === 'clientName') return 'clientName';
  if (detailField === 'clientEmail') return 'clientEmail';
  if (detailField === 'clientPhone') return 'clientPhone';
  if (detailField === 'message') return 'message';
  return null;
}

export function contactDetailsToErrors(
  details: ContactValidationDetail[] | undefined,
): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!details) return errors;
  for (const detail of details) {
    const key = mapDetailFieldToKey(detail.field);
    if (key && !errors[key]) errors[key] = detail.message;
  }
  return errors;
}
