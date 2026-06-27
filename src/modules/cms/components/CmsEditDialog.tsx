import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { Textarea } from '@/components/ui/textarea.js';
import { CmsImageUploadField } from './CmsImageUploadField.js';

interface CmsEditDialogProps {
  block: ContentBlockResponse | null;
  body: string;
  file: File | null;
  saving: boolean;
  imageError?: string;
  onBodyChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
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
  const { t } = useTranslation();
  return (
    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      {t('cms.characters', { count: body.length })}
    </span>
  );
}

function isVisualBlock(type: ContentBlockResponse['contentType'] | undefined) {
  return type?.code === 'IMAGE' || type?.code === 'BANNER';
}

interface BodyFieldProps {
  block: ContentBlockResponse | null;
  body: string;
  file: File | null;
  imageError?: string;
  onBodyChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

function BodyField({
  block,
  body,
  file,
  imageError,
  onBodyChange,
  onFileChange,
  disabled,
}: BodyFieldProps) {
  if (isVisualBlock(block?.contentType)) {
    return (
      <CmsImageUploadField
        id="edit-image"
        currentUrl={body || null}
        file={file}
        onChange={onFileChange}
        disabled={disabled}
        error={imageError}
      />
    );
  }

  return (
    <Textarea
      id="edit-body"
      className="min-h-72"
      maxLength={10000}
      value={body}
      onChange={(e) => onBodyChange(e.target.value)}
      rows={12}
    />
  );
}

export function CmsEditDialog({
  block,
  body,
  file,
  saving,
  imageError,
  onBodyChange,
  onFileChange,
  onSave,
  onCancel,
}: CmsEditDialogProps) {
  const { t } = useTranslation();
  const visual = isVisualBlock(block?.contentType);

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
            {t('cms.editContent')}
          </DialogTitle>
          <DialogDescription>
            {t('cms.editing', { key: block?.contentKey ?? '—' })}
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="edit-body" className="sr-only">
              {t('cms.content')}
            </FieldLabel>
            <BodyField
              block={block}
              body={body}
              file={file}
              imageError={imageError}
              onBodyChange={onBodyChange}
              onFileChange={onFileChange}
              disabled={saving}
            />
          </Field>
        </FieldGroup>

        {!visual && (
          <div className="flex items-center justify-between -mt-2 px-1">
            <CharacterCount body={body} />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            {t('cms.cancel')}
          </Button>
          <Button onClick={onSave} disabled={saving || (visual && !file) || !!imageError}>
            {saving ? t('cms.saving') : t('cms.saveChanges')}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
