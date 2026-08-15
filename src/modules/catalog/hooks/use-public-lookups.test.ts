import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@/test/test-utils.js';

const serviceMocks = vi.hoisted(() => ({
  listPublicCategories: vi.fn(),
  listPublicSegments: vi.fn(),
}));

vi.mock('../catalog.service.js', () => serviceMocks);

import { usePublicCategories } from './use-public-categories.js';
import { usePublicSegments } from './use-public-segments.js';

beforeEach(() => {
  serviceMocks.listPublicCategories.mockReset();
  serviceMocks.listPublicSegments.mockReset();
});

describe('public catalog lookup hooks', () => {
  it('loads categories independently', async () => {
    const categories = [{ id: 'category-1', name: 'Voz', slug: 'voz' }];
    serviceMocks.listPublicCategories.mockResolvedValue(categories);

    const { result } = renderHook(() => usePublicCategories());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.categories).toEqual(categories);
    expect(serviceMocks.listPublicCategories).toHaveBeenCalledTimes(1);
    expect(serviceMocks.listPublicSegments).not.toHaveBeenCalled();
  });

  it('loads segments independently', async () => {
    const segments = [{ id: 'segment-1', code: 'SME', name: 'Pymes' }];
    serviceMocks.listPublicSegments.mockResolvedValue(segments);

    const { result } = renderHook(() => usePublicSegments());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.segments).toEqual(segments);
    expect(serviceMocks.listPublicSegments).toHaveBeenCalledTimes(1);
    expect(serviceMocks.listPublicCategories).not.toHaveBeenCalled();
  });
});
