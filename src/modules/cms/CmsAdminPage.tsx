import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.js';
import { ApiError } from '@/services/api.js';
import { ErrorState, PageLoader } from '@/shared/ui';
import { updateContentBlock } from './cms.service.js';
import { CmsArchiveEmpty } from './components/CmsArchiveEmpty.js';
import { CmsBlockRow } from './components/CmsBlockRow.js';
import { CmsEditDialog } from './components/CmsEditDialog.js';
import { CmsMasthead } from './components/CmsMasthead.js';
import { CmsSearchBar } from './components/CmsSearchBar.js';
import { useContentBlocks } from './useContentBlocks.js';

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return 'Error al guardar';
}

function updateBlock(prev: ContentBlockResponse[], id: string, updated: ContentBlockResponse) {
  return prev.map((block) => (block.id === id ? updated : block));
}

async function persistEdit(
  block: ContentBlockResponse,
  body: string,
  setBlocks: React.Dispatch<React.SetStateAction<ContentBlockResponse[]>>,
  onDone: () => void,
) {
  const updated = await updateContentBlock(block.id, { body });
  setBlocks((prev) => updateBlock(prev, block.id, updated));
  toast.success('Bloque actualizado');
  onDone();
}

function computeLastUpdatedAt(blocks: ContentBlockResponse[] | undefined): Date | null {
  if (!blocks?.length) return null;
  let max = blocks[0].updatedAt;
  for (const block of blocks) {
    if (new Date(block.updatedAt) > new Date(max)) {
      max = block.updatedAt;
    }
  }
  return new Date(max);
}

function getPageNumbers(current: number, total: number) {
  const pages: (number | string)[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current > 3) pages.push(1, '...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
  }
  return pages;
}

export function CmsPage() {
  const [editingBlock, setEditingBlock] = useState<ContentBlockResponse | null>(null);
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [rawSearchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(rawSearchQuery, 300);
  const [page, setPage] = useState(1);
  const { contentBlocks, meta, loading, error, retry, setContentBlocks } = useContentBlocks(
    page,
    debouncedQuery,
  );

  const filteredBlocks = useMemo(() => {
    if (!rawSearchQuery.trim()) return contentBlocks;
    return contentBlocks;
  }, [contentBlocks, rawSearchQuery]);

  const totalPages = meta?.totalPages ?? 1;
  const pageNumbers = useMemo(() => getPageNumbers(page, totalPages), [page, totalPages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: debouncedQuery is intentionally the trigger to reset pagination
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const lastUpdatedAt = useMemo(() => computeLastUpdatedAt(contentBlocks), [contentBlocks]);

  const openEdit = useCallback((block: ContentBlockResponse) => {
    setEditingBlock(block);
    setEditBody(block.body ?? '');
  }, []);

  const closeEdit = useCallback(() => {
    setEditingBlock(null);
    setEditBody('');
    setSaving(false);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingBlock) return;
    setSaving(true);
    try {
      await persistEdit(editingBlock, editBody, setContentBlocks, closeEdit);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }, [editingBlock, editBody, closeEdit, setContentBlocks]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <div className="relative grain flex flex-col gap-6 bg-background p-6 md:p-8">
      <CmsMasthead count={contentBlocks.length} lastUpdatedAt={lastUpdatedAt} />

      <CmsSearchBar
        value={rawSearchQuery}
        onChange={setSearchQuery}
        resultCount={filteredBlocks.length}
        total={contentBlocks.length}
      />

      {contentBlocks.length === 0 ? (
        <CmsArchiveEmpty searchQuery={rawSearchQuery} />
      ) : filteredBlocks.length === 0 ? (
        <CmsArchiveEmpty searchQuery={rawSearchQuery} />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBlocks.map((block, index) => (
            <CmsBlockRow key={block.id} block={block} index={index} onEdit={openEdit} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="Anterior"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>
            {pageNumbers.map((p, i) =>
              p === '...' ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: pagination controls are static and never reorder
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(Number(p));
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                text="Siguiente"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <CmsEditDialog
        block={editingBlock}
        body={editBody}
        saving={saving}
        onBodyChange={setEditBody}
        onSave={saveEdit}
        onCancel={closeEdit}
      />
    </div>
  );
}
