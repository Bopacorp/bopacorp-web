import {
    SidebarInset,
  SidebarProvider
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
import CRM from '@/components/sections/CRM';
import { Button } from '@base-ui/react/button';

const menu = [
  { title: 'Dashboard', icon: BarChart3 },
  { title: 'CRM', icon: Users },
  { title: 'Matrices', icon: FileText },
  { title: 'Alertas', icon: Bell },
  { title: 'Empleabilidad', icon: Handshake},
]

function App() {
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
                      <SidebarMenuButton asChild>
                        <button type="button">
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
              <h1 className="text-lg font-semibold">BOPADIGITAL CRM</h1>
              <p className="text-sm text-muted-foreground">
                Panel interno de negociaciones
              </p>
            <Button>Nueva negociación</Button>
          </header>
          </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default App
