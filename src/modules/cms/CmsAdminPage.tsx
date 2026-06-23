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
import { updateContentBlock, uploadContentBlockImage } from './cms.service.js';
import { CmsArchiveEmpty } from './components/CmsArchiveEmpty.js';
import { CmsEditDialog } from './components/CmsEditDialog.js';
import { CmsMasthead } from './components/CmsMasthead.js';
import { CmsSearchBar } from './components/CmsSearchBar.js';
import { CmsSection } from './components/CmsSection.js';
import { useContentBlocks } from './useContentBlocks.js';

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return 'Error al guardar';
}

function updateBlock(prev: ContentBlockResponse[], id: string, updated: ContentBlockResponse) {
  return prev.map((block) => (block.id === id ? updated : block));
}

function isVisualBlock(type: ContentBlockResponse['contentType'] | undefined) {
  return type?.code === 'IMAGE' || type?.code === 'BANNER';
}

function validateImageFile(file: File): string | null {
  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
  if (!allowed.includes(file.type)) {
    return 'Formato no válido. Usa JPG, PNG, WebP o AVIF.';
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'La imagen debe pesar menos de 5 MB.';
  }
  return null;
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

async function persistImageEdit(
  block: ContentBlockResponse,
  file: File,
  refresh: () => Promise<void>,
  onDone: () => void,
) {
  await uploadContentBlockImage(block.contentKey, file);
  await refresh();
  toast.success('Imagen actualizada');
  onDone();
}

const SECTION_ORDER = ['hero', 'about', 'cta', 'site'];

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
  const [editFile, setEditFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [rawSearchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(rawSearchQuery, 300);
  const [page, setPage] = useState(1);
  const { contentBlocks, meta, loading, error, retry, refresh, setContentBlocks } =
    useContentBlocks(page, debouncedQuery);

  const filteredBlocks = useMemo(() => {
    if (!rawSearchQuery.trim()) return contentBlocks;
    return contentBlocks;
  }, [contentBlocks, rawSearchQuery]);

  const groupedSections = useMemo(() => {
    const groups: Record<string, typeof filteredBlocks> = {};
    for (const block of filteredBlocks) {
      const prefix = block.contentKey.split('.')[0];
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(block);
    }
    const ordered = SECTION_ORDER.filter((p) => groups[p]);
    const extra = Object.keys(groups)
      .filter((p) => !SECTION_ORDER.includes(p))
      .sort();
    return [...ordered, ...extra].map((prefix) => ({
      prefix,
      blocks: groups[prefix],
    }));
  }, [filteredBlocks]);

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
    setEditFile(null);
    setImageError(null);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingBlock(null);
    setEditBody('');
    setEditFile(null);
    setImageError(null);
    setSaving(false);
  }, []);

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) {
      setEditFile(null);
      setImageError(null);
      return;
    }

    const error = validateImageFile(file);
    if (error) {
      setEditFile(null);
      setImageError(error);
      return;
    }

    setEditFile(file);
    setImageError(null);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingBlock) return;
    setSaving(true);
    try {
      if (isVisualBlock(editingBlock.contentType) && editFile) {
        await persistImageEdit(editingBlock, editFile, refresh, closeEdit);
      } else {
        await persistEdit(editingBlock, editBody, setContentBlocks, closeEdit);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }, [editingBlock, editBody, editFile, refresh, closeEdit, setContentBlocks]);

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

      {contentBlocks.length === 0 || filteredBlocks.length === 0 ? (
        <CmsArchiveEmpty searchQuery={rawSearchQuery} />
      ) : (
        <div className="flex flex-col gap-6">
          {groupedSections.map((section) => (
            <CmsSection
              key={section.prefix}
              prefix={section.prefix}
              blocks={section.blocks}
              onEdit={openEdit}
            />
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
        file={editFile}
        saving={saving}
        imageError={imageError ?? undefined}
        onBodyChange={setEditBody}
        onFileChange={handleFileChange}
        onSave={saveEdit}
        onCancel={closeEdit}
      />
    </div>
  );
}
