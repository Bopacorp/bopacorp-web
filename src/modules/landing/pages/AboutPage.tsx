import { Award, Eye, Lightbulb, ShieldCheck, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCmsLanding } from '../hooks/use-cms-landing.js';

function resolveCms(blocks: Record<string, { body: string }> | null) {
  return (key: string, fallback: string) => blocks?.[key]?.body ?? fallback;
}

export default function AboutPage() {
  const { blocks } = useCmsLanding();
  const r = resolveCms(blocks);

  const VALUES = [
    {
      id: 'innovation',
      title: 'Innovación',
      icon: Lightbulb,
      desc: 'Buscamos constantemente nuevas tecnologías para mantener a nuestros clientes corporativos siempre a la vanguardia.',
    },
    {
      id: 'trust',
      title: 'Confianza',
      icon: ShieldCheck,
      desc: 'Construimos relaciones transparentes y duraderas basadas en la seguridad de nuestra red y el respaldo técnico.',
    },
    {
      id: 'excellence',
      title: 'Excelencia',
      icon: Award,
      desc: 'Nos exigimos el más alto nivel de calidad en cada enlace, instalación y atención al cliente.',
    },
  ];

  return (
    <div className="w-full flex flex-col font-sans">
      <section className="w-full relative py-24 px-6 border-b border-border/50 bg-hero overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-xs font-normal text-white/90 tracking-wider uppercase">
            ¿Quiénes somos?
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            Conectando el <br className="hidden md:block" />
            <span className="text-primary">futuro de tu empresa</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
            Distribuidor oficial de Tigo. Soluciones integrales de telecomunicaciones para empresas
            ecuatorianas desde 2019.
          </p>
        </div>
      </section>

      <section className="w-full bg-accent/20 py-24 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Nuestra Historia
            </h2>
            <div className="flex flex-col gap-4 text-muted-foreground font-normal leading-relaxed text-base">
              <p>
                Fundada en junio de 2019 en Guayaquil, Ecuador, por José Mario Bohórquez y Christian
                Pauta. Iniciamos operaciones como socios oficiales de Tigo, enfocándonos en atender
                las necesidades de empresas en la Región Costa. Gracias a nuestro compromiso, nos
                hemos posicionado como una de las distribuidoras de soluciones integrales más
                importantes de la región.
              </p>
              <p>
                Con 7 años de trayectoria, hoy brindamos soluciones de telecomunicaciones que
                incluyen conectividad confiable, telefonía móvil, equipos y servicios digitales
                personalizados para potenciar el crecimiento de nuestros clientes corporativos a
                nivel nacional.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="bg-card border-l-4 border-primary border-y-border border-r-border shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="size-5" />
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  Nuestra Misión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Somos distribuidores oficiales de Tigo, brindando soluciones integrales de
                  telecomunicaciones que potencian la productividad y el crecimiento de las empresas
                  ecuatorianas con un enfoque personalizado de alta calidad.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-l-4 border-primary border-y-border border-r-border shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Eye className="size-5" />
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  Nuestra Visión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Consolidarnos como el aliado estratégico de telecomunicaciones de referencia en el
                  Ecuador, manteniendo nuestro liderazgo en la Región Costa y fortaleciendo nuestra
                  presencia en la Sierra y Amazonía.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-semibold text-foreground mb-16">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {VALUES.map((val) => (
              <div
                key={val.id}
                className="flex flex-col items-center text-center p-8 bg-muted rounded-2xl border border-border hover:border-primary/50 transition-all shadow-sm"
              >
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <val.icon className="size-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {r(`about.value_${val.id}_title`, val.title)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r(`about.value_${val.id}_desc`, val.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
