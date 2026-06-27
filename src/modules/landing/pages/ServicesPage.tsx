import type { ListPublicCatalogQuery } from '@bopacorp/shared';
import {
  AlertCircle,
  FileText,
  Globe,
  Headset,
  LayoutGrid,
  ListFilter,
  MessageCircle,
  RefreshCw,
  Shield,
  Tag,
  X,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebouncedValue } from '@/hooks/use-debounced-value.js';
import { cn } from '@/lib/utils';
import { PlanCard } from '@/modules/catalog/components/PlanCard.js';
import { usePublicCatalogItems } from '@/modules/catalog/hooks/use-public-catalog-items.js';
import { usePublicCategories } from '@/modules/catalog/hooks/use-public-categories.js';
import { usePublicSegments } from '@/modules/catalog/hooks/use-public-segments.js';
import { useContactDialog } from '@/modules/contact/index.js';
import { ContourMotif } from '../components/decor.js';

interface Benefit {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: LayoutGrid,
    title: 'Catálogo integral',
    desc: 'Voz, conectividad, servicios digitales y equipos en un solo lugar para tu empresa.',
  },
  {
    icon: Tag,
    title: 'Precios corporativos',
    desc: 'Tarifas preferenciales diseñadas para empresas con condiciones exclusivas de mercado.',
  },
  {
    icon: Headset,
    title: 'Soporte dedicado',
    desc: 'Atención personalizada con un equipo comercial exclusivo para resolver tus necesidades.',
  },
  {
    icon: Globe,
    title: 'Cobertura nacional',
    desc: 'Red Tigo con presencia en todo Ecuador para mantener tu operación siempre conectada.',
  },
  {
    icon: FileText,
    title: 'Facturación centralizada',
    desc: 'Un solo proveedor y una sola factura para todos los servicios de telecomunicaciones.',
  },
  {
    icon: Shield,
    title: 'Respaldo empresarial',
    desc: 'Contratos flexibles con el respaldo de un distribuidor oficial Tigo certificado.',
  },
];

function BenefitCard({ benefit }: { benefit: Benefit }) {
  const Icon = benefit.icon;
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
      <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <h3 className="font-brand text-base font-semibold tracking-tight text-foreground">
        {benefit.title}
      </h3>
      <p className="text-sm font-normal leading-relaxed text-muted-foreground">{benefit.desc}</p>
    </div>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <header className="flex flex-col gap-3 items-start">
      <span aria-hidden="true" className="h-px w-10 bg-primary" />
      <h2 className="font-brand text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="max-w-2xl text-sm md:text-base font-normal leading-relaxed text-muted-foreground">
        {desc}
      </p>
    </header>
  );
}

