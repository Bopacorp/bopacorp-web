import { Award, Eye, Lightbulb, ShieldCheck, Target } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCmsLanding } from '../hooks/use-cms-landing.js';

const HERO_DESCRIPTION_FALLBACK =
  'Con más de 7 años transformando la conectividad de negocios en toda la región, construyendo el futuro digital del Ecuador.';

const HISTORY_PARAGRAPH_1_FALLBACK =
  'Fundada en 2019 con la visión de revolucionar las telecomunicaciones empresariales en Ecuador. Desde nuestros inicios en Guayaquil, nos hemos enfocado en ofrecer soluciones de conectividad robustas y confiables para empresas de todos los tamaños como Partners oficiales de Movistar.';

const HISTORY_PARAGRAPH_2_FALLBACK =
  'A lo largo de los años, hemos expandido nuestra red de cobertura, incorporado tecnologías de última generación y construido relaciones duraderas con cientos de empresas que confían en nosotros para mantener sus operaciones activas 24/7 sin interrupciones.';

const MISSION_BODY_FALLBACK =
  'Proveer soluciones de telecomunicaciones integrales que impulsen el crecimiento y la eficiencia operativa de nuestros clientes empresariales, garantizando conectividad de clase mundial con el mejor soporte técnico.';

const VISION_BODY_FALLBACK =
  'Ser la empresa líder en telecomunicaciones corporativas en la región, reconocida por nuestra innovación tecnológica, excelencia en servicio y capacidad para adaptarnos a las necesidades del mercado.';

const VALUE_DESCRIPTIONS_FALLBACK = [
  'Buscamos constantemente nuevas tecnologías para mantener a nuestros clientes corporativos siempre a la vanguardia.',
  'Construimos relaciones transparentes y duraderas basadas en la seguridad de nuestra red y el respaldo técnico.',
  'Nos exigimos el más alto nivel de calidad en cada enlace, instalación y atención al cliente.',
];

const VALUES = [
  { id: 'innovation', icon: Lightbulb, fallbackTitle: 'Innovación' },
  { id: 'trust', icon: ShieldCheck, fallbackTitle: 'Confianza' },
  { id: 'excellence', icon: Award, fallbackTitle: 'Excelencia' },
];

type Blocks = Record<string, { body: string }> | null;
type Resolver = (key: string, fallback: string) => string;

function resolveCms(blocks: Blocks) {
  return (key: string, fallback: string) => blocks?.[key]?.body ?? fallback;
}

function splitAtHighlight(text: string, highlight: string): [string, string] {
  const idx = text.indexOf(highlight);
  if (idx === -1) return [text, ''];
  return [text.slice(0, idx), text.slice(idx + highlight.length)];
}

function getHeroCms(r: Resolver) {
  const title = r('about_page.hero.title', 'Líderes en telecomunicaciones empresariales');
  const highlight = r('about_page.hero.highlight', 'empresariales');
  return {
    eyebrow: r('about_page.hero.eyebrow', '¿Quienes somos?'),
    title,
    highlight,
    titleParts: splitAtHighlight(title, highlight),
    description: r('about_page.hero.description', HERO_DESCRIPTION_FALLBACK),
  };
}

function getHistoryCms(r: Resolver) {
  return {
    title: r('about_page.history.title', 'Nuestra Historia'),
    paragraphs: [
      r('about_page.history.paragraph_1', HISTORY_PARAGRAPH_1_FALLBACK),
      r('about_page.history.paragraph_2', HISTORY_PARAGRAPH_2_FALLBACK),
    ],
    mission: {
      title: r('about_page.mission.title', 'Nuestra Misión'),
      body: r('about_page.mission.body', MISSION_BODY_FALLBACK),
    },
    vision: {
      title: r('about_page.vision.title', 'Nuestra Visión'),
      body: r('about_page.vision.body', VISION_BODY_FALLBACK),
    },
  };
}

function getValuesCms(r: Resolver) {
  return {
    title: r('about_page.values.title', 'Nuestros Valores'),
    items: VALUE_DESCRIPTIONS_FALLBACK.map((fallbackDesc, idx) => {
      const slot = idx + 1;
      return {
        title: r(`about_page.values.item_${slot}_title`, VALUES[idx].fallbackTitle),
        desc: r(`about_page.values.item_${slot}_desc`, fallbackDesc),
      };
    }),
  };
}

function getCmsContent(blocks: Blocks) {
  const r = resolveCms(blocks);
  return { hero: getHeroCms(r), history: getHistoryCms(r), values: getValuesCms(r) };
}

function AboutPageSkeleton() {
  return (
    <div className="w-full flex flex-col font-sans">
      <section className="w-full relative py-24 px-6 border-b border-border/50 bg-hero overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-14 w-3/4" />
          <Skeleton className="h-6 w-2/3 max-w-2xl" />
        </div>
      </section>

      <section className="w-full bg-accent/20 py-24 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-8 w-1/2" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-10/12" />
              <Skeleton className="h-5 w-9/12" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="bg-card border-l-4 border-primary border-y-border border-r-border rounded-lg p-6 flex flex-col gap-3"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <Skeleton className="h-8 w-1/3 mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-8 bg-muted rounded-2xl border border-border"
              >
                <Skeleton className="size-14 rounded-full mb-6" />
                <Skeleton className="h-6 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function showCmsError(retry: () => void) {
  toast.error('No se pudo cargar el contenido actualizado.', {
    id: 'cms-about-error',
    action: { label: 'Reintentar', onClick: retry },
  });
}

function dismissCmsError() {
  toast.dismiss('cms-about-error');
}

export default function AboutPage() {
  const { blocks, loading, error, retry } = useCmsLanding();

  useEffect(() => {
    if (error) showCmsError(retry);
    else dismissCmsError();
  }, [error, retry]);

  if (loading && !blocks) return <AboutPageSkeleton />;
  const { hero, history, values } = getCmsContent(blocks);
  return (
    <div className="w-full flex flex-col font-sans">
      <section className="w-full relative py-24 px-6 border-b border-border/50 bg-hero overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-xs font-normal text-white/90 tracking-wider uppercase">
            {hero.eyebrow}
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            {hero.titleParts[0]}
            <br className="hidden md:block" />
            <span className="text-primary">{hero.highlight}</span>
            {hero.titleParts[1]}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
            {hero.description}
          </p>
        </div>
      </section>

      <section className="w-full bg-accent/20 py-24 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              {history.title}
            </h2>
            <div className="flex flex-col gap-4 text-muted-foreground font-normal leading-relaxed text-base">
              {history.paragraphs.map((paragraph, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static 2-paragraph layout, never reorders
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="bg-card border-l-4 border-primary border-y-border border-r-border shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="size-5" />
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  {history.mission.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {history.mission.body}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-l-4 border-primary border-y-border border-r-border shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Eye className="size-5" />
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  {history.vision.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {history.vision.body}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-semibold text-foreground mb-16">{values.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {VALUES.map((val, idx) => {
              const item = values.items[idx];
              return (
                <div
                  key={val.id}
                  className="flex flex-col items-center text-center p-8 bg-muted rounded-2xl border border-border hover:border-primary/50 transition-all shadow-sm"
                >
                  <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <val.icon className="size-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
