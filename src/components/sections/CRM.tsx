import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'


const rows = [
  { cliente: 'Empresa A', etapa: 'Negociación', estado: 'Pendiente' },
  { cliente: 'Empresa B', etapa: 'Cierre', estado: 'Aprobado' },
  { cliente: 'Empresa C', etapa: 'Seguimiento', estado: 'Rechazado' },
]

function CRM() {
    return(
      <div className="grid gap-4 p-4 md:grid-cols-3">
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
      </div>
    )
}

export default CRM