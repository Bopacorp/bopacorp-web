import { ArrowLeft, BriefcaseBusiness } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ApplyJobVacancyResponse } from '@/modules/employability';
import {
  ApplyDialog,
  ApplySuccessDialog,
  isVacancyClosed,
  usePublicJobVacancy,
  VacanciesEmpty,
  VacancyDetailPanel,
} from '@/modules/employability';
import { ErrorState } from '@/shared/ui';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? null;
  const { vacancy, loading, error, retry } = usePublicJobVacancy(id);
  const [applyOpen, setApplyOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successResponse, setSuccessResponse] = useState<ApplyJobVacancyResponse | null>(null);

  const closed = vacancy ? isVacancyClosed(vacancy.closingDate) : false;
  const applyVacancy = vacancy ? { id: vacancy.id, title: vacancy.title } : null;

  const handleSuccess = (response: ApplyJobVacancyResponse) => {
    setApplyOpen(false);
    setSuccessResponse(response);
    setSuccessOpen(true);
  };

  return (
    <div className="w-full bg-background text-foreground">
      <section className="border-b border-border bg-gradient-to-br from-background via-background to-muted/30 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4">
          <Button asChild variant="ghost" size="sm" className="w-fit">
            <Link to="/jobs">
              <ArrowLeft data-icon="inline-start" />
              Volver a vacantes
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="size-5 text-primary" />
            <div>
              <h1 className="font-brand text-3xl font-semibold tracking-tight sm:text-4xl">
                Detalle de la vacante
              </h1>
              <p className="text-sm text-muted-foreground">
                Conoce los requisitos y postulate en linea.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          {error && !loading && (
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>No pudimos cargar la vacante</CardTitle>
                <CardDescription>Revisa tu conexion o intenta nuevamente.</CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorState message={error.message} code={error.code} onRetry={retry} />
              </CardContent>
            </Card>
          )}

          {!error && !loading && !vacancy && (
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Esta vacante ya no esta disponible</CardTitle>
                <CardDescription>Es posible que haya sido retirada o haya cerrado.</CardDescription>
              </CardHeader>
              <CardContent>
                <VacanciesEmpty />
                <div className="mt-4 flex justify-center">
                  <Button asChild>
                    <Link to="/jobs">Ver vacantes disponibles</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!error && (
            <VacancyDetailPanel
              vacancy={vacancy}
              loading={loading}
              error={null}
              onRetry={retry}
              onApply={() => setApplyOpen(true)}
              closed={closed}
            />
          )}

          {!error && vacancy && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">ID: {vacancy.id}</Badge>
              {vacancy.publicationDate && (
                <span>
                  Publicada el{' '}
                  {new Date(vacancy.publicationDate).toLocaleDateString('es-EC', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      <ApplyDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        vacancy={applyVacancy}
        onSuccess={handleSuccess}
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
