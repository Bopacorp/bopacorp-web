import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CmsMastheadProps {
  count: number;
  lastUpdatedAt: Date | null;
}

function EyebrowRow() {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        BOPACORP · ADMINISTRACIÓN
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:inline">
        TOMO I · EDICIÓN ÚNICA
      </span>
    </div>
  );
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

function VerticalLabel() {
  return (
    <div className="hidden md:flex absolute -right-8 top-0 h-full items-center">
      <span
        className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/30"
        style={{ writingMode: 'vertical-rl' }}
      >
        ADMINISTRACIÓN
      </span>
    </div>
  );
}

export function CmsMasthead({ count, lastUpdatedAt }: CmsMastheadProps) {
  return (
    <div className="relative flex flex-col gap-6 pb-6">
      <EyebrowRow />

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl">
          Bloques de Contenido
        </h2>
        <p className="font-display max-w-lg text-base text-muted-foreground">
          Un registro del catálogo editorial publicado y mantenible desde un solo lugar.
        </p>
        <MetaLine count={count} lastUpdatedAt={lastUpdatedAt} />
      </div>

      <div className="relative flex items-center justify-center">
        <div className="h-px w-full bg-border" />
        <span className="absolute bg-background px-3 text-muted-foreground">·</span>
      </div>

      <VerticalLabel />
    </div>
  );
}
