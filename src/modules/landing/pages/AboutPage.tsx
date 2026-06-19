import { Award, Eye, Lightbulb, ShieldCheck, Target } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CMS_IMAGE_KEYS } from '@/modules/cms/cms-image-blocks.js';
import { BlueprintGrid, ContourMotif } from '../components/decor.js';
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

type Blocks = Record<string, { body: string | null }> | null;
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
  return {
    hero: getHeroCms(r),
    history: getHistoryCms(r),
    values: getValuesCms(r),
    aboutImage: r(CMS_IMAGE_KEYS.aboutImage, ''),
  };
}

type CmsContent = ReturnType<typeof getCmsContent>;

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="h-px w-10 bg-primary" />
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{label}</span>
    </div>
  );
}

function HeroSection({ hero, images }: { hero: CmsContent['hero']; images: string }) {
  return (
    <div className="relative overflow-hidden bg-hero text-white">
      <img
        src={images}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover opacity-25 pointer-events-none z-0"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-hero/80 via-hero/70 to-hero z-0"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-24 size-[40rem] rounded-full bg-primary/20 blur-[150px] pointer-events-none z-0"
      />
      <ContourMotif className="absolute -right-40 -bottom-56 w-[44rem] text-white/[0.07] z-0" />

      <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 pt-20 pb-24 text-center md:pt-28 md:pb-32">
        <h1 className="landing-rise font-brand text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
          {hero.eyebrow}
        </h1>
        <p
          className="landing-rise font-brand text-xl font-medium leading-relaxed text-white/90 sm:text-2xl"
          style={{ animationDelay: '100ms' }}
        >
          {hero.titleParts[0]}
          <span className="relative font-brand text-primary">
            {hero.highlight}
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 left-0 h-[3px] w-full rounded-full bg-primary/40"
            />
          </span>
          {hero.titleParts[1]}
        </p>
        <p
          className="landing-rise max-w-2xl text-lg font-normal leading-relaxed text-white/70"
          style={{ animationDelay: '200ms' }}
        >
          {hero.description}
        </p>
      </section>
    </div>
  );
}

function HistoryParagraph({ children }: { children: ReactNode }) {
  return (
    <p className="text-base font-normal leading-relaxed text-muted-foreground first:text-foreground">
      {children}
    </p>
  );
}

function PrinciplePanel({
  icon: Icon,
  title,
  body,
  accent,
}: {
  icon: typeof Target;
  title: string;
  body: string;
  accent: 'primary' | 'accent';
}) {
  return (
    <div className="relative flex flex-col gap-4 border border-border bg-card p-7 rounded-xl">
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 top-7 h-[calc(100%-3.5rem)] w-[3px] rounded-full',
          accent === 'primary' ? 'bg-primary' : 'bg-foreground/30',
        )}
      />
      <div className="flex items-center gap-3.5">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <h3 className="font-brand text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      </div>
      <p className="text-sm font-normal leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function HistorySection({ history }: { history: CmsContent['history'] }) {
  return (
    <section className="relative border-b border-border bg-background px-6 py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <SectionEyebrow label="Trayectoria" />
          <h2 className="font-brand text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {history.title}
          </h2>
          <div className="flex flex-col gap-4">
            {history.paragraphs.map((paragraph, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static 2-paragraph layout, never reorders
              <HistoryParagraph key={i}>{paragraph}</HistoryParagraph>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-6">
          <PrinciplePanel
            icon={Target}
            title={history.mission.title}
            body={history.mission.body}
            accent="primary"
          />
          <PrinciplePanel
            icon={Eye}
            title={history.vision.title}
            body={history.vision.body}
            accent="accent"
          />
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  value,
  item,
}: {
  value: (typeof VALUES)[number];
  item: { title: string; desc: string };
}) {
  const Icon = value.icon;
  return (
    <div className="group relative flex flex-col gap-5 border border-border bg-card p-7 rounded-xl transition-colors hover:border-primary/50">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-6" />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-brand text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        <p className="text-sm font-normal leading-relaxed text-muted-foreground">{item.desc}</p>
      </div>
    </div>
  );
}

function ValuesSection({ values }: { values: CmsContent['values'] }) {
  return (
    <section className="relative bg-muted/30 px-6 py-16 md:py-20">
      <BlueprintGrid className="text-foreground/5 mask-fade-top" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col gap-4 items-start">
          <SectionEyebrow label="Principios" />
          <h2 className="font-brand text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {values.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUES.map((val, idx) => (
            <ValueCard key={val.id} value={val} item={values.items[idx]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPageSkeleton() {
  return (
    <div className="w-full flex flex-col font-sans">
      <div className="relative w-full overflow-hidden bg-hero text-white">
        <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-7 px-6 pt-20 pb-24 text-center md:pt-28 md:pb-32">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-14 w-3/4" />
          <Skeleton className="h-6 w-2/3 max-w-2xl" />
        </section>
      </div>

      <section className="w-full bg-background px-6 py-16 md:py-20 border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-4 border border-border bg-card p-7 rounded-xl"
              >
                <div className="flex items-center gap-3.5">
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

      <section className="w-full bg-muted/30 px-6 py-16 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="flex flex-col gap-4 items-start">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-1/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-5 border border-border bg-card p-7 rounded-xl"
              >
                <Skeleton className="size-12 rounded-xl" />
                <Skeleton className="h-5 w-1/2" />
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
  const { hero, history, values, aboutImage } = getCmsContent(blocks);
  return (
    <div className="w-full flex flex-col font-sans">
      <HeroSection hero={hero} images={aboutImage} />
      <HistorySection history={history} />
      <ValuesSection values={values} />
    </div>
  );
}
