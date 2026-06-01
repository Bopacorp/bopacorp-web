import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState, ErrorState, PageLoader } from '@/shared/ui';

type Negotiation = {
  id: string;
  cliente: string;
  etapa: string;
  estado: string;
};

const initialData: Negotiation[] = [
  { id: '1', cliente: 'Empresa A', etapa: 'Negociacion', estado: 'Pendiente' },
  { id: '2', cliente: 'Empresa B', etapa: 'Cierre', estado: 'Aprobado' },
  { id: '3', cliente: 'Empresa C', etapa: 'Seguimiento', estado: 'Rechazado' },
];

function StatsCards() {
  return (
    <>
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
    </>
  );
}

function NegotiationsTable({ rows }: { rows: Negotiation[] }) {
  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ultimas negociaciones</CardTitle>
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
              <TableRow key={row.id}>
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
  );
}

function CrmPage() {
  const [data] = useState<Negotiation[]>(initialData);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  if (loading) {
    return <PageLoader message="Cargando CRM..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  if (data.length === 0) {
    return <EmptyState title="Sin negociaciones" description="No hay negociaciones registradas." />;
  }

  return (
    <div className="grid gap-4 p-4 md:grid-cols-3">
      <StatsCards />
      <NegotiationsTable rows={data} />
    </div>
  );
}

export default CrmPage;