function BeneficiosSection() {
  return (
    <section className="w-full py-16 px-6 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <SectionHeader
          title="Beneficios incluidos"
          desc="Todos nuestros planes corporativos incluyen una suite de beneficios diseñados para mantener tu empresa siempre conectada."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => (
            <BenefitCard key={benefit.title} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}

const DEFAULT_CATEGORY_SLUG = 'voz';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  const categorySlug = categoriaParam ?? DEFAULT_CATEGORY_SLUG;

  const { categories } = usePublicCategories();
  const { segments } = usePublicSegments();

  const categoryIdFromSlug = useMemo(
    () => categories.find((c) => c.slug === categorySlug)?.id,
    [categories, categorySlug],
  );

  const [categoryId, setCategoryId] = useState<string>();
  const [segmentId, setSegmentId] = useState<string>();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    if (categoryIdFromSlug) {
      setCategoryId(categoryIdFromSlug);
    }
  }, [categoryIdFromSlug]);

  function handleCategoryChange(id: string | undefined) {
    setCategoryId(id);
    const slug = categories.find((c) => c.id === id)?.slug;
    if (slug && slug !== DEFAULT_CATEGORY_SLUG) {
      setSearchParams({ categoria: slug }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }

  const debouncedMinPrice = useDebouncedValue(minPrice);
  const debouncedMaxPrice = useDebouncedValue(maxPrice);

  const filters = useMemo<ListPublicCatalogQuery | undefined>(() => {
    if (!categoryId && !categorySlug) return undefined;
    const f: ListPublicCatalogQuery = {};
    if (categoryId) {
      f.categoryId = categoryId;
    } else {
      f.categorySlug = categorySlug;
    }
    if (segmentId) f.segmentId = segmentId;
    if (debouncedMinPrice) f.minPrice = Number(debouncedMinPrice);
    if (debouncedMaxPrice) f.maxPrice = Number(debouncedMaxPrice);
    return f;
  }, [categoryId, categorySlug, segmentId, debouncedMinPrice, debouncedMaxPrice]);

  const { items, loading, reloading, error, retry } = usePublicCatalogItems(filters);

  const hasFilters = Boolean(
    (categoryId && categoryId !== categoryIdFromSlug) || segmentId || minPrice || maxPrice,
  );

  function clearFilters() {
    setCategoryId(categoryIdFromSlug);
    setSegmentId(undefined);
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({}, { replace: true });
  }

  return (
    <div className="w-full flex flex-col font-sans">
      <section className="w-full relative py-20 px-6 border-b border-border/50 bg-hero overflow-hidden min-h-[300px] flex items-center">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <h1 className="font-brand text-4xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            Cátalogo de <span className="text-primary">Servicios</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
            Soluciones integrales de telecomunicaciones diseñadas para impulsar el crecimiento
            operativo de tu empresa.
          </p>
        </div>
      </section>

      <BeneficiosSection />

      <PlansSection
        loading={loading}
        reloading={reloading}
        error={Boolean(error)}
        items={items}
        onRetry={retry}
        categories={categories}
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        segments={segments}
        segmentId={segmentId}
        onSegmentChange={setSegmentId}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        hasFilters={hasFilters}
        onClear={clearFilters}
      />

      <CtaSection />
    </div>
  );
}

function PlansSection({
  loading,
  reloading,
  error,
  items,
  onRetry,
  categories,
  categoryId,
  onCategoryChange,
  segments,
  segmentId,
  onSegmentChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  hasFilters,
  onClear,
}: {
  loading: boolean;
  reloading: boolean;
  error: boolean;
  items: ReturnType<typeof usePublicCatalogItems>['items'];
  onRetry: () => void;
  categories: { id: string; name: string; slug: string }[];
  categoryId: string | undefined;
  onCategoryChange: (v: string | undefined) => void;
  segments: { id: string; code: string; name: string }[];
  segmentId: string | undefined;
  onSegmentChange: (v: string | undefined) => void;
  minPrice: string;
  onMinPriceChange: (v: string) => void;
  maxPrice: string;
  onMaxPriceChange: (v: string) => void;
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <section className="w-full py-16 px-6 bg-muted">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <SectionHeader
          title="Nuestro catálogo de servicios"
          desc="Encuentra la solución que mejor se adapte a las necesidades de tu empresa."
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListFilter className="size-4 text-muted-foreground" />
              Filtrar servicios
              {hasFilters && !loading && (
                <Badge variant="secondary" className="tabular-nums">
                  {items.length} {items.length === 1 ? 'resultado' : 'resultados'}
                </Badge>
              )}
            </CardTitle>
            {hasFilters && (
              <CardAction>
                <Button variant="ghost" size="sm" onClick={onClear} className="gap-1.5">
                  <X className="size-3.5" />
                  Limpiar
                </Button>
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex w-full flex-col gap-1.5 sm:w-52">
                <label
                  htmlFor="filter-category"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Categoría
                </label>
                <Select
                  value={categoryId ?? 'all'}
                  onValueChange={(v) => onCategoryChange(v === 'all' ? undefined : v)}
                >
                  <SelectTrigger id="filter-category" className="w-full">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="w-(--radix-select-trigger-width)">
                    <SelectGroup>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-full flex-col gap-1.5 sm:w-52">
                <label
                  htmlFor="filter-segment"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Segmento
                </label>
                <Select
                  value={segmentId ?? 'all'}
                  onValueChange={(v) => onSegmentChange(v === 'all' ? undefined : v)}
                >
                  <SelectTrigger id="filter-segment" className="w-full">
                    <SelectValue placeholder="Todos los segmentos" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="w-(--radix-select-trigger-width)">
                    <SelectGroup>
                      <SelectItem value="all">Todos los segmentos</SelectItem>
                      {segments.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-full flex-col gap-1.5 sm:w-32">
                <label htmlFor="filter-min" className="text-xs font-medium text-muted-foreground">
                  Precio mín. ($)
                </label>
                <Input
                  id="filter-min"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  value={minPrice}
                  onChange={(e) => onMinPriceChange(e.target.value)}
                  className="tabular-nums"
                />
              </div>

              <div className="flex w-full flex-col gap-1.5 sm:w-32">
                <label htmlFor="filter-max" className="text-xs font-medium text-muted-foreground">
                  Precio máx. ($)
                </label>
                <Input
                  id="filter-max"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="999.99"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(e.target.value)}
                  className="tabular-nums"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <PlansSkeleton />
        ) : error ? (
          <PlansError onRetry={onRetry} />
        ) : items.length === 0 ? (
          <PlansEmpty />
        ) : (
          <div
            className={cn(
              'transition-opacity duration-200',
              reloading && 'pointer-events-none opacity-50',
            )}
          >
            <PlansGrid items={items} />
          </div>
        )}
      </div>
    </section>
  );
}

function PlansGrid({ items }: { items: ReturnType<typeof usePublicCatalogItems>['items'] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <PlanCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

function CtaSection() {
  const { openContactDialog } = useContactDialog();
  return (
    <section className="relative overflow-hidden bg-hero px-6 py-24 text-white md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            'repeating-linear-gradient(115deg, transparent 0px, transparent 80px, var(--color-plan-1) 80px, var(--color-plan-1) 82px, transparent 82px, transparent 160px, var(--color-plan-3) 160px, var(--color-plan-3) 162px, transparent 162px, transparent 240px, var(--color-plan-5) 240px, var(--color-plan-5) 242px)',
          opacity: 0.12,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-r from-hero via-hero/95 to-hero/60"
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 right-1/4 size-[32rem] rounded-full bg-primary/20 blur-[160px] pointer-events-none z-0"
      />
      <ContourMotif className="absolute -right-32 top-1/2 w-[40rem] -translate-y-1/2 text-white/[0.08] z-0" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-8">
        <h2 className="landing-rise font-brand text-balance text-5xl font-bold leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-7xl">
          ¿No sabes cuál plan elegir?
        </h2>
        <p
          className="landing-rise max-w-lg text-lg font-normal leading-relaxed text-white/70"
          style={{ animationDelay: '100ms' }}
        >
          Habla con un asesor y encuentra el plan ideal. Nuestro equipo comercial te ayuda a elegir
          la solución que mejor se adapta a tu empresa. Sin compromisos.
        </p>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => openContactDialog()}
          className="landing-rise h-14 rounded-md px-10 text-base font-semibold"
          style={{ animationDelay: '200ms' }}
        >
          <MessageCircle data-icon="inline-start" />
          Contactar un asesor
        </Button>
      </div>
    </section>
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
