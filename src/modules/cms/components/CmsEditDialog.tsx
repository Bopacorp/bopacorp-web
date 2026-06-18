import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.js';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { Textarea } from '@/components/ui/textarea.js';

interface CmsEditDialogProps {
  block: ContentBlockResponse | null;
  body: string;
  saving: boolean;
  onBodyChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

function DialogEyebrow({ block }: { block: ContentBlockResponse | null }) {
  if (!block) return null;
  const code = block.contentType?.code ?? '—';
  return (
    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      CONTENT TYPE · {code}
    </span>
  );
}

function CharacterCount({ body }: { body: string }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      {body.length} caracteres
    </span>
  );
}

function isVisualBlock(type: ContentBlockResponse['contentType'] | undefined) {
  return type?.code === 'IMAGE' || type?.code === 'BANNER';
}

function ImagePreview({ url }: { url: string }) {
  return (
    <img
      src={url}
      alt="Vista previa"
      className="mt-3 h-40 w-auto rounded-md border border-border object-cover"
    />
  );
}

interface BodyFieldProps {
  block: ContentBlockResponse | null;
  body: string;
  onBodyChange: (value: string) => void;
}

function BodyField({ block, body, onBodyChange }: BodyFieldProps) {
  if (isVisualBlock(block?.contentType)) {
    return (
      <>
        <Input id="edit-body" value={body} onChange={(e) => onBodyChange(e.target.value)} />
        {body && <ImagePreview url={body} />}
      </>
    );
  }

  return (
    <Textarea
      id="edit-body"
      className="min-h-72"
      value={body}
      onChange={(e) => onBodyChange(e.target.value)}
      rows={12}
    />
  );
}

export function CmsEditDialog({
  block,
  body,
  saving,
  onBodyChange,
  onSave,
  onCancel,
}: CmsEditDialogProps) {
  return (
    <Dialog
      open={!!block}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogEyebrow block={block} />
          <DialogTitle className="font-display text-xl font-semibold tracking-tight">
            Editar contenido
          </DialogTitle>
          <DialogDescription>Editando: {block?.contentKey ?? '—'}</DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="edit-body" className="sr-only">
              Contenido
            </FieldLabel>
            <BodyField block={block} body={body} onBodyChange={onBodyChange} />
          </Field>
        </FieldGroup>

        <div className="flex items-center justify-between -mt-2 px-1">
          <CharacterCount body={body} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
