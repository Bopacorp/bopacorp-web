import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CMS_IMAGE_KEYS } from '@/modules/cms/cms-image-blocks.js';
import { createContentBlock } from '@/test/fixtures/cms-fixtures.js';
import { renderHook, waitFor } from '@/test/test-utils.js';

const apiMocks = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock('@/services/api.js', () => apiMocks);

import { useCmsLanding } from './use-cms-landing.js';

beforeEach(() => {
  apiMocks.request.mockReset();
});

describe('useCmsLanding', () => {
  it('loads CMS blocks and fills missing image blocks with local fallbacks', async () => {
    const hero = createContentBlock({ contentKey: 'hero.title' });
    apiMocks.request.mockResolvedValue({ blocks: { [hero.contentKey]: hero } });

    const { result } = renderHook(() => useCmsLanding());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.blocks?.[hero.contentKey]).toEqual(hero);
    expect(result.current.blocks?.[CMS_IMAGE_KEYS.heroBackground]?.body).toBeTruthy();
    expect(result.current.blocks?.[CMS_IMAGE_KEYS.aboutImage]?.body).toBeTruthy();
    expect(result.current.blocks?.[CMS_IMAGE_KEYS.logo]?.body).toBeTruthy();
    expect(apiMocks.request).toHaveBeenCalledWith({ method: 'GET', url: '/cms/landing' });
  });

  it('exposes an error and recovers through retry', async () => {
    const recovered = createContentBlock({ contentKey: 'hero.title', body: 'Recovered' });
    apiMocks.request
      .mockRejectedValueOnce(new Error('CMS unavailable'))
      .mockResolvedValueOnce({ blocks: { [recovered.contentKey]: recovered } });
    const { result } = renderHook(() => useCmsLanding());

    await waitFor(() => expect(result.current.error).toBe('CMS unavailable'));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.blocks?.['hero.title']?.body).toBe('Recovered'));
    expect(result.current.error).toBeNull();
    expect(apiMocks.request).toHaveBeenCalledTimes(2);
  });

  it('does not publish a stale response after unmount', async () => {
    let resolveRequest: (value: {
      blocks: Record<string, ReturnType<typeof createContentBlock>>;
    }) => void = () => {};
    const pending = new Promise<{ blocks: Record<string, ReturnType<typeof createContentBlock>> }>(
      (resolve) => {
        resolveRequest = resolve;
      },
    );
    apiMocks.request.mockReturnValue(pending);
    const { result, unmount } = renderHook(() => useCmsLanding());
    unmount();
    resolveRequest({ blocks: {} });
    await pending;

    expect(result.current.blocks).toBeNull();
  });
});
