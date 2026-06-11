import { LogOut, Plus } from 'lucide-react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/modules/auth/context/AuthContext.js';
import { CmsPage } from '@/modules/cms/CmsAdminPage.js';
import { PermissionRoute } from './components/PermissionRoute.js';
import { sectionMeta } from './config/menu.js';

export default function AdminApp() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sectionId = location.pathname.replace(/^\/admin\/?/, '') || 'dashboard';
  const meta = sectionMeta[sectionId] || sectionMeta.dashboard;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-14 items-center gap-3 border-b px-4">
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{meta.title}</h1>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Cerrar sesion">
            <LogOut data-icon="inline-start" />
          </Button>
          <Button>
            <Plus data-icon="inline-start" />
            Nuevo cliente
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="cms" replace />} />
          <Route
            path="cms"
            element={
              <PermissionRoute permission="content_blocks.read">
                <CmsPage />
              </PermissionRoute>
            }
          />
          <Route path="*" element={<div className="p-8">Seccion no encontrada</div>} />
        </Routes>
      </main>
    </div>
  );
}
