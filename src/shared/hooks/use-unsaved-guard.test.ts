import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useUnsavedGuard } from '@/shared/hooks/use-unsaved-guard.js';

describe('useUnsavedGuard', () => {
  it('closes clean forms immediately', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useUnsavedGuard({ onClose }));

    act(() => result.current.guardedClose());

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(result.current.showDiscard).toBe(false);
  });

  it('requires confirmation and discards dirty changes explicitly', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useUnsavedGuard({ onClose }));

    act(() => result.current.handleDirtyChange(true));
    act(() => result.current.guardedClose());
    expect(result.current.showDiscard).toBe(true);
    expect(onClose).not.toHaveBeenCalled();

    act(() => result.current.cancelDiscard());
    expect(result.current.showDiscard).toBe(false);
    expect(onClose).not.toHaveBeenCalled();

    act(() => result.current.guardedClose());
    act(() => result.current.handleDiscard());
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(result.current.dirtyRef.current).toBe(false);
  });
});
