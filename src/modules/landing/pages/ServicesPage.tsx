import { ArrowRight, Globe, Smartphone, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SERVICES = [
  {
    id: 'plan-1',
    title: 'Plan 1',
    icon: Wifi,
    desc: '20GB para navegar, 300 Minutos a todo destino, 50 Minutos LDI mundo y Roaming WhatsApp Chat incluido.',
  },
  {
    id: 'plan-2',
    title: 'Plan 2',
    icon: Smartphone,
    desc: '22GB para navegar, 500 Minutos a todo destino, 150 Minutos LDI mundo y Redes Sociales ilimitadas.',
  },
  {
    id: 'plan-3',
    title: 'Plan 3',
    icon: Globe,
    desc: '30GB para navegar, Minutos Ilimitados a todo destino, 200 Minutos LDI mundo y Roaming incluido.',
  },
  {
    id: 'plan-4',
    title: 'Plan 4',
    icon: Wifi,
    desc: 'Plan empresarial con alta capacidad de datos y soporte técnico prioritario 24/7 para tu negocio.',
  },
  {
    id: 'plan-5',
    title: 'Plan 5',
    icon: Smartphone,
    desc: 'Soluciones de voz y datos escalables diseñadas para equipos comerciales y de campo.',
  },
  {
    id: 'plan-6',
    title: 'Plan 6',
    icon: Globe,
    desc: 'Estructura corporativa avanzada con gigas acumulables y servicios digitales de seguridad.',
  },
];

export default function ServicesPage() {
  return (
    <div className="w-full flex flex-col font-sans">
      <section className="w-full relative py-24 px-6 border-b border-border/50 bg-hero overflow-hidden min-h-[350px] flex items-center">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            Cátalogo de <span className="text-primary">Servicios</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
            Soluciones integrales de telecomunicaciones diseñadas para impulsar el crecimiento
            operativo de tu empresa.
          </p>
        </div>
      </section>

      <section className="w-full py-24 px-6 bg-muted min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <Card
                key={service.id}
                className="group border-border shadow-sm hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                  <service.icon className="size-12 text-primary/40" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-card-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  <Button
                    variant="outline"
                    className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Más información <ArrowRight className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
