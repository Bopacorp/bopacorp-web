import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { usePermission } from '@/modules/auth/hooks/usePermission.js';

interface PermissionRouteProps {
  permission: string | null;
  children: ReactNode;
}

export function PermissionRoute({ permission, children }: PermissionRouteProps) {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();

  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[50vh]">
        <h2 className="text-xl font-semibold">{t('admin.accessDenied')}</h2>
        <p className="text-muted-foreground">{t('admin.noPermission')}</p>
      </div>
    );
  }

  return <>{children}</>;
}
