import { FileText, Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface UploadResumeFieldProps {
  fileName: string;
  error?: string;
  touched?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function UploadResumeField({ fileName, error, touched, onChange }: UploadResumeFieldProps) {
  return (
    <Field data-invalid={Boolean(error && touched) || undefined}>
      <FieldLabel htmlFor="applicant-resume">CV en PDF</FieldLabel>
      <div className="flex items-center gap-3">
        <label
          htmlFor="applicant-resume"
          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
        >
          <Upload className="size-4" />
          Seleccionar archivo
        </label>
        <Input
          id="applicant-resume"
          type="file"
          accept="application/pdf"
          onChange={onChange}
          className="hidden"
        />
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText className="size-3.5" />
          {fileName ? formatFileName(fileName) : 'Sin archivos seleccionados'}
        </span>
      </div>
      <FieldDescription>PDF, maximo 20 MB.</FieldDescription>
      {error && touched && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export function formatFileName(name: string): string {
  if (name.length <= 32) return name;
  return `${name.slice(0, 29)}...`;
}
