import { Layout } from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  icon: typeof Layout;
  permission: string | null;
}

export const allMenuItems: MenuItem[] = [
  { id: 'cms', title: 'CMS', icon: Layout, permission: 'content_blocks.read' },
];

export const sectionMeta: Record<string, { title: string; description: string }> = {
  cms: { title: 'CMS', description: 'Gestion de contenido para la plataforma' },
};
