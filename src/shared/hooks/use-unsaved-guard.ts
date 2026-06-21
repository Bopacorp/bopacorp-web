import { useCallback, useRef, useState } from 'react';

interface UseUnsavedGuardOptions {
  onClose: () => void;
}

export function useUnsavedGuard({ onClose }: UseUnsavedGuardOptions) {
  const dirtyRef = useRef(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const handleDirtyChange = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  const guardedClose = useCallback(() => {
    if (dirtyRef.current) {
      setShowDiscard(true);
    } else {
      onClose();
    }
  }, [onClose]);

  const handleDiscard = useCallback(() => {
    setShowDiscard(false);
    dirtyRef.current = false;
    onClose();
  }, [onClose]);

  const cancelDiscard = useCallback(() => {
    setShowDiscard(false);
  }, []);

  return {
    dirtyRef,
    showDiscard,
    handleDirtyChange,
    guardedClose,
    handleDiscard,
    cancelDiscard,
  };
}
