import type { ReactNode } from 'react';
import { usePermission } from '@/modules/auth/hooks/usePermission.js';

interface PermissionRouteProps {
  permission: string | null;
  children: ReactNode;
}

export function PermissionRoute({ permission, children }: PermissionRouteProps) {
  const { hasPermission } = usePermission();

  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[50vh]">
        <h2 className="text-xl font-semibold">Acceso denegado</h2>
        <p className="text-muted-foreground">No tienes permisos para acceder a esta seccion.</p>
      </div>
    );
  }

  return <>{children}</>;
}
