import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { Badge } from '@/components/ui/badge.js';
import { Skeleton } from '@/components/ui/skeleton.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.js';
import i18n from '@/i18n/index.js';
import { getErrorMessage } from '@/shared/errors/index.js';
import { ErrorState } from '@/shared/ui';
import { updateContentBlock, uploadContentBlockImage } from './cms.service.js';
import { CmsArchiveEmpty } from './components/CmsArchiveEmpty.js';
import { CmsBlockCard } from './components/CmsBlockCard.js';
import { CmsEditDialog } from './components/CmsEditDialog.js';
import { CmsMasthead } from './components/CmsMasthead.js';
import { CmsSearchBar } from './components/CmsSearchBar.js';
import { useContentBlocks } from './useContentBlocks.js';
import { useSections } from './useSections.js';

const SECTION_LABEL_KEYS: Record<string, string> = {
  hero: 'cms.section.hero',
  about: 'cms.section.about',
  cta: 'cms.section.cta',
  about_page: 'cms.section.aboutPage',
  site: 'cms.section.site',
};

function updateBlock(prev: ContentBlockResponse[], id: string, updated: ContentBlockResponse) {
  return prev.map((block) => (block.id === id ? updated : block));
}

function isVisualBlock(type: ContentBlockResponse['contentType'] | undefined) {
  return type?.code === 'IMAGE' || type?.code === 'BANNER';
}

function validateImageFile(file: File): string | null {
  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
  if (!allowed.includes(file.type)) {
    return i18n.t('cms.invalidFormat');
  }
  if (file.size > 5 * 1024 * 1024) {
    return i18n.t('cms.imageTooLarge');
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
  toast.success(i18n.t('cms.blockUpdated'));
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
  toast.success(i18n.t('cms.imageUpdated'));
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

function CmsCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-16 rounded-md" />
      </div>
    </div>
  );
}

function CmsPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders never reorder
          <Skeleton key={i} className="h-9 w-24 rounded-md" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders never reorder
          <CmsCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function CmsPage() {
  const { t } = useTranslation();
  const { sections, loading: sectionsLoading, error: sectionsError } = useSections();
  const [activeSection, setActiveSection] = useState<string>('');
  const [editingBlock, setEditingBlock] = useState<ContentBlockResponse | null>(null);
  const [editBody, setEditBody] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [rawSearchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(rawSearchQuery, 300);

  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].prefix);
    }
  }, [sections, activeSection]);

  const { contentBlocks, loading, error, retry, refresh, setContentBlocks } = useContentBlocks(
    1,
    activeSection,
    debouncedQuery,
  );

  const totalCount = useMemo(() => sections.reduce((sum, s) => sum + s.count, 0), [sections]);

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

  if (sectionsLoading) return <CmsPageSkeleton />;
  if (sectionsError)
    return <ErrorState message={sectionsError} onRetry={() => window.location.reload()} />;

  return (
    <div className="relative grain flex flex-col gap-6 bg-background p-6 md:p-8">
      <CmsMasthead count={totalCount} lastUpdatedAt={lastUpdatedAt} />

      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="w-full max-w-full overflow-x-auto no-scrollbar gap-1">
          {sections.map((s) => {
            const labelKey = SECTION_LABEL_KEYS[s.prefix];
            const label = labelKey ? t(labelKey) : s.prefix;
            return (
              <TabsTrigger key={s.prefix} value={s.prefix} className="gap-1.5">
                {label}
                <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0">
                  {s.count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {sections.map((s) => (
          <TabsContent key={s.prefix} value={s.prefix} className="mt-4">
            <CmsSearchBar
              value={rawSearchQuery}
              onChange={setSearchQuery}
              resultCount={contentBlocks.length}
              total={s.count}
            />

            {loading ? (
              <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders never reorder
                  <CmsCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={retry} />
            ) : contentBlocks.length === 0 ? (
              <CmsArchiveEmpty searchQuery={rawSearchQuery} />
            ) : (
              <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                {contentBlocks.map((block) => (
                  <CmsBlockCard key={block.id} block={block} onEdit={openEdit} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

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
