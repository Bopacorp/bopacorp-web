import type { CreateContactRequest } from '@bopacorp/shared/catalog';
import { useCallback, useState } from 'react';
import { ApiError } from '@/services/api.js';
import { createContactRequest } from '../contact.service.js';
import type { ContactState } from '../contact.types.js';

export function useContactRequest() {
  const [state, setState] = useState<ContactState>({ kind: 'idle' });

  const submit = useCallback(async (data: CreateContactRequest) => {
    setState({ kind: 'submitting' });
    try {
      const response = await createContactRequest(data);
      setState({ kind: 'success', data: response });
    } catch (err) {
      setState(toContactError(err));
    }
  }, []);

  const reset = useCallback(() => setState({ kind: 'idle' }), []);

  return { state, submit, reset };
}

function toContactError(err: unknown): ContactState {
  if (err instanceof ApiError) {
    const code = err.code;
    const message = err.message;
    const details = err.details;
    if (code === 'RATE_LIMITED') {
      return {
        kind: 'error',
        code,
        message: 'Has enviado demasiadas solicitudes. Intenta de nuevo en unos minutos.',
        details,
      };
    }
    return { kind: 'error', code, message, details };
  }
  if (err instanceof Error) {
    return { kind: 'error', code: 'INTERNAL_ERROR', message: err.message };
  }
  return { kind: 'error', code: 'INTERNAL_ERROR', message: 'Error desconocido.' };
}
