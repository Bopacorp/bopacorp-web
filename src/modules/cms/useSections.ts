import type { ContentBlockSectionResponse } from '@bopacorp/shared/catalog';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/shared/errors/index.js';
import { listContentBlockSections } from './cms.service.js';

export function useSections() {
  const [sections, setSections] = useState<ContentBlockSectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listContentBlockSections()
      .then((data) => {
        if (!cancelled) {
          setSections(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { sections, loading, error };
}
