import { useEffect, useState } from 'react';
import { listPublicCategories } from '../catalog.service.js';

type Category = Awaited<ReturnType<typeof listPublicCategories>>[number];

export function usePublicCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listPublicCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
}
