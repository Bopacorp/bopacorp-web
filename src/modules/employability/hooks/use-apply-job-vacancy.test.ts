import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/services/api.js';
import { createApplyResponse, createResumeFile } from '@/test/fixtures/employability-fixtures.js';
import { renderHook } from '@/test/test-utils.js';
import type { ApplySubmission } from './use-apply-job-vacancy.js';

const serviceMocks = vi.hoisted(() => ({ applyJobVacancy: vi.fn() }));

vi.mock('../employability.service.js', () => serviceMocks);

import { useApplyJobVacancy } from './use-apply-job-vacancy.js';

const submission: ApplySubmission = {
  vacancyId: 'vacancy-1',
  candidate: {
    nationalId: '0912345678',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@empresa.com',
    phone: '0991234567',
    address: 'Guayaquil',
  },
  coverLetter: '  Me interesa el rol  ',
  file: createResumeFile(),
};

beforeEach(() => {
  serviceMocks.applyJobVacancy.mockReset();
});

describe('useApplyJobVacancy', () => {
  it('builds FormData with the vacancy, candidate, trimmed letter, and PDF', async () => {
    const response = createApplyResponse();
    serviceMocks.applyJobVacancy.mockResolvedValue(response);
    const { result } = renderHook(() => useApplyJobVacancy());

    await act(async () => {
      await result.current.submit(submission);
    });

    const form = serviceMocks.applyJobVacancy.mock.calls[0]?.[0] as FormData;
    expect(form.get('file')).toBe(submission.file);
    expect(form.get('vacancyId')).toBe('vacancy-1');
    expect(form.get('coverLetter')).toBe('Me interesa el rol');
    expect(JSON.parse(String(form.get('candidate')))).toEqual(submission.candidate);
    expect(result.current.state).toEqual({ kind: 'success', data: response });
  });

  it('does not append a blank cover letter and resets after success', async () => {
    serviceMocks.applyJobVacancy.mockResolvedValue(createApplyResponse());
    const { result } = renderHook(() => useApplyJobVacancy());

    await act(async () => {
      await result.current.submit({ ...submission, coverLetter: '   ' });
    });
    const form = serviceMocks.applyJobVacancy.mock.calls[0]?.[0] as FormData;
    expect(form.get('coverLetter')).toBeNull();

    act(() => result.current.reset());
    expect(result.current.state).toEqual({ kind: 'idle' });
  });

  it.each([
    ['NOT_FOUND', 'Esta vacante ya no esta disponible.', 'Vacancy not found'],
    [
      'RATE_LIMITED',
      'Has realizado demasiadas postulaciones. Intenta de nuevo en 15 minutos.',
      'Too many applications',
    ],
    ['MULTER_ERROR', 'El archivo supera el tamano maximo (20 MB).', 'File too large'],
    ['MULTER_ERROR', 'Solo se aceptan archivos PDF.', 'Invalid file type'],
    ['CONFLICT', 'Ya tienes una postulacion activa a esta vacante.', 'Duplicate application'],
  ] as const)('maps %s into the expected user message', async (code, message, apiMessage) => {
    serviceMocks.applyJobVacancy.mockRejectedValue(new ApiError(code, apiMessage));
    const { result } = renderHook(() => useApplyJobVacancy());

    await act(async () => {
      await result.current.submit(submission);
    });

    expect(result.current.state).toMatchObject({ kind: 'error', code, message });
  });
});
