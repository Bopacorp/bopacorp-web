import { useCallback, useEffect, useState } from 'react';
import { request } from '@/services/api.js';

interface ContentBlockResponse {
  id: string;
  contentKey: string;
  body: string;
}

interface CmsLandingResponse {
  blocks: Record<string, ContentBlockResponse>;
}

interface CancelState {
  cancelled: boolean;
}

export function useCmsLanding() {
  const [blocks, setBlocks] = useState<Record<string, ContentBlockResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadData = useCallback(async (state: CancelState) => {
    try {
      const data = await request<CmsLandingResponse>({ method: 'GET', url: '/cms/landing' });
      applyData(data, state, setBlocks, setLoading);
    } catch (err) {
      applyError(err, state, setError, setLoading);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: retryCount is the intentional trigger for refetch
  useEffect(() => {
    const state: CancelState = { cancelled: false };
    loadData(state);
    return () => {
      state.cancelled = true;
    };
  }, [retryCount, loadData]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((n) => n + 1);
  }, []);

  return { blocks, loading, error, retry };
}

function applyData(
  data: CmsLandingResponse,
  state: CancelState,
  setBlocks: (blocks: Record<string, ContentBlockResponse>) => void,
  setLoading: (loading: boolean) => void,
) {
  if (state.cancelled) return;
  setBlocks(data.blocks);
  setLoading(false);
}

function applyError(
  err: unknown,
  state: CancelState,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void,
) {
  if (state.cancelled) return;
  setError(err instanceof Error ? err.message : 'Unknown error');
  setLoading(false);
}
