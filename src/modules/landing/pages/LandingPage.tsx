import { ArrowRight, Globe, MessageCircle, Smartphone, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import bannerImg from '@/assets/banner.jpg';
import teamImg from '@/assets/team.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SERVICES = [
  {
    id: 'connectivity-enterprise',
    title: 'Conectividad Empresarial',
    icon: Wifi,
    desc: 'Soluciones de internet satelital, enlaces dedicados y fibra óptica de alta velocidad para asegurar tu operación continua.',
  },
  {
    id: 'corporate-plans',
    title: 'Planes Corporativos',
    icon: Smartphone,
    desc: 'Telefonía móvil, flotas comerciales y comunicación de voz fija adaptada a la estructura y presupuesto de tu negocio.',
  },
  {
    id: 'digital-services',
    title: 'Servicios Digitales',
    icon: Globe,
    desc: 'Estructura cloud con Huawei Cloud, Microsoft 365, ciberseguridad corporativa avanzada y sistemas de rastreo satelital.',
  },
  {
    id: 'connectivity',
    title: 'Conectividad',
    icon: Wifi,
    desc: 'Soluciones de internet satelital, enlaces dedicados y fibra óptica de alta velocidad para asegurar tu operación continua.',
  },
  {
    id: 'plans',
    title: 'Planes',
    icon: Smartphone,
    desc: 'Telefonía móvil, flotas comerciales y comunicación de voz fija adaptada a la estructura y presupuesto de tu negocio.',
  },
  {
    id: 'services',
    title: 'Servicios',
    icon: Globe,
    desc: 'Estructura cloud con Huawei Cloud, Microsoft 365, ciberseguridad corporativa avanzada y sistemas de rastreo satelital.',
  },
];

export default function LandingPage() {
  return (
    <div className="w-full bg-background flex flex-col">
      <div className="w-full border-b border-border text-white relative overflow-hidden bg-hero">
        <img
          src={bannerImg}
          alt="Network Background"
          className="absolute inset-0 size-full object-cover opacity-25 pointer-events-none z-0"
        />

        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center gap-10 relative z-10">
          <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.15]">
              Conectividad que <span className="text-primary">impulsa</span> tu empresa
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl font-normal">
              Conectamos tu negocio con tecnología de punta. Planes corporativos, conectividad de
              alta velocidad y servicios digitales diseñados para impulsar tu empresa.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-md font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 border-none cursor-pointer"
              >
                <Link to="/services">
                  Ver catálogo de servicios
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 rounded-md transition-colors font-medium cursor-pointer"
              >
                <Link to="/about">Conoce más</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="w-full border-t border-white/10 bg-black/20 backdrop-blur-sm py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl md:text-3xl font-semibold text-white">+200</span>
              <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
                empresas conectadas
              </span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-white/10 pl-6 max-md:border-l-0 max-md:pl-0">
              <span className="text-2xl md:text-3xl font-semibold text-white">99.9%</span>
              <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
                uptime garantizado
              </span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-white/10 pl-6">
              <span className="text-2xl md:text-3xl font-semibold text-white">7 años</span>
              <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
                de trayectoria
              </span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-white/10 pl-6 max-md:border-l-0 max-md:pl-0">
              <span className="text-2xl md:text-3xl font-semibold text-white">+36%</span>
              <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
                crecimiento neto
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="w-full bg-muted/30 py-20 px-6 border-b border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Lo que hacemos por tu empresa
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl font-normal">
              Soluciones integradas de telecomunicaciones para empresas que necesitan fiabilidad,
              velocidad y soporte 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {SERVICES.map((item) => (
              <Card
                key={item.id}
                className="border border-border/60 rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-start text-left w-full"
              >
                <CardHeader className="gap-3 p-0 flex flex-col items-start w-full">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <item.icon className="size-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground tracking-tight w-full">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed font-normal w-full">
                    {item.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-accent/30 py-24 px-6 border-b border-border/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center justify-items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">
                Por qué Bopacorp
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl leading-tight">
                Más que un proveedor, un aliado tecnológico
              </h2>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed font-normal">
              Como Partner de una de las empresas de telecomunicaciones más grandes de Ecuador, en
              Bohorquez & Pauta Corp (Bopacorp S.A.) innovamos desde nuestra matriz en Guayaquil
              para brindar soluciones integradas de conectividad, equipos informáticos y tecnología
              celular a nivel nacional.
            </p>
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex gap-4 items-start">
                <span className="text-xl font-semibold text-primary/40 bg-primary/5 size-8 rounded-lg flex items-center justify-center shrink-0">
                  01
                </span>
                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    Asesoría Corporativa Personalizada
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 font-normal">
                    No vendemos planes genéricos. Analizamos la infraestructura de tu empresa para
                    diseñar una solución a la medida de tus necesidades de comunicación y
                    presupuesto.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-xl font-semibold text-primary/40 bg-primary/5 size-8 rounded-lg flex items-center justify-center shrink-0">
                  02
                </span>
                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    Garantía de Continuidad y Conectividad
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 font-normal">
                    Aseguramos la operación de tu negocio con enlaces dedicados de fibra óptica y
                    redes móviles de alta velocidad respaldadas por la infraestructura más robusta
                    del país.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-xl font-semibold text-primary/40 bg-primary/5 size-8 rounded-lg flex items-center justify-center shrink-0">
                  03
                </span>
                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    Soporte Técnico Especializado
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 font-normal">
                    Acompañamos el crecimiento de tus proyectos con un equipo de atención dedicado a
                    resolver incidencias rápidamente, garantizando la estabilidad de tus sistemas.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 w-full flex flex-col items-center justify-center self-stretch overflow-hidden rounded-2xl shadow-md border border-border/30 bg-card transition-shadow hover:shadow-lg">
            <img
              src={teamImg}
              alt="Bopacorp Team"
              className="size-full object-cover aspect-[5/6]"
            />
          </div>
        </div>
      </section>

      <section className="w-full text-white relative overflow-hidden py-24 px-6 bg-gradient-to-r from-hero via-hero-mid to-primary">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-xs font-normal text-white/90 tracking-wider uppercase">
            ¿Listo para conectar tu empresa?
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
            Impulsa tu negocio con <br className="hidden sm:block" />{' '}
            <span className="text-primary">conectividad real</span>
          </h2>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto font-normal">
            Habla con uno de nuestros asesores y encuentra el plan corporativo ideal para tu
            empresa. Sin compromisos.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2 w-full">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-md font-medium px-8 w-full sm:w-auto"
            >
              <MessageCircle className="mr-2 size-4" />
              Cotizar Ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 rounded-md font-medium px-8 w-full sm:w-auto"
            >
              Ver Planes
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
