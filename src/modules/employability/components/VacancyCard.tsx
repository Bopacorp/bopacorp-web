import type { JobVacancyListItemResponse } from '@bopacorp/shared/employability';
import { ArrowRight, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VacancyCardProps {
  vacancy: JobVacancyListItemResponse;
  active: boolean;
  closed: boolean;
  onSelect: () => void;
}

export function VacancyCard({ vacancy, active, closed, onSelect }: VacancyCardProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!closed) onSelect();
      }}
      disabled={closed}
      className={cn(
        'group relative overflow-hidden rounded-xl border p-5 text-left transition-all',
        closed && 'cursor-not-allowed opacity-60',
        !closed && active && 'border-primary bg-primary/5 shadow-sm',
        !closed && !active && 'border-border bg-card hover:border-primary/40 hover:shadow-sm',
      )}
    >
      {!closed && active && (
        <span aria-hidden="true" className="absolute left-0 top-0 h-full w-1 bg-primary" />
      )}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {closed ? (
            <Badge variant="secondary" className="rounded-full">
              Cerrada
            </Badge>
          ) : (
            <Badge variant={active ? 'default' : 'secondary'} className="rounded-full">
              Publicada
            </Badge>
          )}
          {vacancy.closingDate && !closed && (
            <Badge variant="outline" className="rounded-full">
              Con cierre
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-brand text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
            {vacancy.title}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDateRange(vacancy.publicationDate, vacancy.closingDate)}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">
            {closed ? 'Postulaciones cerradas' : 'Postula en linea'}
          </span>
          {!closed && (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Ver detalle
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function formatDateRange(publication: string | null, closing: string | null): string {
  if (!publication) return 'Publicacion reciente';
  const start = new Date(publication).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  if (!closing) return `Desde ${start}`;
  const end = new Date(closing).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return `${start} - ${end}`;
}

export function isVacancyClosed(closingDate: string | null): boolean {
  if (!closingDate) return false;
  return new Date(closingDate).getTime() < Date.now();
}
