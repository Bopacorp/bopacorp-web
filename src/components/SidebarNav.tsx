import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type MenuItem = {
  id: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function SidebarNav({
  menu,
  activeSection,
}: {
  menu: MenuItem[];
  activeSection: string;
}) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>BOPACORP</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                const isActive = activeSection === item.id;
                const btnClass = cn(
                  'inline-flex items-center gap-3 h-12 px-3 rounded-md transition-colors duration-150 text-label-lg font-label-lg text-left w-full',
                  // ensure text stays visible even when sidebar collapses to icon-only
                  'group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:translate-x-0',
                  // default: dark tone text
                  isActive
                    ? 'text-primary font-bold border-r-4 border-primary bg-secondary-container/30'
                    : 'text-on-background',
                  // hover: accent background with white text
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  // pressed/active interactions
                  'active:bg-sidebar-accent active:text-sidebar-accent-foreground',
                );

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <button
                        type="button"
                        className={btnClass}
                        onClick={() => {
                          location.hash = item.id;
                        }}
                      >
                        <item.icon data-icon="inline-start" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
