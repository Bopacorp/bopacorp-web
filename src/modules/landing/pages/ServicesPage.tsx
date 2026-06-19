import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlanCard } from '@/modules/catalog/components/PlanCard.js';
import { usePublicCatalogItems } from '@/modules/catalog/hooks/use-public-catalog-items.js';

export default function ServicesPage() {
  const { items, loading, error, retry } = usePublicCatalogItems();

  return (
    <div className="w-full flex flex-col font-sans">
      <section className="w-full relative py-24 px-6 border-b border-border/50 bg-hero overflow-hidden min-h-[350px] flex items-center">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            Cátalogo de <span className="text-primary">Servicios</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
            Soluciones integrales de telecomunicaciones diseñadas para impulsar el crecimiento
            operativo de tu empresa.
          </p>
        </div>
      </section>

      <section className="w-full py-24 px-6 bg-muted">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <PlansSkeleton />
          ) : error ? (
            <PlansError onRetry={retry} />
          ) : items.length === 0 ? (
            <PlansEmpty />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <PlanCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const SKELETON_IDS = ['s1', 's2', 's3', 's4', 's5'];

function PlansSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
        >
          <Skeleton className="h-28 rounded-none" />
          <div className="flex flex-col gap-5 px-6 py-6">
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="flex flex-col gap-3.5">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex flex-col gap-2.5 mt-2">
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlansError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-7" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-brand text-xl font-semibold text-foreground">
          No se pudo cargar el catálogo
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Ocurrió un error al obtener los servicios. Intenta de nuevo en unos momentos.
        </p>
      </div>
      <Button variant="outline" onClick={onRetry} className="gap-2">
        <RefreshCw className="size-4" />
        Reintentar
      </Button>
    </div>
  );
}

function PlansEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <h2 className="font-brand text-xl font-semibold text-foreground">
        No hay servicios disponibles
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        En este momento no hay planes publicados para mostrar. Vuelve pronto.
      </p>
    </div>
  );
}
