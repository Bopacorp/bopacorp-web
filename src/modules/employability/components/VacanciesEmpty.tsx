import { Briefcase } from 'lucide-react';
import { EmptyState } from '@/shared/ui';

export function VacanciesEmpty() {
  return (
    <EmptyState
      icon={Briefcase}
      title="No hay vacantes publicadas"
      description="Vuelve pronto. Estamos publicando nuevas oportunidades."
    />
  );
}
