import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDeferred } from '@/test/fixtures/axios-fixtures.js';
import { createCatalogItem } from '@/test/fixtures/catalog-fixtures.js';
import { renderHook, waitFor } from '@/test/test-utils.js';

const serviceMocks = vi.hoisted(() => ({ listPublicCatalogItems: vi.fn() }));

vi.mock('../catalog.service.js', () => serviceMocks);

import { usePublicCatalogItems } from './use-public-catalog-items.js';

beforeEach(() => {
  serviceMocks.listPublicCatalogItems.mockReset();
});

describe('usePublicCatalogItems', () => {
  it('loads slug and numeric zero filters without losing them', async () => {
    const deferred = createDeferred<ReturnType<typeof createCatalogItem>[]>();
    const item = createCatalogItem();
    serviceMocks.listPublicCatalogItems.mockReturnValue(deferred.promise);

    const { result } = renderHook(() =>
      usePublicCatalogItems({ categorySlug: 'voz', minPrice: 0, maxPrice: 100 }),
    );

    expect(result.current.loading).toBe(true);
    await waitFor(() =>
      expect(serviceMocks.listPublicCatalogItems).toHaveBeenCalledWith({
        categorySlug: 'voz',
        minPrice: 0,
        maxPrice: 100,
      }),
    );

    await act(async () => {
      deferred.resolve([item]);
      await deferred.promise;
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.items).toEqual([item]);
    expect(result.current.error).toBeNull();
  });

  it('distinguishes initial loading from reloading and supports retry', async () => {
    const deferred = createDeferred<ReturnType<typeof createCatalogItem>[]>();
    const item = createCatalogItem();
    serviceMocks.listPublicCatalogItems
      .mockResolvedValueOnce([item])
      .mockReturnValueOnce(deferred.promise);

    const { result } = renderHook(() => usePublicCatalogItems({ categoryId: 'category-1' }));
    await waitFor(() => expect(result.current.items).toEqual([item]));

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.reloading).toBe(true));
    expect(result.current.loading).toBe(false);

    await act(async () => {
      deferred.resolve([createCatalogItem({ id: 'item-2' })]);
      await deferred.promise;
    });

    await waitFor(() => expect(result.current.reloading).toBe(false));
    expect(result.current.items[0]?.id).toBe('item-2');
  });

  it('ignores a late response from a cancelled filter request', async () => {
    const first = createDeferred<ReturnType<typeof createCatalogItem>[]>();
    const second = createDeferred<ReturnType<typeof createCatalogItem>[]>();
    serviceMocks.listPublicCatalogItems
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const { result, rerender } = renderHook(
      ({ categoryId }: { categoryId: string }) => usePublicCatalogItems({ categoryId }),
      { initialProps: { categoryId: 'category-1' } },
    );
    await waitFor(() => expect(serviceMocks.listPublicCatalogItems).toHaveBeenCalledTimes(1));

    rerender({ categoryId: 'category-2' });
    await waitFor(() => expect(serviceMocks.listPublicCatalogItems).toHaveBeenCalledTimes(2));

    const currentItem = createCatalogItem({ id: 'current-item' });
    await act(async () => {
      second.resolve([currentItem]);
      await second.promise;
    });
    await waitFor(() => expect(result.current.items).toEqual([currentItem]));

    await act(async () => {
      first.resolve([createCatalogItem({ id: 'stale-item' })]);
      await first.promise;
    });

    expect(result.current.items).toEqual([currentItem]);
  });
});
