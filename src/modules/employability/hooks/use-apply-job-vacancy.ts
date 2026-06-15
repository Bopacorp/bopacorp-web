import { useCallback, useState } from 'react';
import { ApiError } from '@/services/api.js';
import { applyJobVacancy } from '../employability.service.js';
import type { ApplyCandidatePayload, ApplyState } from '../employability.types.js';

export interface ApplySubmission {
  vacancyId: string;
  candidate: ApplyCandidatePayload;
  coverLetter: string;
  file: File;
}

export function useApplyJobVacancy() {
  const [state, setState] = useState<ApplyState>({ kind: 'idle' });

  const submit = useCallback(async (submission: ApplySubmission) => {
    setState({ kind: 'submitting' });
    try {
      const form = new FormData();
      form.append('file', submission.file);
      form.append('vacancyId', submission.vacancyId);
      if (submission.coverLetter.trim()) form.append('coverLetter', submission.coverLetter);
      form.append('candidate', JSON.stringify(submission.candidate));
      const data = await applyJobVacancy(form);
      setState({ kind: 'success', data });
    } catch (err) {
      setState(toApplyError(err));
    }
  }, []);

  const reset = useCallback(() => setState({ kind: 'idle' }), []);

  return { state, submit, reset };
}

function toApplyError(err: unknown): ApplyState {
  if (err instanceof ApiError) {
    const code = err.code;
    const message = err.message;
    const details = err.details;
    if (code === 'NOT_FOUND') {
      return { kind: 'error', code, message: 'Esta vacante ya no esta disponible.', details };
    }
    if (code === 'RATE_LIMITED') {
      return {
        kind: 'error',
        code,
        message: 'Has realizado demasiadas postulaciones. Intenta de nuevo en 15 minutos.',
        details,
      };
    }
    if (code === 'MULTER_ERROR' && /size|large|payload/i.test(message)) {
      return {
        kind: 'error',
        code,
        message: 'El archivo supera el tamano maximo (20 MB).',
        details,
      };
    }
    if (code === 'MULTER_ERROR') {
      return { kind: 'error', code, message: 'Solo se aceptan archivos PDF.', details };
    }
    if (code === 'CONFLICT') {
      return {
        kind: 'error',
        code,
        message: 'Ya tienes una postulacion activa a esta vacante.',
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
