import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';

interface CmsBlockRowProps {
  block: ContentBlockResponse;
  index: number;
  onEdit: (block: ContentBlockResponse) => void;
}

function IndexNumber({ index }: { index: number }) {
  const padded = String(index + 1).padStart(2, '0');
  return (
    <span className="font-mono text-2xl font-normal text-muted-foreground tabular-nums">
      {padded}
    </span>
  );
}

function TypeBadge({ type }: { type: ContentBlockResponse['contentType'] }) {
  if (!type) return null;
  return (
    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
      {type.code}
    </Badge>
  );
}

function BodyPreview({ body }: { body: string | null }) {
  if (!body) return <p className="text-sm text-muted-foreground italic">Sin contenido previo.</p>;
  const preview = body.length > 140 ? `${body.slice(0, 140)}…` : body;
  return <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{preview}</p>;
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex-1 border-b border-dotted border-muted-foreground/30" />
      <span>{value}</span>
    </div>
  );
}

function Metadata({ block }: { block: ContentBlockResponse }) {
  const created = format(new Date(block.createdAt), 'dd MMM yyyy', { locale: es });
  const updated = format(new Date(block.updatedAt), 'dd MMM yyyy', { locale: es });

  return (
    <div className="font-mono flex flex-col gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
      <MetaItem label="publicado" value={created} />
      <MetaItem label="actualizado" value={updated} />
    </div>
  );
}

export function CmsBlockRow({ block, index, onEdit }: CmsBlockRowProps) {
  return (
    <div
      className="cms-row-in group relative grid grid-cols-1 gap-4 rounded-xl border border-border border-l-2 border-l-transparent p-5 transition-colors hover:border-l-primary md:grid-cols-[auto_1fr_auto] md:gap-6"
      style={{ animationDelay: `${Math.min(index, 9) * 50}ms` }}
    >
      <div className="hidden md:flex items-start pt-1">
        <IndexNumber index={index} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <TypeBadge type={block.contentType} />
          <span className="font-mono text-[10px] text-muted-foreground md:hidden">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
          {block.title ?? block.contentKey}
        </h3>
        <BodyPreview body={block.body} />
        <div className="flex items-center gap-1 pt-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(block)}>
            <Pencil data-icon="inline-start" />
            Editar contenido
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 md:items-end">
        <Metadata block={block} />
      </div>
    </div>
  );
}
