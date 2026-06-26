import { ArrowRight, Check, Globe, MessageCircle, Smartphone, Wifi } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CMS_IMAGE_KEYS } from '@/modules/cms/cms-image-blocks.js';
import { useContactDialog } from '@/modules/contact/index.js';
import { BlueprintGrid, ContourMotif } from '../components/decor.js';
import { useCmsLanding } from '../hooks/use-cms-landing.js';

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
];

type Blocks = Record<string, { body: string | null }> | null;

function resolveCms(blocks: Blocks) {
  return (key: string, fallback: string) => blocks?.[key]?.body ?? fallback;
}

function splitAtHighlight(text: string, highlight: string): [string, string] {
  const idx = text.indexOf(highlight);
  if (idx === -1) return [text, ''];
  return [text.slice(0, idx), text.slice(idx + highlight.length)];
}

function getImagesCms(r: ReturnType<typeof resolveCms>) {
  return {
    heroBackground: r(CMS_IMAGE_KEYS.heroBackground, ''),
    aboutImage: r(CMS_IMAGE_KEYS.aboutImage, ''),
  };
}

function getCmsContent(blocks: Blocks) {
  const r = resolveCms(blocks);
  return { hero: getHeroCms(r), about: getAboutCms(r), cta: getCtaCms(r), images: getImagesCms(r) };
}

function buildFeature(r: ReturnType<typeof resolveCms>, n: number) {
  const features = [
    {
      title: 'Aliado Estratégico de Tigo',
      desc: 'Somos distribuidores oficiales, ofreciendo conectividad confiable, telefonía y servicios digitales con respaldo directo.',
    },
    {
      title: 'Cobertura a Nivel Nacional',
      desc: 'Líderes en la Región Costa con capacidad operativa y soluciones integrales en la Sierra y Amazonía.',
    },
    {
      title: '7 Años de Experiencia',
      desc: 'Más de 300 clientes corporativos atendidos con un enfoque personalizado de alta calidad adaptado a tu negocio.',
    },
  ];

  const feature = features[n - 1];

  return {
    title: r(`about.feature_${n}_title`, feature.title),
    desc: r(`about.feature_${n}_desc`, feature.desc),
  };
}

function getHeroCms(r: ReturnType<typeof resolveCms>) {
  const title = r('hero.title', 'Conectividad que impulsa tu empresa');
  const highlight = r('hero.highlight', 'impulsa');
  return {
    title,
    highlight,
    titleParts: splitAtHighlight(title, highlight),
    description: r(
      'hero.description',
      'Conectamos tu negocio con tecnología de punta. Planes corporativos, conectividad de alta velocidad y servicios digitales diseñados para impulsar tu empresa.',
    ),
    ctaPrimaryLabel: r('hero.cta_primary_label', 'Ver catálogo de servicios'),
    ctaSecondaryLabel: r('hero.cta_secondary_label', 'Conoce más'),
  };
}

function getAboutCms(r: ReturnType<typeof resolveCms>) {
  return {
    eyebrow: r('about.eyebrow', 'Por qué Bopacorp'),
    title: r('about.title', 'Tu aliado estratégico en telecomunicaciones'),
    description: r(
      'about.description',
      'En BOPACORP S.A. somos distribuidores oficiales de Tigo y brindamos soluciones integrales de telecomunicaciones que potencian la productividad de las empresas ecuatorianas. Con 7 años de experiencia, innovamos desde nuestra matriz en Guayaquil para brindar soluciones de conectividad, equipos y servicios digitales a nivel nacional.',
    ),
    features: [buildFeature(r, 1), buildFeature(r, 2), buildFeature(r, 3)],
  };
}

function getCtaCms(r: ReturnType<typeof resolveCms>) {
  const title = r('cta.title', 'Impulsa tu negocio con conectividad real');
  const highlight = r('cta.highlight', 'conectividad real');
  return {
    title,
    highlight,
    titleParts: splitAtHighlight(title, highlight),
    eyebrow: r('cta.eyebrow', 'Asesoría comercial sin costo'),
    description: r(
      'cta.description',
      'Habla con uno de nuestros asesores y encuentra el plan corporativo ideal para tu empresa. Sin compromisos.',
    ),
    primaryLabel: r('cta.primary_label', 'Cotizar Ahora'),
    secondaryLabel: r('cta.secondary_label', 'Ver Planes'),
  };
}

type CmsContent = ReturnType<typeof getCmsContent>;

function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative font-brand text-primary">
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-[3px] w-full rounded-full bg-primary/40"
      />
    </span>
  );
}

