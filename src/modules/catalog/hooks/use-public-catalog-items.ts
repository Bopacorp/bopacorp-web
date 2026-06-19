import { useCallback, useEffect, useState } from 'react';
import { listPublicCatalogItems } from '../catalog.service.js';
import type { PublicCatalogItem } from '../catalog.types.js';

interface CancelState {
  cancelled: boolean;
}

export interface UsePublicCatalogItemsResult {
  items: PublicCatalogItem[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function usePublicCatalogItems(): UsePublicCatalogItemsResult {
  const [items, setItems] = useState<PublicCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadData = useCallback(async (state: CancelState) => {
    try {
      const data = await listPublicCatalogItems();
      if (state.cancelled) return;
      setItems(data);
      setError(null);
    } catch (err) {
      if (state.cancelled) return;
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (!state.cancelled) setLoading(false);
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

  return { items, loading, error, retry };
}
