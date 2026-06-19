import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CmsBlockCard } from './CmsBlockCard.js';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  about: 'Acerca de',
  cta: 'Llamada a acción',
  site: 'Sitio general',
};

interface CmsSectionProps {
  prefix: string;
  blocks: ContentBlockResponse[];
  onEdit: (block: ContentBlockResponse) => void;
}

export function CmsSection({ prefix, blocks, onEdit }: CmsSectionProps) {
  const [open, setOpen] = useState(true);
  const label = SECTION_LABELS[prefix] ?? prefix;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-3 py-2 text-left">
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <Badge variant="secondary" className="font-mono text-[10px]">
          {blocks.length}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <CmsBlockCard key={block.id} block={block} onEdit={onEdit} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
