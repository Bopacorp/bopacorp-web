import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/services/api.js';
import { createContactResponse } from '@/test/fixtures/catalog-fixtures.js';
import { renderHook, waitFor } from '@/test/test-utils.js';

const serviceMocks = vi.hoisted(() => ({ createContactRequest: vi.fn() }));

vi.mock('../contact.service.js', () => serviceMocks);

import { useContactRequest } from './use-contact-request.js';

const contactData = {
  clientName: 'Ana Pérez',
  clientEmail: 'ana@empresa.com',
};

beforeEach(() => {
  serviceMocks.createContactRequest.mockReset();
});

describe('useContactRequest', () => {
  it('transitions from submitting to success and can reset', async () => {
    const response = createContactResponse();
    serviceMocks.createContactRequest.mockResolvedValue(response);
    const { result } = renderHook(() => useContactRequest());

    await act(async () => {
      await result.current.submit(contactData);
    });

    expect(result.current.state).toEqual({ kind: 'success', data: response });
    expect(serviceMocks.createContactRequest).toHaveBeenCalledWith(contactData);
    act(() => result.current.reset());
    expect(result.current.state).toEqual({ kind: 'idle' });
  });

  it('maps rate limit errors to the public contact message', async () => {
    serviceMocks.createContactRequest.mockRejectedValue(
      new ApiError('RATE_LIMITED', 'Too many requests', [
        { field: 'clientEmail', message: 'Limit reached' },
      ]),
    );
    const { result } = renderHook(() => useContactRequest());

    await act(async () => {
      await result.current.submit(contactData);
    });

    expect(result.current.state).toEqual({
      kind: 'error',
      code: 'RATE_LIMITED',
      message: 'Has enviado demasiadas solicitudes. Intenta de nuevo en unos minutos.',
      details: [{ field: 'clientEmail', message: 'Limit reached' }],
    });
  });

  it('preserves field details and unknown errors', async () => {
    serviceMocks.createContactRequest.mockRejectedValueOnce(
      new ApiError('VALIDATION_ERROR', 'Invalid fields', [
        { field: 'clientEmail', message: 'Invalid email' },
      ]),
    );
    const { result } = renderHook(() => useContactRequest());

    await act(async () => {
      await result.current.submit(contactData);
    });
    expect(result.current.state).toMatchObject({
      kind: 'error',
      code: 'VALIDATION_ERROR',
      details: [{ field: 'clientEmail', message: 'Invalid email' }],
    });

    serviceMocks.createContactRequest.mockRejectedValueOnce(new Error('Network failed'));
    await act(async () => {
      await result.current.submit(contactData);
    });
    await waitFor(() =>
      expect(result.current.state).toEqual({
        kind: 'error',
        code: 'INTERNAL_ERROR',
        message: 'Network failed',
      }),
    );
  });
});
