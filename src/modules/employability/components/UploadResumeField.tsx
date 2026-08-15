import { FileText, UploadCloud } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { cn } from '@/lib/utils.js';

interface UploadResumeFieldProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
  disabled?: boolean;
}

export function UploadResumeField({ value, onChange, error, disabled }: UploadResumeFieldProps) {
  const hasFile = Boolean(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange(file);
  };

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor="applicant-resume">CV en PDF</FieldLabel>
      <label
        htmlFor="applicant-resume"
        className={cn(
          'group flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed p-6 text-center transition-colors',
          hasFile
            ? 'border-primary/50 bg-primary/5'
            : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40',
          error && 'border-destructive/50 bg-destructive/5',
        )}
      >
        <span
          className={cn(
            'flex size-10 items-center justify-center rounded-lg transition-colors',
            hasFile
              ? 'bg-primary/15 text-primary'
              : 'bg-background text-muted-foreground group-hover:text-primary',
          )}
        >
          {hasFile ? <FileText className="size-5" /> : <UploadCloud className="size-5" />}
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">
            {hasFile ? formatFileName(value?.name ?? '') : 'Haz clic para seleccionar tu CV'}
          </span>
          <span className="text-xs text-muted-foreground">
            {hasFile ? 'Puedes cambiar el archivo' : 'Arrastra o selecciona un archivo PDF'}
          </span>
        </span>
        <Input
          id="applicant-resume"
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className="hidden"
        />
      </label>
      <FieldDescription>PDF, máximo 20 MB.</FieldDescription>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export function formatFileName(name: string): string {
  if (name.length <= 32) return name;
  return `${name.slice(0, 29)}...`;
}
