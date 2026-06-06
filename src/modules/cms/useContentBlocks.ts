import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/services/api.js';
import { listContentBlocks } from './cms.service.js';

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return 'Error desconocido';
}

function saveBlocks(
  data: ContentBlockResponse[],
  ctrl: { cancelled: boolean },
  setContentBlocks: React.Dispatch<React.SetStateAction<ContentBlockResponse[]>>,
  setLoading: (v: boolean) => void,
) {
  if (ctrl.cancelled) return;
  setContentBlocks(data);
  setLoading(false);
}

function saveError(
  err: unknown,
  ctrl: { cancelled: boolean },
  setErr: (msg: string | null) => void,
  setLoading: (v: boolean) => void,
) {
  if (ctrl.cancelled) return;
  setErr(getErrorMessage(err));
  setLoading(false);
}

async function loadBlocks(
  page: number,
  query: string,
  setContentBlocks: React.Dispatch<React.SetStateAction<ContentBlockResponse[]>>,
  setErr: (msg: string | null) => void,
  setLoading: (v: boolean) => void,
  ctrl: { cancelled: boolean },
) {
  try {
    const data = await listContentBlocks(page, query);
    saveBlocks(data, ctrl, setContentBlocks, setLoading);
  } catch (err) {
    saveError(err, ctrl, setErr, setLoading);
  }
}

export function useContentBlocks(page: number, query: string) {
  const [contentBlocks, setContentBlocks] = useState<ContentBlockResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: retryCount is an intentional trigger for refetch
  useEffect(() => {
    const ctrl = { cancelled: false };
    loadBlocks(page, query, setContentBlocks, setError, setLoading, ctrl);
    return () => {
      ctrl.cancelled = true;
    };
  }, [page, query, retryCount]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((n) => n + 1);
  }, []);

  return { contentBlocks, loading, error, retry, setContentBlocks };
}
