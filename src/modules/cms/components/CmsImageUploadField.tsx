import { ImageIcon, UploadCloud, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button.js';
import { FieldDescription, FieldError, FieldLabel } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { cn } from '@/lib/utils.js';

interface CmsImageUploadFieldProps {
  id: string;
  currentUrl: string | null;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
}

function formatFileName(name: string): string {
  if (name.length <= 36) return name;
  return `${name.slice(0, 33)}...`;
}

function usePreview(file: File | null, currentUrl: string | null) {
  const [preview, setPreview] = useState<string | null>(currentUrl);

  useEffect(() => {
    if (!file) {
      setPreview(currentUrl);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, currentUrl]);

  return preview;
}

export function CmsImageUploadField({
  id,
  currentUrl,
  file,
  onChange,
  disabled,
  error,
}: CmsImageUploadFieldProps) {
  const { t } = useTranslation();
  const preview = usePreview(file, currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    onChange(selected);
  };

  const handleClear = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id}>{t('cms.imageLabel')}</FieldLabel>
      <label
        htmlFor={id}
        className={cn(
          'group relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center transition-colors',
          preview
            ? 'border-primary/50 bg-primary/5'
            : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40',
          error && 'border-destructive/50 bg-destructive/5',
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt={t('cms.preview')}
            className="h-40 w-auto rounded-md border border-border object-cover"
          />
        ) : (
          <span
            className={cn(
              'flex size-12 items-center justify-center rounded-lg transition-colors',
              error
                ? 'bg-destructive/15 text-destructive'
                : 'bg-background text-muted-foreground group-hover:text-primary',
            )}
          >
            {error ? <ImageIcon className="size-6" /> : <UploadCloud className="size-6" />}
          </span>
        )}

        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">
            {file
              ? formatFileName(file.name)
              : preview
                ? t('cms.clickToChange')
                : t('cms.clickToSelect')}
          </span>
        </span>

        <Input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className="hidden"
        />
      </label>

      {file && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={disabled}
          className="self-start"
        >
          <X data-icon="inline-start" />
          {t('cms.removeImage')}
        </Button>
      )}

      <FieldDescription>{t('cms.imageRequirements')}</FieldDescription>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
