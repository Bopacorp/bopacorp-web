import type { ContentBlockResponse, ContentBlockSectionResponse } from '@bopacorp/shared/catalog';
import type { PaginationMeta } from '@bopacorp/shared/common';

const timestamps = {
  createdAt: '2026-08-15T10:00:00.000Z',
  updatedAt: '2026-08-15T12:00:00.000Z',
};

export function createContentBlock(
  overrides: Partial<ContentBlockResponse> = {},
): ContentBlockResponse {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    contentKey: 'hero.title',
    contentTypeId: '22222222-2222-4222-8222-222222222222',
    contentType: {
      id: '22222222-2222-4222-8222-222222222222',
      code: 'TEXT',
      name: 'Text',
    },
    title: 'Hero title',
    body: 'Conectividad que impulsa tu empresa',
    sortOrder: 0,
    ...timestamps,
    ...overrides,
  };
}

export function createImageContentBlock(
  overrides: Partial<ContentBlockResponse> = {},
): ContentBlockResponse {
  return createContentBlock({
    contentKey: 'landing.hero.background_image_url',
    contentTypeId: '33333333-3333-4333-8333-333333333333',
    contentType: {
      id: '33333333-3333-4333-8333-333333333333',
      code: 'IMAGE',
      name: 'Image',
    },
    body: 'https://cdn.test/hero.webp',
    ...overrides,
  });
}

export function createContentSection(
  overrides: Partial<ContentBlockSectionResponse> = {},
): ContentBlockSectionResponse {
  return { prefix: 'hero', count: 2, ...overrides };
}

export function createContentMeta(overrides: Partial<PaginationMeta> = {}): PaginationMeta {
  return { page: 1, limit: 50, totalItems: 2, totalPages: 1, ...overrides };
}

export function createImageFile(name = 'hero.webp', type = 'image/webp', size = 1024) {
  const file = new File(['image'], name, { type });
  Object.defineProperty(file, 'size', { configurable: true, value: size });
  return file;
}
