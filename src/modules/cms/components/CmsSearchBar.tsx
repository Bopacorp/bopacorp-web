import { Search, X } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group.js';

interface CmsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  total: number;
}

function ResultCount({
  resultCount,
  total,
  query,
}: {
  resultCount: number;
  total: number;
  query: string;
}) {
  if (!query) return null;
  return (
    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      mostrando {resultCount} de {total}
    </span>
  );
}

export function CmsSearchBar({ value, onChange, resultCount, total }: CmsSearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Buscar por título, contenido o tipo…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Limpiar búsqueda"
                onClick={() => onChange('')}
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>
      <ResultCount resultCount={resultCount} total={total} query={value} />
    </div>
  );
}
