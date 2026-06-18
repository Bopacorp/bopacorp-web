import type { JobVacancyResponse } from '@bopacorp/shared/employability';
import { Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { VacancyDetailError } from './VacancyDetailError.js';

type VacancySummary = Pick<
  JobVacancyResponse,
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
          {closed ? <Badge variant="secondary">Cerrada</Badge> : <Badge>Publicada</Badge>}
          {vacancy?.closingDate && !closed && (
            <Badge variant="outline">Cierra {formatShortDate(vacancy.closingDate)}</Badge>
          )}
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">
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
        {!error && vacancy && (
          <>
            <DetailSection
              title="Descripcion del rol"
              body={vacancy.description}
              loading={loading}
            />
            <DetailSection title="Requisitos" body={vacancy.requirements} loading={loading} />
            <div className="flex flex-wrap gap-3 border-t border-border pt-4">
              <Button type="button" onClick={onApply} disabled={closed || loading}>
                <Send data-icon="inline-start" />
                {closed ? 'Postulaciones cerradas' : 'Postular a esta vacante'}
              </Button>
            </div>
          </>
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
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
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
