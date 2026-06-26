import type { ListPublicCatalogQuery, PublicCatalogItemResponse } from '@bopacorp/shared';
import { useCallback, useEffect, useState } from 'react';
import { listPublicCatalogItems } from '../catalog.service.js';

interface CancelState {
  cancelled: boolean;
}

export interface UsePublicCatalogItemsResult {
  items: PublicCatalogItemResponse[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function usePublicCatalogItems(
  filters?: ListPublicCatalogQuery,
): UsePublicCatalogItemsResult {
  const [items, setItems] = useState<PublicCatalogItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const categoryId = filters?.categoryId;
  const segmentId = filters?.segmentId;
  const minPrice = filters?.minPrice;
  const maxPrice = filters?.maxPrice;

  const loadData = useCallback(
    async (state: CancelState) => {
      try {
        const params: ListPublicCatalogQuery = {};
        if (categoryId) params.categoryId = categoryId;
        if (segmentId) params.segmentId = segmentId;
        if (minPrice !== undefined) params.minPrice = minPrice;
        if (maxPrice !== undefined) params.maxPrice = maxPrice;

        const data = await listPublicCatalogItems(
          Object.keys(params).length > 0 ? params : undefined,
        );
        if (state.cancelled) return;
        setItems(data);
        setError(null);
      } catch (err) {
        if (state.cancelled) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!state.cancelled) setLoading(false);
      }
    },
    [categoryId, segmentId, minPrice, maxPrice],
  );

  const enabled = filters !== undefined;

  // biome-ignore lint/correctness/useExhaustiveDependencies: retryCount is the intentional trigger for refetch
  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    const state: CancelState = { cancelled: false };
    loadData(state);
    return () => {
      state.cancelled = true;
    };
  }, [enabled, retryCount, loadData]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((n) => n + 1);
  }, []);

  return { items, loading, error, retry };
}
