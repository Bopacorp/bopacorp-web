import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/services/api.js';
import { createContentBlock, createContentMeta } from '@/test/fixtures/cms-fixtures.js';
import { renderHook, waitFor } from '@/test/test-utils.js';

const serviceMocks = vi.hoisted(() => ({ listContentBlocks: vi.fn() }));

vi.mock('./cms.service.js', () => serviceMocks);

import { useContentBlocks } from './useContentBlocks.js';

const firstBlock = createContentBlock();
const secondBlock = createContentBlock({
  id: '44444444-4444-4444-8444-444444444444',
  body: 'About',
});

beforeEach(() => {
  serviceMocks.listContentBlocks.mockReset();
});

describe('useContentBlocks', () => {
  it('loads blocks and metadata for the requested page and section', async () => {
    const response = { data: [firstBlock], meta: createContentMeta() };
    serviceMocks.listContentBlocks.mockResolvedValue(response);

    const { result } = renderHook(() => useContentBlocks(2, 'hero', 'connect'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.contentBlocks).toEqual([firstBlock]);
    expect(result.current.meta).toEqual(response.meta);
    expect(serviceMocks.listContentBlocks).toHaveBeenCalledWith(2, 'hero', 'connect');
  });

  it('retries after an API error and returns the recovered blocks', async () => {
    serviceMocks.listContentBlocks
      .mockRejectedValueOnce(new ApiError('INTERNAL_ERROR', 'Failed'))
      .mockResolvedValueOnce({ data: [secondBlock], meta: createContentMeta({ totalItems: 1 }) });
    const { result } = renderHook(() => useContentBlocks(1, 'hero', ''));

    await waitFor(() =>
      expect(result.current.error).toBe('Ocurrió un error inesperado. Intenta de nuevo más tarde.'),
    );
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.contentBlocks).toEqual([secondBlock]));
    expect(result.current.error).toBeNull();
    expect(serviceMocks.listContentBlocks).toHaveBeenCalledTimes(2);
  });

  it('refreshes blocks without changing the current query', async () => {
    serviceMocks.listContentBlocks
      .mockResolvedValueOnce({ data: [firstBlock], meta: createContentMeta() })
      .mockResolvedValueOnce({ data: [secondBlock], meta: createContentMeta({ totalItems: 1 }) });
    const { result } = renderHook(() => useContentBlocks(1, 'hero', ''));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => result.current.refresh());

    expect(result.current.contentBlocks).toEqual([secondBlock]);
    expect(serviceMocks.listContentBlocks).toHaveBeenNthCalledWith(2, 1, 'hero', '');
  });

  it('ignores a stale response after the section changes', async () => {
    let resolveFirst: (value: {
      data: (typeof firstBlock)[];
      meta: ReturnType<typeof createContentMeta>;
    }) => void = () => {};
    const firstRequest = new Promise<{
      data: (typeof firstBlock)[];
      meta: ReturnType<typeof createContentMeta>;
    }>((resolve) => {
      resolveFirst = resolve;
    });
    serviceMocks.listContentBlocks
      .mockReturnValueOnce(firstRequest)
      .mockResolvedValueOnce({ data: [secondBlock], meta: createContentMeta({ totalItems: 1 }) });
    const { result, rerender } = renderHook(
      ({ section }: { section: string }) => useContentBlocks(1, section, ''),
      { initialProps: { section: 'hero' } },
    );

    rerender({ section: 'about' });
    await waitFor(() => expect(result.current.contentBlocks).toEqual([secondBlock]));
    resolveFirst({ data: [firstBlock], meta: createContentMeta() });
    await firstRequest;

    expect(result.current.contentBlocks).toEqual([secondBlock]);
  });
});
