import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/services/api.js';
import { createDeferred } from '@/test/fixtures/axios-fixtures.js';
import {
  createVacancyListItem,
  createVacancyMeta,
} from '@/test/fixtures/employability-fixtures.js';
import { renderHook, waitFor } from '@/test/test-utils.js';

const serviceMocks = vi.hoisted(() => ({ listPublishedVacancies: vi.fn() }));

vi.mock('../employability.service.js', () => serviceMocks);

import { usePublishedVacancies } from './use-published-vacancies.js';

const query = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
};

type PageResponse = {
  data: ReturnType<typeof createVacancyListItem>[];
  meta: ReturnType<typeof createVacancyMeta>;
};

beforeEach(() => {
  serviceMocks.listPublishedVacancies.mockReset();
});

describe('usePublishedVacancies', () => {
  it('loads vacancies and preserves pagination metadata', async () => {
    const response = {
      data: [createVacancyListItem()],
      meta: createVacancyMeta({ totalItems: 11, totalPages: 2 }),
    };
    serviceMocks.listPublishedVacancies.mockResolvedValue(response);

    const { result } = renderHook(() => usePublishedVacancies(query));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.vacancies).toEqual(response.data);
    expect(result.current.meta).toEqual(response.meta);
    expect(serviceMocks.listPublishedVacancies).toHaveBeenCalledWith(query);
  });

  it('cancels a stale page response when the query changes', async () => {
    const first = createDeferred<PageResponse>();
    const second = createDeferred<PageResponse>();
    serviceMocks.listPublishedVacancies
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const { result, rerender } = renderHook(
      ({ page }: { page: number }) => usePublishedVacancies({ ...query, page }),
      { initialProps: { page: 1 } },
    );
    await waitFor(() => expect(serviceMocks.listPublishedVacancies).toHaveBeenCalledTimes(1));

    rerender({ page: 2 });
    await waitFor(() => expect(serviceMocks.listPublishedVacancies).toHaveBeenCalledTimes(2));

    const current = createPageResponse({
      data: [createVacancyListItem({ id: 'vacancy-2', title: 'Backend Developer' })],
      meta: createVacancyMeta({ page: 2 }),
    });
    await act(async () => {
      second.resolve(current);
      await second.promise;
    });
    await waitFor(() => expect(result.current.vacancies[0]?.id).toBe('vacancy-2'));

    await act(async () => {
      first.resolve(createPageResponse());
      await first.promise;
    });
    expect(result.current.vacancies[0]?.id).toBe('vacancy-2');
  });

  it('exposes API errors and retries successfully', async () => {
    const response = createPageResponse();
    serviceMocks.listPublishedVacancies
      .mockRejectedValueOnce(new ApiError('NOT_FOUND', 'Vacancies not found'))
      .mockResolvedValueOnce(response);
    const { result } = renderHook(() => usePublishedVacancies(query));

    await waitFor(() => expect(result.current.error?.code).toBe('NOT_FOUND'));
    expect(result.current.error?.message).toBeTruthy();

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.vacancies).toEqual(response.data));
    expect(result.current.error).toBeNull();
    expect(serviceMocks.listPublishedVacancies).toHaveBeenCalledTimes(2);
  });
});

function createPageResponse(overrides: Partial<PageResponse> = {}): PageResponse {
  return {
    data: [createVacancyListItem()],
    meta: createVacancyMeta(),
    ...overrides,
  };
}
