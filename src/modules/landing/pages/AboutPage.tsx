import { Award, Eye, Lightbulb, ShieldCheck, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col font-sans">
      <section className="w-full relative py-24 px-6 border-b border-border/50 bg-hero overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-xs font-normal text-white/90 tracking-wider uppercase">
            ¿Quienes somos?
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            Líderes en telecomunicaciones <br className="hidden md:block" />
            <span className="text-primary">empresariales</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
            Con más de 7 años transformando la conectividad de negocios en toda la región,
            construyendo el futuro digital del Ecuador.
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
                Fundada en 2019 con la visión de revolucionar las telecomunicaciones empresariales
                en Ecuador. Desde nuestros inicios en Guayaquil, nos hemos enfocado en ofrecer
                soluciones de conectividad robustas y confiables para empresas de todos los tamaños
                como Partners oficiales de Movistar.
              </p>
              <p>
                A lo largo de los años, hemos expandido nuestra red de cobertura, incorporado
                tecnologías de última generación y construido relaciones duraderas con cientos de
                empresas que confían en nosotros para mantener sus operaciones activas 24/7 sin
                interrupciones.
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
                  Proveer soluciones de telecomunicaciones integrales que impulsen el crecimiento y
                  la eficiencia operativa de nuestros clientes empresariales, garantizando
                  conectividad de clase mundial con el mejor soporte técnico.
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
                  Ser la empresa líder en telecomunicaciones corporativas en la región, reconocida
                  por nuestra innovación tecnológica, excelencia en servicio y capacidad para
                  adaptarnos a las necesidades del mercado.
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
                <h3 className="text-xl font-semibold mb-3 text-foreground">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
