import type { PublicJobVacancyResponse } from '@bopacorp/shared/employability';
import { ArrowRight, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { VacancyDetailError } from './VacancyDetailError.js';

type VacancySummary = Pick<
  PublicJobVacancyResponse,
  'id' | 'title' | 'description' | 'requirements' | 'publicationDate' | 'closingDate'
>;

interface VacancyDetailPanelProps {
  vacancy: VacancySummary | null;
  loading: boolean;
  error: { code: string; message: string } | null;
  onRetry: () => void;
  onApply: () => void;
  closed: boolean;
}

export function VacancyDetailPanel({
  vacancy,
  loading,
  error,
  onRetry,
  onApply,
  closed,
}: VacancyDetailPanelProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="gap-3 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {loading && !vacancy ? (
            <>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </>
          ) : (
            <>
              {closed ? (
                <Badge variant="secondary" className="rounded-full">
                  Cerrada
                </Badge>
              ) : (
                <Badge className="rounded-full">Publicada</Badge>
              )}
              {vacancy?.closingDate && !closed && (
                <Badge variant="outline" className="rounded-full">
                  Cierra {formatShortDate(vacancy.closingDate)}
                </Badge>
              )}
            </>
          )}
        </div>
        <CardTitle className="font-brand text-2xl font-semibold tracking-tight">
          {loading ? (
            <Skeleton className="h-7 w-2/3" />
          ) : (
            (vacancy?.title ?? 'Selecciona una vacante')
          )}
        </CardTitle>
        <CardDescription>
          {loading ? (
            <Skeleton className="mt-2 h-4 w-1/2" />
          ) : vacancy ? (
            'Revisa la descripcion y los requisitos para postularte.'
          ) : (
            'Elige una vacante de la lista para ver los detalles.'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-6">
        {error && !loading && (
          <VacancyDetailError message={error.message} code={error.code} onRetry={onRetry} />
        )}
        {!error && loading && !vacancy && (
          <>
            <DetailSection title="Descripcion del rol" body="" loading={true} />
            <DetailSection title="Requisitos" body="" loading={true} />
            <div className="flex flex-wrap gap-3 border-t border-border pt-5">
              <Skeleton className="h-11 w-48 rounded-md" />
            </div>
          </>
        )}
        {!error && vacancy && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <DetailSection
              title="Descripcion del rol"
              body={vacancy.description}
              loading={loading}
            />
            <DetailSection title="Requisitos" body={vacancy.requirements} loading={loading} />
            <div className="flex flex-wrap gap-3 border-t border-border pt-5">
              <Button
                type="button"
                onClick={onApply}
                disabled={closed || loading}
                size="lg"
                className="h-11 rounded-md px-6 text-sm font-medium"
              >
                <Send data-icon="inline-start" />
                {closed ? 'Postulaciones cerradas' : 'Postular a esta vacante'}
                {!closed && !loading && <ArrowRight className="ml-1 size-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DetailSection({
  title,
  body,
  loading,
}: {
  title: string;
  body: string;
  loading: boolean;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
        <span aria-hidden="true" className="h-3 w-px bg-primary" />
        {title}
      </h3>
      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{body}</p>
      )}
    </section>
  );
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
