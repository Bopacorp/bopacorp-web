import { AlertCircle } from 'lucide-react';
import { ErrorState } from '@/shared/ui';

interface VacancyDetailErrorProps {
  message: string;
  code?: string;
  onRetry: () => void;
}

export function VacancyDetailError({ message, code, onRetry }: VacancyDetailErrorProps) {
  return <ErrorState message={message} code={code} onRetry={onRetry} />;
}

export { AlertCircle };
