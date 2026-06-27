import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

interface ErrorStateProps {
  message?: string;
  code?: string;
  onRetry?: () => void;
}

const ERROR_KEYS: Record<string, string> = {
  UNAUTHORIZED: 'error.unauthorized',
  VALIDATION_ERROR: 'error.validation',
  FORBIDDEN: 'error.forbidden',
  NOT_FOUND: 'error.notFound',
  CONFLICT: 'error.conflict',
};

export function ErrorState({ message, code, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  const resolvedMessage = (() => {
    if (code && ERROR_KEYS[code]) return t(ERROR_KEYS[code]);
    if (message) return message;
    return t('error.generic');
  })();

  return (
    <div className="flex items-center justify-center py-20">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{t('error.loadFailed')}</EmptyTitle>
          <EmptyDescription>{resolvedMessage}</EmptyDescription>
        </EmptyHeader>
        {onRetry && <Button onClick={onRetry}>{t('error.retry')}</Button>}
      </Empty>
    </div>
  );
}
