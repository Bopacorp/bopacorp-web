import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import type { PaginationMeta } from '@bopacorp/shared/common';
import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '@/shared/errors/index.js';
import { listContentBlocks } from './cms.service.js';

function saveBlocks(
  data: ContentBlockResponse[],
  meta: PaginationMeta,
  ctrl: { cancelled: boolean },
  setContentBlocks: React.Dispatch<React.SetStateAction<ContentBlockResponse[]>>,
  setMeta: React.Dispatch<React.SetStateAction<PaginationMeta | null>>,
  setLoading: (v: boolean) => void,
) {
  if (ctrl.cancelled) return;
  setContentBlocks(data);
  setMeta(meta);
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
  section: string,
  query: string,
  setContentBlocks: React.Dispatch<React.SetStateAction<ContentBlockResponse[]>>,
  setMeta: React.Dispatch<React.SetStateAction<PaginationMeta | null>>,
  setErr: (msg: string | null) => void,
  setLoading: (v: boolean) => void,
  ctrl: { cancelled: boolean },
) {
  try {
    const { data, meta } = await listContentBlocks(page, section, query);
    saveBlocks(data, meta, ctrl, setContentBlocks, setMeta, setLoading);
  } catch (err) {
    saveError(err, ctrl, setErr, setLoading);
  }
}

async function refreshBlocks(
  page: number,
  section: string,
  query: string,
  setContentBlocks: React.Dispatch<React.SetStateAction<ContentBlockResponse[]>>,
  setMeta: React.Dispatch<React.SetStateAction<PaginationMeta | null>>,
) {
  const { data, meta } = await listContentBlocks(page, section, query);
  setContentBlocks(data);
  setMeta(meta);
}

export function useContentBlocks(page: number, section: string, query: string) {
  const [contentBlocks, setContentBlocks] = useState<ContentBlockResponse[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: retryCount is an intentional trigger for refetch
  useEffect(() => {
    const ctrl = { cancelled: false };
    setLoading(true);
    setError(null);
    loadBlocks(page, section, query, setContentBlocks, setMeta, setError, setLoading, ctrl);
    return () => {
      ctrl.cancelled = true;
    };
  }, [page, section, query, retryCount]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((n) => n + 1);
  }, []);

  const refresh = useCallback(async () => {
    await refreshBlocks(page, section, query, setContentBlocks, setMeta);
  }, [page, section, query]);

  return { contentBlocks, meta, loading, error, retry, refresh, setContentBlocks };
}
