import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/services/api.js';
import { createContentSection } from '@/test/fixtures/cms-fixtures.js';
import { renderHook, waitFor } from '@/test/test-utils.js';

const serviceMocks = vi.hoisted(() => ({ listContentBlockSections: vi.fn() }));

vi.mock('./cms.service.js', () => serviceMocks);

import { useSections } from './useSections.js';

beforeEach(() => {
  serviceMocks.listContentBlockSections.mockReset();
});

describe('useSections', () => {
  it('loads sections and clears the loading state', async () => {
    const sections = [createContentSection(), createContentSection({ prefix: 'about', count: 1 })];
    serviceMocks.listContentBlockSections.mockResolvedValue(sections);

    const { result } = renderHook(() => useSections());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.sections).toEqual(sections);
    expect(result.current.error).toBeNull();
  });

  it('maps API failures to the translated error message', async () => {
    serviceMocks.listContentBlockSections.mockRejectedValue(new ApiError('FORBIDDEN', 'Forbidden'));

    const { result } = renderHook(() => useSections());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('No tienes permisos para realizar esta acción.');
    expect(result.current.sections).toEqual([]);
  });

  it('does not update state after the hook is unmounted', async () => {
    let resolveSections: (value: ReturnType<typeof createContentSection>[]) => void = () => {};
    const pending = new Promise<ReturnType<typeof createContentSection>[]>((resolve) => {
      resolveSections = resolve;
    });
    serviceMocks.listContentBlockSections.mockReturnValue(pending);

    const { result, unmount } = renderHook(() => useSections());
    unmount();
    resolveSections([createContentSection()]);
    await pending;

    expect(result.current.sections).toEqual([]);
  });
});
