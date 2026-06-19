import type { ContactRequestResponse as _ContactRequestResponse } from '@bopacorp/shared/catalog';

export type ContactRequestResponse = _ContactRequestResponse;

export interface ContactFormValues {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
}

export interface ContactFormErrors {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  message?: string;
}

export interface ContactValidationDetail {
  field: string;
  message: string;
}

export type ContactState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; data: ContactRequestResponse }
  | {
      kind: 'error';
      code: string;
      message: string;
      details?: ContactValidationDetail[];
    };
