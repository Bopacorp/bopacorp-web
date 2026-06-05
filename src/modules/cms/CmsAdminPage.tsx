import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
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

function computeLastUpdatedAt(blocks: ContentBlockResponse[]): Date | null {
  if (!blocks.length) return null;
  let max = blocks[0].updatedAt;
  for (const block of blocks) {
    if (new Date(block.updatedAt) > new Date(max)) {
      max = block.updatedAt;
    }
  }
  return new Date(max);
}

function matchesQuery(block: ContentBlockResponse, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const haystack = [
    block.title,
    block.body,
    block.contentKey,
    block.contentType?.code,
    block.contentType?.name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function CmsPage() {
  const { contentBlocks, loading, error, retry, setContentBlocks } = useContentBlocks(1);
  const [editingBlock, setEditingBlock] = useState<ContentBlockResponse | null>(null);
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlocks = useMemo(() => {
    if (!searchQuery.trim()) return contentBlocks;
    return contentBlocks.filter((block) => matchesQuery(block, searchQuery));
  }, [contentBlocks, searchQuery]);

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

      {contentBlocks.length > 0 && (
        <CmsSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={filteredBlocks.length}
          total={contentBlocks.length}
        />
      )}

      {contentBlocks.length === 0 ? (
        <CmsArchiveEmpty />
      ) : filteredBlocks.length === 0 ? (
        <CmsArchiveEmpty searchQuery={searchQuery} />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBlocks.map((block, index) => (
            <CmsBlockRow key={block.id} block={block} index={index} onEdit={openEdit} />
          ))}
        </div>
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
