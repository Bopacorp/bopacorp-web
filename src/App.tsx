import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { BarChart3, Users, FileText, Bell, Handshake } from 'lucide-react'
import { Plus } from 'lucide-react'
import CRM from '@/components/sections/CRM';
import Empleabilidad from '@/components/sections/Empleabilidad';
import { Button } from '@/components/ui/button'
import { useState } from 'react';

const menu = [
  { id: 'dashboard', title: 'Dashboard', icon: BarChart3 },
  { id: 'crm', title: 'CRM', icon: Users },
  { id: 'matrices', title: 'Matrices', icon: FileText },
  { id: 'alertas', title: 'Alertas', icon: Bell },
  { id: 'empleabilidad', title: 'Empleabilidad', icon: Handshake },
]

const sections = {
  dashboard: {
    title: 'Dashboard',
    description: 'Vista general de la operación',
    content: (
      <div className="grid gap-4 md:grid-cols-2 p-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Aquí puedes resumir métricas clave y accesos rápidos.
          </p>
        </div>
      </div>
    ),
  },
  crm: {
    title: 'BOPADIGITAL CRM',
    description: 'Panel interno de negociaciones',
    content: <CRM />,
  },
  matrices: {
    title: 'Matrices',
    description: 'Documentos y estructuras operativas',
    content: (
      <div className="grid gap-4 p-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <h2 className="text-xl font-semibold">Matrices</h2>
          <p className="text-sm text-muted-foreground">
            Sección lista para cargar matrices y plantillas.
          </p>
        </div>
      </div>
    ),
  },
  alertas: {
    title: 'Alertas',
    description: 'Seguimiento de eventos importantes',
    content: (
      <div className="grid gap-4 p-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <h2 className="text-xl font-semibold">Alertas</h2>
          <p className="text-sm text-muted-foreground">
            Sección lista para mostrar notificaciones y avisos.
          </p>
        </div>
      </div>
    ),
  },
  empleabilidad: {
    title: 'Empleabilidad',
    description: 'Seguimiento de talento y vacantes',
    content: <Empleabilidad />,
  },
} as const

function App() {
  const [activeSection, setActiveSection] = useState<keyof typeof sections>('crm')
  const currentSection = sections[activeSection]

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>BOPACORP</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menu.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={activeSection === item.id}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveSection(item.id as keyof typeof sections)}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
            <header className="flex h-14 items-center gap-3 border-b px-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">{currentSection.title}</h1>
                <p className="text-sm text-muted-foreground">{currentSection.description}</p>
              </div>
              <Button>
                <Plus data-icon="inline-start" />
                Nueva negociación
              </Button>
            </header>
            <main className="flex-1 overflow-auto">{currentSection.content}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default App
