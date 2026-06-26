import type { PaginationMeta } from '@bopacorp/shared/common';
import type {
  JobVacancyListItemResponse,
  ListJobVacanciesQuery,
} from '@bopacorp/shared/employability';
import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '@/shared/errors/index.js';
import { listPublishedVacancies } from '../employability.service.js';

interface CancelState {
  cancelled: boolean;
}

interface UsePublishedVacanciesResult {
  vacancies: JobVacancyListItemResponse[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: { code: string; message: string } | null;
  retry: () => void;
}

export function usePublishedVacancies(query: ListJobVacanciesQuery): UsePublishedVacanciesResult {
  const [vacancies, setVacancies] = useState<JobVacancyListItemResponse[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: track individual query fields to avoid re-creating load on identity change
  const load = useCallback(
    async (state: CancelState) => {
      setLoading(true);
      try {
        const { data, meta: nextMeta } = await listPublishedVacancies(query);
        if (state.cancelled) return;
        setVacancies(data);
        setMeta(nextMeta);
        setError(null);
      } catch (err) {
        if (state.cancelled) return;
        const message = getErrorMessage(err);
        const code = (err as { code?: string }).code ?? 'INTERNAL_ERROR';
        setError({ code, message });
      } finally {
        if (!state.cancelled) setLoading(false);
      }
    },
    [
      query.page,
      query.limit,
      query.search,
      query.sortBy,
      query.sortOrder,
      query.isActive,
      query.isPublished,
    ],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: retryCount is an intentional trigger for refetch
  useEffect(() => {
    const state: CancelState = { cancelled: false };
    load(state);
    return () => {
      state.cancelled = true;
    };
  }, [load, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((current) => current + 1);
  }, []);

  return { vacancies, meta, loading, error, retry };
}
