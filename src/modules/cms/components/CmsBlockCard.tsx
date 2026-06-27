import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';

interface CmsBlockCardProps {
  block: ContentBlockResponse;
  onEdit: (block: ContentBlockResponse) => void;
}

function isVisualBlock(type: ContentBlockResponse['contentType']) {
  return type?.code === 'IMAGE' || type?.code === 'BANNER';
}

export function CmsBlockCard({ block, onEdit }: CmsBlockCardProps) {
  const { t, i18n } = useTranslation();
  const keyLabel = block.contentKey.split('.').slice(1).join('.');
  const locale = i18n.language === 'en' ? enUS : es;
  const updated = format(new Date(block.updatedAt), 'dd MMM yyyy', { locale });

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/50">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-muted-foreground truncate">{keyLabel}</span>
        <Badge
          variant="outline"
          className="font-mono text-[10px] uppercase tracking-wider shrink-0"
        >
          {block.contentType?.code ?? '—'}
        </Badge>
      </div>

      {block.title && (
        <h4 className="text-sm font-semibold text-foreground leading-tight">{block.title}</h4>
      )}

      {isVisualBlock(block.contentType) ? (
        block.body ? (
          <img
            src={block.body}
            alt={t('cms.preview')}
            className="h-20 w-full rounded-md border border-border object-cover"
          />
        ) : (
          <p className="text-xs text-muted-foreground italic">{t('cms.noImage')}</p>
        )
      ) : (
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {block.body || t('cms.noContent')}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
        <span className="font-mono text-[10px] text-muted-foreground">{updated}</span>
        <Button variant="outline" size="sm" onClick={() => onEdit(block)} className="h-7 text-xs">
          <Pencil data-icon="inline-start" />
          {t('cms.edit')}
        </Button>
      </div>
    </div>
  );
}