function HeroStat({ value, label, index }: { value: string; label: string; index: number }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 px-6 py-7 transition-colors group border-white/10',
        index % 2 !== 0 && 'border-l',
        index >= 2 && 'border-t md:border-t-0',
        index === 2 && 'md:border-l',
      )}
    >
      <span className="font-brand text-3xl font-semibold tracking-tight text-white tabular-nums transition-colors group-hover:text-primary md:text-4xl">
        {value}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/50 md:text-xs">
        {label}
      </span>
    </div>
  );
}

function HeroSection({ hero, images }: { hero: CmsContent['hero']; images: CmsContent['images'] }) {
  const { openContactDialog } = useContactDialog();
  return (
    <div className="relative overflow-hidden bg-hero text-white">
      <img
        src={images.heroBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full scale-105 object-cover opacity-20 pointer-events-none z-0"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-24 size-[42rem] rounded-full bg-primary/25 blur-[140px] pointer-events-none z-0"
      />
      <BlueprintGrid className="text-white/5 mask-fade-center" />
      <ContourMotif className="contour-drift absolute -right-40 top-1/2 w-[44rem] -translate-y-1/2 text-white/10 z-0" />

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-10 px-6 pt-14 pb-16 md:pt-20 md:pb-20">
        <div className="landing-rise flex max-w-3xl flex-col items-start gap-6">
          <h1 className="font-brand text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            {hero.titleParts[0]}
            <Highlight>{hero.highlight}</Highlight>
            {hero.titleParts[1]}
          </h1>
          <p
            className="landing-rise max-w-xl text-lg font-normal leading-relaxed text-white/70"
            style={{ animationDelay: '120ms' }}
          >
            {hero.description}
          </p>
          <div
            className="landing-rise flex flex-wrap gap-3 pt-2"
            style={{ animationDelay: '220ms' }}
          >
            <Button asChild size="lg" className="h-12 rounded-md px-7 text-sm font-medium">
              <Link to="/servicios">
                {hero.ctaPrimaryLabel}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => openContactDialog()}
              className="h-12 rounded-md border-white/30 bg-transparent px-7 text-sm font-medium text-white hover:bg-white/10 hover:text-white"
            >
              <MessageCircle className="mr-2 size-4" />
              Hablar con un asesor
            </Button>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-0 md:grid-cols-4">
          <HeroStat index={0} value="+300" label="clientes corporativos" />
          <HeroStat index={1} value="7 años" label="de experiencia" />
          <HeroStat index={2} value="Costa" label="líderes regionales" />
          <HeroStat index={3} value="12" label="colaboradores" />
        </div>
      </div>
    </div>
  );
}

