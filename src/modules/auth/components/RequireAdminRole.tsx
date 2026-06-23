import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { hasAnyAdminRole } from '@/modules/auth/constants.js';
import { PageLoader } from '@/shared/ui';
import { useAuth } from '../context/AuthContext.js';

export default function RequireAdminRole({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <PageLoader />
      </div>
    );
  }

  if (!user || !hasAnyAdminRole(user.roles)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
