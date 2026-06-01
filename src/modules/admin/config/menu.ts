import { BarChart3, Bell, FileText, Handshake, Layout, Users } from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  icon: typeof BarChart3;
  permission: string | null;
}

export const allMenuItems: MenuItem[] = [
  { id: 'dashboard', title: 'Dashboard', icon: BarChart3, permission: null },
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

export const sectionMeta: Record<string, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Vista general de la operacion' },
  crm: { title: 'BOPADIGITAL CRM', description: 'Panel interno de negociaciones' },
  matrices: { title: 'Matrices', description: 'Documentos y estructuras operativas' },
  alertas: { title: 'Alertas', description: 'Seguimiento de eventos importantes' },
  empleabilidad: { title: 'Empleabilidad', description: 'Seguimiento de talento y vacantes' },
  'cms-demo': { title: 'CMS Demo', description: 'Landing page con bloques CMS desde la API' },
  cms: { title: 'CMS', description: 'Gestion de contenido para la plataforma' },
};
