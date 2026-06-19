import { Skeleton } from '@/components/ui/skeleton';

export function VacanciesSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-3 w-2/5" />
            <div className="flex items-center justify-between border-t border-border pt-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
