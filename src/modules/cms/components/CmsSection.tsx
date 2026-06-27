import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CmsBlockCard } from './CmsBlockCard.js';

const SECTION_LABEL_KEYS: Record<string, string> = {
  hero: 'cms.section.hero',
  about: 'cms.section.about',
  cta: 'cms.section.cta',
  about_page: 'cms.section.aboutPage',
  site: 'cms.section.site',
};

interface CmsSectionProps {
  prefix: string;
  blocks: ContentBlockResponse[];
  onEdit: (block: ContentBlockResponse) => void;
}

export function CmsSection({ prefix, blocks, onEdit }: CmsSectionProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const labelKey = SECTION_LABEL_KEYS[prefix];
  const label = labelKey ? t(labelKey) : prefix;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-3 py-2 text-left">
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <Badge variant="secondary" className="text-[10px]">
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
