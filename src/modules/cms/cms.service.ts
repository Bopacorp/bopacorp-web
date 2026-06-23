import type { ContentBlockResponse, UpdateContentBlockRequest } from '@bopacorp/shared/catalog';
import type { PaginationMeta } from '@bopacorp/shared/common';
import { request, requestPaginated } from '@/services/api.js';

export function listContentBlocks(page: number, search: string) {
  return requestPaginated<ContentBlockResponse, PaginationMeta>({
    method: 'GET',
    url: '/catalog/content-blocks',
    params: { page, search },
  });
}

export function updateContentBlock(id: string, payload: UpdateContentBlockRequest) {
  return request<ContentBlockResponse>({
    method: 'PATCH',
    url: `/catalog/content-blocks/${id}`,
    data: payload,
  });
}

interface UploadImageResponse {
  url: string;
  key: string;
  contentKey: string;
}

export function uploadContentBlockImage(contentKey: string, image: File) {
  const data = new FormData();
  data.append('image', image);
  return request<UploadImageResponse>({
    method: 'POST',
    url: '/uploads/images',
    params: { contentKey },
    data,
  });
}
