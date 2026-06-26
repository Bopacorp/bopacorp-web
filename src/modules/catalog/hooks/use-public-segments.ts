import { useEffect, useState } from 'react';
import { listPublicSegments } from '../catalog.service.js';

type Segment = Awaited<ReturnType<typeof listPublicSegments>>[number];

export function usePublicSegments() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listPublicSegments()
      .then((data) => {
        if (!cancelled) setSegments(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { segments, loading };
}
