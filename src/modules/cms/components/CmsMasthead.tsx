import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

interface CmsMastheadProps {
  count: number;
  lastUpdatedAt: Date | null;
}

function LastEditText({ date }: { date: Date | null }) {
  if (!date) return null;
  const distance = formatDistanceToNow(date, { addSuffix: true, locale: es });
  return <span>· última edición {distance}</span>;
}

function MetaLine({ count, lastUpdatedAt }: { count: number; lastUpdatedAt: Date | null }) {
  return (
    <p className="font-mono text-xs text-muted-foreground">
      {count} {count === 1 ? 'entrada' : 'entradas'} <LastEditText date={lastUpdatedAt} />
    </p>
  );
}

export function CmsMasthead({ count, lastUpdatedAt }: CmsMastheadProps) {
  return (
    <div className="relative flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl">
          Bloques de Contenido
        </h2>
        <MetaLine count={count} lastUpdatedAt={lastUpdatedAt} />
      </div>
      <Separator />
    </div>
  );
}
