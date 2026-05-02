import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart3, Users, FileText, Bell } from 'lucide-react'

const menu = [
  { title: 'Dashboard', icon: BarChart3 },
  { title: 'CRM', icon: Users },
  { title: 'Matrices', icon: FileText },
  { title: 'Alertas', icon: Bell },
]

const rows = [
  { cliente: 'Empresa A', etapa: 'Negociación', estado: 'Pendiente' },
  { cliente: 'Empresa B', etapa: 'Cierre', estado: 'Aprobado' },
  { cliente: 'Empresa C', etapa: 'Seguimiento', estado: 'Rechazado' },
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
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">BOPADIGITAL CRM</h1>
              <p className="text-sm text-muted-foreground">
                Panel interno de negociaciones
              </p>
            </div>
            <Button variant="outline">Nueva negociación</Button>
          </header>

          <main className="grid gap-4 p-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Negociaciones activas</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">24</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aprobadas hoy</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">8</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentos pendientes</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">13</CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Últimas negociaciones</CardTitle>
                <Badge variant="secondary">Actualizado hace 2 min</Badge>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Etapa</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.cliente}>
                        <TableCell>{row.cliente}</TableCell>
                        <TableCell>{row.etapa}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.estado}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default App
