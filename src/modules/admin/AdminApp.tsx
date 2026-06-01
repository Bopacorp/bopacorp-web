import { BarChart3, Bell, FileText, Handshake, Layout, LogOut, Plus, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import SidebarNav from '@/components/SidebarNav';
import CRM from '@/components/sections/CRM';
import Empleabilidad from '@/components/sections/Empleabilidad';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { usePermission } from '@/hooks/usePermission.js';
import { useAuth } from '@/modules/auth/context/AuthContext.js';
import CmsDemoPage from '@/modules/landing/pages/CmsDemoPage';

const allMenuItems = [
  { id: 'dashboard', title: 'Dashboard', icon: BarChart3, permission: null as string | null },
  { id: 'crm', title: 'CRM', icon: Users, permission: 'contact_requests.read' },
  { id: 'matrices', title: 'Matrices', icon: FileText, permission: null },
  { id: 'alertas', title: 'Alertas', icon: Bell, permission: null },
  {
    id: 'empleabilidad',
    title: 'Empleabilidad',
    icon: Handshake,
    permission: 'job_vacancies.read',
  },
  { id: 'cms-demo', title: 'CMS Demo', icon: Layout, permission: null },
  { id: 'cms', title: 'CMS', icon: Layout, permission: 'content_blocks.read' },
];

const sectionMeta: Record<string, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Vista general de la operacion' },
  crm: { title: 'BOPADIGITAL CRM', description: 'Panel interno de negociaciones' },
  matrices: { title: 'Matrices', description: 'Documentos y estructuras operativas' },
  alertas: { title: 'Alertas', description: 'Seguimiento de eventos importantes' },
  empleabilidad: { title: 'Empleabilidad', description: 'Seguimiento de talento y vacantes' },
  'cms-demo': { title: 'CMS Demo', description: 'Landing page con bloques CMS desde la API' },
  cms: { title: 'CMS', description: 'Gestion de contenido para la plataforma' },
};

function PermissionRoute({
  permission,
  children,
}: {
  permission: string | null;
  children: ReactNode;
}) {
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

function DashboardSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2 p-4">
      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Aqui puedes resumir metricas clave y accesos rapidos.
        </p>
      </div>
    </div>
  );
}

function MatricesSection() {
  return (
    <div className="grid gap-4 p-4">
      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="text-xl font-semibold">Matrices</h2>
        <p className="text-sm text-muted-foreground">
          Seccion lista para cargar matrices y plantillas.
        </p>
      </div>
    </div>
  );
}

function AlertasSection() {
  return (
    <div className="grid gap-4 p-4">
      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="text-xl font-semibold">Alertas</h2>
        <p className="text-sm text-muted-foreground">
          Seccion lista para mostrar notificaciones y avisos.
        </p>
      </div>
    </div>
  );
}

function CmsSection() {
  return (
    <div className="grid gap-4 p-4">
      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="text-xl font-semibold">CMS</h2>
        <p className="text-sm text-muted-foreground">
          Seccion lista para integrar herramientas de gestion de contenido.
        </p>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermission();
  const location = useLocation();

  const menuItems = allMenuItems.filter(
    (item) => !item.permission || hasPermission(item.permission),
  );
  const sectionId = location.pathname.replace('/admin/', '') || 'dashboard';
  const meta = sectionMeta[sectionId] || sectionMeta.dashboard;

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <SidebarNav menu={menuItems} />

        <SidebarInset className="flex-1">
          <header className="flex h-14 items-center gap-3 border-b px-4">
            <SidebarTrigger aria-label="Toggle sidebar" />
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
              <Route path="/" element={<Navigate to="crm" replace />} />
              <Route
                path="dashboard"
                element={
                  <PermissionRoute permission={null}>
                    <DashboardSection />
                  </PermissionRoute>
                }
              />
              <Route
                path="crm"
                element={
                  <PermissionRoute permission="contact_requests.read">
                    <CRM />
                  </PermissionRoute>
                }
              />
              <Route
                path="matrices"
                element={
                  <PermissionRoute permission={null}>
                    <MatricesSection />
                  </PermissionRoute>
                }
              />
              <Route
                path="alertas"
                element={
                  <PermissionRoute permission={null}>
                    <AlertasSection />
                  </PermissionRoute>
                }
              />
              <Route
                path="empleabilidad"
                element={
                  <PermissionRoute permission="job_vacancies.read">
                    <Empleabilidad />
                  </PermissionRoute>
                }
              />
              <Route
                path="cms-demo"
                element={
                  <PermissionRoute permission={null}>
                    <CmsDemoPage />
                  </PermissionRoute>
                }
              />
              <Route
                path="cms"
                element={
                  <PermissionRoute permission="content_blocks.read">
                    <CmsSection />
                  </PermissionRoute>
                }
              />
              <Route path="*" element={<div className="p-8">Seccion no encontrada</div>} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
