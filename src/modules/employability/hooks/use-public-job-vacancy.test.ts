import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/services/api.js';
import { createDeferred } from '@/test/fixtures/axios-fixtures.js';
import { createPublicVacancy } from '@/test/fixtures/employability-fixtures.js';
import { renderHook, waitFor } from '@/test/test-utils.js';

const serviceMocks = vi.hoisted(() => ({ getPublicJobVacancy: vi.fn() }));

vi.mock('../employability.service.js', () => serviceMocks);

import { usePublicJobVacancy } from './use-public-job-vacancy.js';

beforeEach(() => {
  serviceMocks.getPublicJobVacancy.mockReset();
});

describe('usePublicJobVacancy', () => {
  it('does not request the API when the vacancy id is missing', async () => {
    const { result } = renderHook(() => usePublicJobVacancy(null));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.vacancy).toBeNull();
    expect(serviceMocks.getPublicJobVacancy).not.toHaveBeenCalled();
  });

  it('loads a vacancy and retries after an API error', async () => {
    const vacancy = createPublicVacancy();
    serviceMocks.getPublicJobVacancy
      .mockRejectedValueOnce(new ApiError('NOT_FOUND', 'Vacancy not found'))
      .mockResolvedValueOnce(vacancy);
    const { result } = renderHook(() => usePublicJobVacancy('vacancy-1'));

    await waitFor(() => expect(result.current.error?.code).toBe('NOT_FOUND'));
    expect(result.current.vacancy).toBeNull();

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.vacancy).toEqual(vacancy));
    expect(result.current.error).toBeNull();
    expect(serviceMocks.getPublicJobVacancy).toHaveBeenCalledTimes(2);
  });

  it('ignores a late response after the selected vacancy changes', async () => {
    const first = createDeferred<ReturnType<typeof createPublicVacancy>>();
    const second = createDeferred<ReturnType<typeof createPublicVacancy>>();
    serviceMocks.getPublicJobVacancy
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const { result, rerender } = renderHook(({ id }: { id: string }) => usePublicJobVacancy(id), {
      initialProps: { id: 'vacancy-1' },
    });
    await waitFor(() => expect(serviceMocks.getPublicJobVacancy).toHaveBeenCalledWith('vacancy-1'));

    rerender({ id: 'vacancy-2' });
    await waitFor(() => expect(serviceMocks.getPublicJobVacancy).toHaveBeenCalledWith('vacancy-2'));
    const current = createPublicVacancy({ id: 'vacancy-2', title: 'Backend Developer' });

    await act(async () => {
      second.resolve(current);
      await second.promise;
    });
    await waitFor(() => expect(result.current.vacancy?.id).toBe('vacancy-2'));

    await act(async () => {
      first.resolve(createPublicVacancy());
      await first.promise;
    });
    expect(result.current.vacancy?.id).toBe('vacancy-2');
  });
});
