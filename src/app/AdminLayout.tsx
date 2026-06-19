import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { AdminSidebar } from './AdminSidebar';
import { BreadcrumbTitleProvider } from './BreadcrumbTitleContext';

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="min-w-0">
        <BreadcrumbTitleProvider>
          <header className="flex h-14 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <AdminBreadcrumb />
          </header>
          <div className="grain min-w-0 overflow-x-hidden p-6 md:p-8">
            <Outlet />
          </div>
        </BreadcrumbTitleProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
