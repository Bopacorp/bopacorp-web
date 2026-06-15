import type { JobVacancyListItemResponse } from '@bopacorp/shared/employability';
import { Calendar } from 'lucide-react';
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
        'rounded-2xl border p-5 text-left transition-colors',
        closed && 'cursor-not-allowed opacity-60',
        !closed && active && 'border-primary bg-primary/5 shadow-sm',
        !closed && !active && 'border-border bg-card hover:border-primary/30 hover:bg-muted/30',
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {closed ? (
            <Badge variant="secondary">Cerrada</Badge>
          ) : (
            <Badge variant={active ? 'default' : 'secondary'}>Publicada</Badge>
          )}
          {vacancy.closingDate && !closed && <Badge variant="outline">Con cierre</Badge>}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold tracking-tight">{vacancy.title}</h3>
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
          {!closed && <span className="text-sm font-medium text-primary">Ver detalle</span>}
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
