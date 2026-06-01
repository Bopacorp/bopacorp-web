import type { ReactNode } from 'react';
import { PageLoader } from '@/shared/ui';
import { useAuth } from '../context/AuthContext.js';
import LoginPage from '../pages/LoginPage.js';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <PageLoader />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return children;
}
