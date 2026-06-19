import { request } from '@/services/api.js';
import type { PublicCatalogItem } from './catalog.types.js';

export function listPublicCatalogItems() {
  return request<PublicCatalogItem[]>({
    method: 'GET',
    url: '/public/catalog/items',
  });
}
