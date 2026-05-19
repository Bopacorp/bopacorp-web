import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, Smartphone, Globe, ArrowRight } from "lucide-react";


const SERVICES = [
  { title: "Plan 1", icon: Wifi, desc: "20GB para navegar, 300 Minutos a todo destino, 50 Minutos LDI mundo y Roaming WhatsApp Chat incluido." },
  { title: "Plan 2", icon: Smartphone, desc: "22GB para navegar, 500 Minutos a todo destino, 150 Minutos LDI mundo y Redes Sociales ilimitadas." },
  { title: "Plan 3", icon: Globe, desc: "30GB para navegar, Minutos Ilimitados a todo destino, 200 Minutos LDI mundo y Roaming incluido." },
  { title: "Plan 4", icon: Wifi, desc: "Plan empresarial con alta capacidad de datos y soporte técnico prioritario 24/7 para tu negocio." },
  { title: "Plan 5", icon: Smartphone, desc: "Soluciones de voz y datos escalables diseñadas para equipos comerciales y de campo." },
  { title: "Plan 6", icon: Globe, desc: "Estructura corporativa avanzada con gigas acumulables y servicios digitales de seguridad." },
];

export default function ServicesPage() {
  return (
    <div className="w-full flex flex-col font-sans">
      <section className="w-full relative py-24 px-6 border-b border-border/50 bg-[#06152b] overflow-hidden min-h-[350px] flex items-center">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
              Cátalogo de  <span className="text-[#008be2]">Servicios</span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
              Soluciones integrales de telecomunicaciones diseñadas para impulsar el crecimiento operativo de tu empresa.
            </p>
          </div>
        </section>
        
      <section className="w-full py-24 px-6 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <Card key={index} className="group border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <div className="aspect-[16/9] bg-slate-100 flex items-center justify-center">
                  <service.icon className="size-12 text-[#008be2]/40" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-slate-600 leading-relaxed">{service.desc}</p>
                  <Button variant="outline" className="w-full gap-2 group-hover:bg-[#008be2] group-hover:text-white transition-colors">
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