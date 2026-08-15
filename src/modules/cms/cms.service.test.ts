import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createContentBlock,
  createContentMeta,
  createContentSection,
  createImageFile,
} from '@/test/fixtures/cms-fixtures.js';

const apiMocks = vi.hoisted(() => ({ request: vi.fn(), requestPaginated: vi.fn() }));

vi.mock('@/services/api.js', () => apiMocks);

import {
  listContentBlockSections,
  listContentBlocks,
  updateContentBlock,
  uploadContentBlockImage,
} from './cms.service.js';

beforeEach(() => {
  apiMocks.request.mockReset();
  apiMocks.requestPaginated.mockReset();
});

describe('CMS service', () => {
  it('lists content block sections from the expected endpoint', async () => {
    const sections = [createContentSection()];
    apiMocks.request.mockResolvedValue(sections);

    await expect(listContentBlockSections()).resolves.toEqual(sections);
    expect(apiMocks.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/catalog/content-blocks/sections',
    });
  });

  it('lists blocks with pagination, section, and search parameters', async () => {
    const response = { data: [createContentBlock()], meta: createContentMeta() };
    apiMocks.requestPaginated.mockResolvedValue(response);

    await expect(listContentBlocks(2, 'hero', 'connect')).resolves.toEqual(response);
    expect(apiMocks.requestPaginated).toHaveBeenCalledWith({
      method: 'GET',
      url: '/catalog/content-blocks',
      params: { page: 2, limit: 50, section: 'hero', search: 'connect' },
    });
  });

  it('omits empty section and search query parameters', async () => {
    apiMocks.requestPaginated.mockResolvedValue({ data: [], meta: createContentMeta() });

    await listContentBlocks(1, '', '');

    expect(apiMocks.requestPaginated).toHaveBeenCalledWith({
      method: 'GET',
      url: '/catalog/content-blocks',
      params: { page: 1, limit: 50, section: undefined, search: undefined },
    });
  });

  it('updates a content block with the expected patch payload', async () => {
    const block = createContentBlock();
    apiMocks.request.mockResolvedValue(block);

    await expect(updateContentBlock(block.id, { body: 'Updated content' })).resolves.toEqual(block);
    expect(apiMocks.request).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `/catalog/content-blocks/${block.id}`,
      data: { body: 'Updated content' },
    });
  });

  it('uploads an image with contentKey and FormData', async () => {
    const file = createImageFile();
    const response = {
      url: 'https://cdn.test/new.webp',
      key: 'new.webp',
      contentKey: 'hero.image',
    };
    apiMocks.request.mockResolvedValue(response);

    await expect(uploadContentBlockImage('hero.image', file)).resolves.toEqual(response);

    const config = apiMocks.request.mock.calls[0][0];
    expect(config).toMatchObject({
      method: 'POST',
      url: '/uploads/images',
      params: { contentKey: 'hero.image' },
    });
    expect(config.data).toBeInstanceOf(FormData);
    expect(config.data.get('image')).toBe(file);
  });
});
