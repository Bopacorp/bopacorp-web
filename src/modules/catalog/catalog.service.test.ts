import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCatalogItem } from '@/test/fixtures/catalog-fixtures.js';

const apiMocks = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock('@/services/api.js', () => apiMocks);

import {
  listPublicCatalogItems,
  listPublicCategories,
  listPublicSegments,
} from './catalog.service.js';

beforeEach(() => {
  apiMocks.request.mockReset();
});

describe('catalog service', () => {
  it('lists public catalog items with the expected endpoint and filters', async () => {
    const item = createCatalogItem();
    apiMocks.request.mockResolvedValue([item]);

    await expect(
      listPublicCatalogItems({
        categorySlug: 'voz',
        segmentId: 'segment-1',
        minPrice: 0,
        maxPrice: 100,
      }),
    ).resolves.toEqual([item]);

    expect(apiMocks.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/public/catalog/items',
      params: { categorySlug: 'voz', segmentId: 'segment-1', minPrice: 0, maxPrice: 100 },
    });
  });

  it('lists categories and segments independently', async () => {
    apiMocks.request
      .mockResolvedValueOnce([{ id: 'category-1', name: 'Voz', slug: 'voz' }])
      .mockResolvedValueOnce([{ id: 'segment-1', code: 'SME', name: 'Pymes' }]);

    await expect(listPublicCategories()).resolves.toEqual([
      { id: 'category-1', name: 'Voz', slug: 'voz' },
    ]);
    await expect(listPublicSegments()).resolves.toEqual([
      { id: 'segment-1', code: 'SME', name: 'Pymes' },
    ]);

    expect(apiMocks.request).toHaveBeenNthCalledWith(1, {
      method: 'GET',
      url: '/public/catalog/categories',
    });
    expect(apiMocks.request).toHaveBeenNthCalledWith(2, {
      method: 'GET',
      url: '/public/catalog/segments',
    });
  });
});
