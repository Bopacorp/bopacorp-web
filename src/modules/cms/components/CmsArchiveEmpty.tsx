import { useTranslation } from 'react-i18next';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty.js';

interface CmsArchiveEmptyProps {
  searchQuery?: string;
}

export function CmsArchiveEmpty({ searchQuery }: CmsArchiveEmptyProps) {
  const { t } = useTranslation();
  const hasSearch = !!searchQuery;
  const title = hasSearch ? t('cms.noResults') : t('cms.emptyArchive');
  const description = hasSearch ? t('cms.noResultsDesc') : t('cms.emptyDesc');

  return (
    <div className="flex items-center justify-center py-20">
      <Empty>
        <EmptyHeader>
          <span className="text-7xl font-semibold text-muted-foreground/30 leading-none select-none">
            —
          </span>
          <EmptyTitle className="text-lg font-semibold tracking-tight">{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
