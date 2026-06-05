import type { ContentBlockResponse, UpdateContentBlockRequest } from '@bopacorp/shared/catalog';
import { request } from '@/services/api.js';

export function listContentBlocks(page: number) {
  return request<ContentBlockResponse[]>({
    method: 'GET',
    url: '/catalog/content-blocks',
    params: { page },
  });
}

export function updateContentBlock(id: string, payload: UpdateContentBlockRequest) {
  return request<ContentBlockResponse>({
    method: 'PATCH',
    url: `/catalog/content-blocks/${id}`,
    data: payload,
  });
}
