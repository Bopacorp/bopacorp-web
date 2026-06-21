import type { PublicJobVacancyResponse } from '@bopacorp/shared/employability';
import { useCallback, useEffect, useState } from 'react';
import { getPublicJobVacancy } from '../employability.service.js';
import { getErrorMessage } from '../lib/error-message.js';

interface CancelState {
  cancelled: boolean;
}

interface UsePublicJobVacancyResult {
  vacancy: PublicJobVacancyResponse | null;
  loading: boolean;
  error: { code: string; message: string } | null;
  retry: () => void;
}

export function usePublicJobVacancy(id: string | null | undefined): UsePublicJobVacancyResult {
  const [vacancy, setVacancy] = useState<PublicJobVacancyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const load = useCallback(
    async (state: CancelState) => {
      if (!id) {
        setVacancy(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getPublicJobVacancy(id);
        if (state.cancelled) return;
        setVacancy(data);
        setError(null);
      } catch (err) {
        if (state.cancelled) return;
        setError({
          code: (err as { code?: string }).code ?? 'INTERNAL_ERROR',
          message: getErrorMessage(err),
        });
      } finally {
        if (!state.cancelled) setLoading(false);
      }
    },
    [id],
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

  return { vacancy, loading, error, retry };
}
