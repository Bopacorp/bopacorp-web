import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty.js';

interface CmsArchiveEmptyProps {
  searchQuery?: string;
}

export function CmsArchiveEmpty({ searchQuery }: CmsArchiveEmptyProps) {
  const hasSearch = !!searchQuery;
  const title = hasSearch ? 'Sin resultados' : 'El archivo está vacío';
  const description = hasSearch
    ? 'Ningún bloque coincide con tu búsqueda.'
    : 'No hay bloques CMS publicados todavía.';

  return (
    <div className="flex items-center justify-center py-20">
      <Empty>
        <EmptyHeader>
          <span className="font-display text-7xl font-semibold text-muted-foreground/30 leading-none select-none">
            —
          </span>
          <EmptyTitle className="font-display text-lg font-semibold tracking-tight">
            {title}
          </EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
