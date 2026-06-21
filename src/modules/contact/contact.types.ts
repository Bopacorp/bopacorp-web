import type { ContactRequestResponse as _ContactRequestResponse } from '@bopacorp/shared/catalog';

export type ContactRequestResponse = _ContactRequestResponse;

export type ContactState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; data: ContactRequestResponse }
  | {
      kind: 'error';
      code: string;
      message: string;
      details?: Array<{ field: string; message: string }>;
    };