function ServiceRow({ item }: { item: (typeof SERVICES)[number] }) {
  const Icon = item.icon;
  return (
    <div className="group relative grid grid-cols-1 gap-5 border-b border-border border-l-2 border-l-transparent py-7 px-4 transition-colors hover:border-l-primary hover:bg-muted/40 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6">
      <span className="flex size-12 items-center justify-center rounded-xl border border-border text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="flex max-w-xl flex-col gap-1.5">
          <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {item.title}
          </h3>
          <p className="text-sm font-normal leading-relaxed text-muted-foreground">{item.desc}</p>
        </div>
        <ArrowRight className="hidden size-5 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-1 group-hover:text-primary sm:block" />
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <section className="relative bg-background px-6 py-16 md:py-20">
      <BlueprintGrid className="text-foreground/5 mask-fade-top" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
        <header className="flex flex-col gap-4 self-start lg:sticky lg:top-28 lg:col-span-4">
          <span aria-hidden="true" className="h-px w-10 bg-primary" />
          <h2 className="font-brand text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            Lo que hacemos por tu empresa
          </h2>
          <p className="max-w-sm text-base font-normal leading-relaxed text-muted-foreground">
            Soluciones integradas de telecomunicaciones para empresas que necesitan fiabilidad,
            velocidad y soporte 24/7.
          </p>
        </header>
        <div className="flex flex-col border-t border-border lg:col-span-8">
          {SERVICES.map((item) => (
            <ServiceRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutFeatureRow({ feature }: { feature: { title: string; desc: string } }) {
  return (
    <div className="group flex items-start gap-4 border-b border-border py-5 transition-colors hover:bg-background/60">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Check className="size-3.5" />
      </span>
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {feature.title}
        </h4>
        <p className="text-sm font-normal leading-relaxed text-muted-foreground">{feature.desc}</p>
      </div>
    </div>
  );
}

function AboutSection({
  about,
  images,
}: {
  about: CmsContent['about'];
  images: CmsContent['images'];
}) {
  return (
    <section className="relative border-y border-border bg-muted/30 px-6 py-16 md:py-20">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col items-start gap-7 lg:col-span-7">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {about.eyebrow}
            </span>
          </div>
          <h2 className="font-brand text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {about.title}
          </h2>
          <p className="max-w-xl text-base font-normal leading-relaxed text-muted-foreground">
            {about.description}
          </p>
          <div className="mt-2 flex w-full flex-col border-t border-border">
            {about.features.map((f) => (
              <AboutFeatureRow key={f.title} feature={f} />
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-5 px-3">
          <div
            aria-hidden="true"
            className="absolute -inset-3 -z-10 rounded-3xl border border-primary/20"
          />
          <div className="relative aspect-[5/6] overflow-hidden rounded-2xl border border-border/50 shadow-sm">
            <img src={images.aboutImage} alt="Bopacorp Team" className="size-full object-cover" />
            <ContourMotif className="absolute -bottom-24 -right-24 w-72 text-white/25" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-hero/40 to-transparent"
            />
          </div>
          <span
            aria-hidden="true"
            className="absolute -top-3 -left-3 size-6 border-l-2 border-t-2 border-primary"
          />
        </div>
      </div>
    </section>
  );
}

function CtaSection({ cta }: { cta: CmsContent['cta'] }) {
  const { openContactDialog } = useContactDialog();
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-hero px-6 py-20 text-white md:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-hero via-hero-mid to-primary/80"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-32 size-[40rem] rounded-full bg-primary/30 blur-[140px]"
      />
      <BlueprintGrid className="text-white/5 mask-fade-center" />
      <ContourMotif className="contour-drift absolute -left-40 top-1/2 w-[40rem] -translate-y-1/2 text-white/10" />
      <ContourMotif className="absolute -bottom-40 -right-40 w-[32rem] text-white/[0.06]" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <span className="landing-rise text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {cta.eyebrow}
        </span>
        <h2
          className="landing-rise font-brand text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl"
          style={{ animationDelay: '100ms' }}
        >
          {cta.titleParts[0]}
          <br className="hidden sm:block" /> <Highlight>{cta.highlight}</Highlight>
          {cta.titleParts[1]}
        </h2>
        <p
          className="landing-rise max-w-xl text-lg font-normal leading-relaxed text-white/70"
          style={{ animationDelay: '200ms' }}
        >
          {cta.description}
        </p>
        <div
          className="landing-rise flex w-full flex-col items-center gap-3 pt-2 sm:w-auto sm:flex-row"
          style={{ animationDelay: '300ms' }}
        >
          <Button
            size="lg"
            variant="secondary"
            onClick={() => openContactDialog()}
            className="h-12 w-full rounded-md px-8 text-sm font-medium sm:w-auto"
          >
            <MessageCircle className="mr-2 size-4" />
            {cta.primaryLabel}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/servicios')}
            className="h-12 w-full rounded-md border-white/30 bg-transparent px-8 text-sm font-medium text-white hover:bg-white/10 hover:text-white sm:w-auto"
          >
            {cta.secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

function LandingPageSkeleton() {
  return (
    <div className="flex w-full flex-col bg-background">
      <div className="relative w-full overflow-hidden bg-hero text-white">
        <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-10 px-6 pt-14 pb-16 md:pt-20 md:pb-20">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-12 w-44" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </section>
        <div className="relative z-10 w-full border-t border-white/10 bg-black/20 py-2">
          <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2 px-6 py-7">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-3 w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="relative w-full bg-background px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <span aria-hidden="true" className="h-px w-10 bg-primary/40" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <div className="flex flex-col lg:col-span-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-5 border-b border-border py-7">
                <Skeleton className="size-12 rounded-xl" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full border-y border-border bg-muted/30 px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <div className="mt-2 flex w-full flex-col">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-4 border-b border-border py-5">
                  <Skeleton className="size-6 rounded-md" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="aspect-[5/6] w-full rounded-2xl" />
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-hero px-6 py-20 text-white md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <Skeleton className="h-7 w-56 rounded-full" />
          <Skeleton className="h-14 w-3/4" />
          <Skeleton className="h-6 w-2/3" />
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </section>
    </div>
  );
}

function showCmsError(retry: () => void) {
  toast.error('No se pudo cargar el contenido actualizado.', {
    id: 'cms-landing-error',
    action: { label: 'Reintentar', onClick: retry },
  });
}

function dismissCmsError() {
  toast.dismiss('cms-landing-error');
}

export default function LandingPage() {
  const { blocks, loading, error, retry } = useCmsLanding();

  useEffect(() => {
    if (error) showCmsError(retry);
    else dismissCmsError();
  }, [error, retry]);

  if (loading && !blocks) return <LandingPageSkeleton />;
  const { hero, about, cta, images } = getCmsContent(blocks);
  return (
    <div className="flex w-full flex-col bg-background">
      <HeroSection hero={hero} images={images} />
      <ServicesSection />
      <AboutSection about={about} images={images} />
      <CtaSection cta={cta} />
    </div>
  );
}
