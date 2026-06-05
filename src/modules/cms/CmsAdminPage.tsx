import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { Pencil } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/services/api.js';
import { ErrorState, PageLoader } from '@/shared/ui';
import { updateContentBlock } from './cms.service.js';
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

export function CmsPage() {
  const { contentBlocks, loading, error, retry, setContentBlocks } = useContentBlocks(1);
  const [editingBlock, setEditingBlock] = useState<ContentBlockResponse | null>(null);
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);

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
  if (contentBlocks.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Sin contenido</EmptyTitle>
            <EmptyDescription>No hay bloques CMS publicados.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background p-6">
      <h2 className="text-2xl font-bold text-foreground">CMS Content Blocks</h2>
      <p className="text-muted-foreground mt-2">{contentBlocks.length} bloques cargados.</p>
      {contentBlocks.map((block) => (
        <div key={block.id} className="border rounded p-4 mt-4">
          <h3 className="text-lg font-semibold">{block.title}</h3>
          <p className="text-sm text-muted-foreground">Tipo: {block.contentType?.name}</p>
          <p className="mt-2">{block.body}</p>
          <Separator />
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">
                Publicado el {new Date(block.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Actualizado el {new Date(block.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => openEdit(block)}>
              <Pencil data-icon="inline-start" />
              Editar contenido
            </Button>
          </div>
        </div>
      ))}

      <Dialog
        open={!!editingBlock}
        onOpenChange={(open) => {
          if (!open) closeEdit();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar contenido</DialogTitle>
            <DialogDescription>{editingBlock?.title || 'Bloque CMS'}</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="edit-body">Contenido</FieldLabel>
              <Textarea
                id="edit-body"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={8}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
