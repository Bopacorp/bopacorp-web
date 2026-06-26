import type { ListPublicCatalogQuery, PublicCatalogItemResponse } from '@bopacorp/shared';
import { CatalogItemCategoryRefSchema, CatalogItemTypeRefSchema } from '@bopacorp/shared';
import type { z } from 'zod';
import { request } from '@/services/api.js';

export type { ListPublicCatalogQuery, PublicCatalogItemResponse };

type CategoryRef = z.infer<typeof CatalogItemCategoryRefSchema>;
type SegmentRef = z.infer<typeof CatalogItemTypeRefSchema>;

export function listPublicCatalogItems(filters?: ListPublicCatalogQuery) {
  return request<PublicCatalogItemResponse[]>({
    method: 'GET',
    url: '/public/catalog/items',
    params: filters,
  });
}

export function listPublicCategories() {
  return request<CategoryRef[]>({
    method: 'GET',
    url: '/public/catalog/categories',
  });
}

export function listPublicSegments() {
  return request<SegmentRef[]>({
    method: 'GET',
    url: '/public/catalog/segments',
  });
}
