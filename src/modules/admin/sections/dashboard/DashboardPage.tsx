export default function DashboardPage() {
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
