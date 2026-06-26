import type { ListJobVacanciesQuery } from '@bopacorp/shared/employability';
import { BriefcaseBusiness, CheckCircle2, Loader2, Send, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ApplyJobVacancyResponse, JobVacancyListItemResponse } from '@/modules/employability';
import {
  ApplyDialog,
  ApplySuccessDialog,
  isVacancyClosed,
  usePublicJobVacancy,
  usePublishedVacancies,
  VacanciesEmpty,
  VacanciesSkeleton,
  VacancyCard,
  VacancyDetailPanel,
} from '@/modules/employability';
import { BlueprintGrid } from '@/modules/landing/components/decor.js';
import { ErrorState } from '@/shared/ui';

const BASE_QUERY: Omit<ListJobVacanciesQuery, 'page'> = {
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const query = useMemo<ListJobVacanciesQuery>(() => ({ ...BASE_QUERY, page }), [page]);
  const { vacancies, meta, loading, error, retry } = usePublishedVacancies(query);
  const [accumulated, setAccumulated] = useState<JobVacancyListItemResponse[]>([]);
  const [activeVacancyId, setActiveVacancyId] = useState<string | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successResponse, setSuccessResponse] = useState<ApplyJobVacancyResponse | null>(null);

  useEffect(() => {
    if (loading || vacancies.length === 0) return;
    setAccumulated((prev) => {
      if (page === 1) return vacancies;
      const existingIds = new Set(prev.map((v) => v.id));
      const fresh = vacancies.filter((v) => !existingIds.has(v.id));
      return [...prev, ...fresh];
    });
  }, [vacancies, page, loading]);

  const initialLoading = loading && accumulated.length === 0;
  const loadingMore = loading && accumulated.length > 0;
  const hasMore = meta ? page < meta.totalPages : false;

  const activeListItem = useMemo<JobVacancyListItemResponse | null>(() => {
    if (!activeVacancyId) return null;
    return accumulated.find((vacancy) => vacancy.id === activeVacancyId) ?? null;
  }, [accumulated, activeVacancyId]);

  const {
    vacancy: activeDetail,
    loading: detailLoading,
    error: detailError,
    retry: retryDetail,
  } = usePublicJobVacancy(activeVacancyId);

  const closed = activeListItem ? isVacancyClosed(activeListItem.closingDate) : false;
  const applyVacancyId = activeDetail?.id ?? activeListItem?.id ?? null;
  const applyVacancyTitle = activeDetail?.title ?? activeListItem?.title ?? '';
  const applyVacancy = applyVacancyId ? { id: applyVacancyId, title: applyVacancyTitle } : null;

  const handleSelect = (vacancy: JobVacancyListItemResponse) => {
    setActiveVacancyId(vacancy.id);
  };

  const handleApplySuccess = (response: ApplyJobVacancyResponse) => {
    setApplyOpen(false);
    setSuccessResponse(response);
    setSuccessOpen(true);
  };

  return (
    <div className="w-full bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border px-6 pt-16 pb-10 md:pt-20 md:pb-12">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-32 size-[34rem] rounded-full bg-primary/10 blur-[140px] pointer-events-none"
        />
        <BlueprintGrid className="text-foreground/[0.04] mask-fade-top" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-primary" />
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]"
            >
              Trabaja con nosotros
            </Badge>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            <div className="flex flex-col gap-5">
              <h1 className="font-brand max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
                Postula a una vacante activa o envia tu perfil abierto al equipo de talento.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                Revisa la lista de roles disponibles, selecciona la vacante que te interese y envia
                tu postulacion con tu CV en PDF.
              </p>
            </div>

            <Card className="border-border bg-card/60 backdrop-blur-sm">
              <CardHeader className="gap-2">
                <CardTitle className="font-brand text-base font-semibold tracking-tight">
                  Proceso simple
                </CardTitle>
                <CardDescription>
                  Selecciona un rol, adjunta tu CV y completa tus datos antes de enviar.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2.5">
                <ProcessStep
                  icon={CheckCircle2}
                  title="1. Elige la vacante"
                  description="Cada rol tiene su aplicacion propia."
                />
                <ProcessStep
                  icon={Upload}
                  title="2. Sube tu PDF"
                  description="El CV es obligatorio para aplicar."
                />
                <ProcessStep
                  icon={Send}
                  title="3. Envio final"
                  description="Tus datos quedan listos para el reclutador."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:py-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="size-5 text-primary" />
                <h2 className="font-brand text-2xl font-semibold tracking-tight">
                  Ofertas disponibles
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Selecciona una vacante para ver los detalles y postularte.
              </p>
              {meta && meta.totalItems > 0 && (
                <p className="text-xs text-muted-foreground">
                  Mostrando {accumulated.length} de {meta.totalItems}
                </p>
              )}
            </div>

            {initialLoading && <VacanciesSkeleton />}

            {!loading && error && (
              <ErrorState message={error.message} code={error.code} onRetry={retry} />
            )}

            {!initialLoading && !error && accumulated.length === 0 && <VacanciesEmpty />}

            {accumulated.length > 0 && (
              <div className="flex flex-col gap-3">
                {accumulated.map((vacancy) => (
                  <VacancyCard
                    key={vacancy.id}
                    vacancy={vacancy}
                    active={vacancy.id === activeVacancyId}
                    closed={isVacancyClosed(vacancy.closingDate)}
                    onSelect={() => handleSelect(vacancy)}
                  />
                ))}
                {hasMore && (
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={loadingMore}
                    className="w-full"
                  >
                    {loadingMore ? (
                      <Loader2 className="animate-spin" data-icon="inline-start" />
                    ) : null}
                    {loadingMore ? 'Cargando...' : 'Cargar más vacantes'}
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <VacancyDetailPanel
              vacancy={activeDetail}
              loading={detailLoading}
              error={detailError}
              onRetry={retryDetail}
              onApply={() => setApplyOpen(true)}
              closed={closed}
            />
          </div>
        </div>
      </section>

      <ApplyDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        vacancy={applyVacancy}
        onSuccess={handleApplySuccess}
      />
      {successResponse && (
        <ApplySuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          response={successResponse}
        />
      )}
    </div>
  );
}

function ProcessStep({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof CheckCircle2;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 transition-colors hover:border-primary/40">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
