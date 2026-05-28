import { Skeleton } from '@/components/ui/skeleton';

interface PageLoaderProps {
  children?: React.ReactNode;
}

export function PageLoader({ children }: PageLoaderProps) {
  if (children) return <>{children}</>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2 items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
