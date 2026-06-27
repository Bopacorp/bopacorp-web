import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  if (!query) return null;
  return (
    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      {t('cms.showingResults', { resultCount, total })}
    </span>
  );
}

export function CmsSearchBar({ value, onChange, resultCount, total }: CmsSearchBarProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder={t('cms.searchPlaceholder')}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label={t('cms.clearSearch')}
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
