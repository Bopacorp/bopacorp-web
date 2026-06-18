import { ArrowRight, Globe, MessageCircle, Smartphone, Wifi } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CMS_IMAGE_KEYS } from '@/modules/cms/cms-image-blocks.js';
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
    eyebrow: r('cta.eyebrow', '¿Listo para conectar tu empresa?'),
    description: r(
      'cta.description',
      'Habla con uno de nuestros asesores y encuentra el plan corporativo ideal para tu empresa. Sin compromisos.',
    ),
    primaryLabel: r('cta.primary_label', 'Cotizar Ahora'),
    secondaryLabel: r('cta.secondary_label', 'Ver Planes'),
  };
}

function LandingPageSkeleton() {
  return (
    <div className="w-full bg-background flex flex-col">
      <div className="w-full border-b border-border text-white relative overflow-hidden bg-hero">
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center gap-10 relative z-10">
          <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto w-full">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </section>
        <div className="w-full border-t border-white/10 bg-black/20 backdrop-blur-sm py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="w-full bg-muted/30 py-20 px-6 border-b border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-4">
            <Skeleton className="h-10 w-1/2 max-w-md" />
            <Skeleton className="h-5 w-2/3 max-w-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="border border-border/60 rounded-xl bg-card p-6 flex flex-col gap-4"
              >
                <Skeleton className="size-12 rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-accent/30 py-24 px-6 border-b border-border/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center justify-items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-6 w-full">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <div className="flex flex-col gap-6 mt-4 w-full">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-4 items-start w-full">
                  <Skeleton className="size-8 rounded-lg" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 w-full">
            <Skeleton className="aspect-[5/6] w-full rounded-2xl" />
          </div>
        </div>
      </section>

      <section className="w-full text-white relative overflow-hidden py-24 px-6 bg-gradient-to-r from-hero via-hero-mid to-primary">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
          <Skeleton className="h-7 w-64 rounded-full" />
          <Skeleton className="h-14 w-3/4" />
          <Skeleton className="h-6 w-2/3" />
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2 w-full">
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
    <div className="w-full bg-background flex flex-col">
      <div className="w-full border-b border-border text-white relative overflow-hidden bg-hero">
        <img
          src={images.heroBackground}
          alt="Network Background"
          className="absolute inset-0 size-full object-cover opacity-25 pointer-events-none z-0"
        />

        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center gap-10 relative z-10">
          <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.15]">
              {hero.titleParts[0]}
              <span className="text-primary">{hero.highlight}</span>
              {hero.titleParts[1]}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl font-normal">
              {hero.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-md font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 border-none cursor-pointer"
              >
                <Link to="/services">
                  {hero.ctaPrimaryLabel}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 rounded-md transition-colors font-medium cursor-pointer"
              >
                <Link to="/about">{hero.ctaSecondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="w-full border-t border-white/10 bg-black/20 backdrop-blur-sm py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl md:text-3xl font-semibold text-white">+300</span>
              <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
                clientes corporativos
              </span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-white/10 pl-6 max-md:border-l-0 max-md:pl-0">
              <span className="text-2xl md:text-3xl font-semibold text-white">7 años</span>
              <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
                de experiencia
              </span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-white/10 pl-6">
              <span className="text-2xl md:text-3xl font-semibold text-white">Costa</span>
              <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
                líderes regionales
              </span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-white/10 pl-6 max-md:border-l-0 max-md:pl-0">
              <span className="text-2xl md:text-3xl font-semibold text-white">12</span>
              <span className="text-xs md:text-sm text-white/60 mt-1 uppercase tracking-wider font-medium">
                colaboradores
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
                {about.eyebrow}
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl leading-tight">
                {about.title}
              </h2>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed font-normal">
              {about.description}
            </p>
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex gap-4 items-start">
                <span className="text-xl font-semibold text-primary/40 bg-primary/5 size-8 rounded-lg flex items-center justify-center shrink-0">
                  01
                </span>
                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    {about.features[0].title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 font-normal">
                    {about.features[0].desc}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-xl font-semibold text-primary/40 bg-primary/5 size-8 rounded-lg flex items-center justify-center shrink-0">
                  02
                </span>
                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    {about.features[1].title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 font-normal">
                    {about.features[1].desc}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-xl font-semibold text-primary/40 bg-primary/5 size-8 rounded-lg flex items-center justify-center shrink-0">
                  03
                </span>
                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    {about.features[2].title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 font-normal">
                    {about.features[2].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 w-full flex flex-col items-center justify-center self-stretch overflow-hidden rounded-2xl shadow-md border border-border/30 bg-card transition-shadow hover:shadow-lg">
            <img
              src={images.aboutImage}
              alt="Bopacorp Team"
              className="size-full object-cover aspect-[5/6]"
            />
          </div>
        </div>
      </section>

      <section className="w-full text-white relative overflow-hidden py-24 px-6 bg-gradient-to-r from-hero via-hero-mid to-primary">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-xs font-normal text-white/90 tracking-wider uppercase">
            {cta.eyebrow}
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
            {cta.titleParts[0]}
            <br className="hidden sm:block" /> <span className="text-primary">{cta.highlight}</span>
            {cta.titleParts[1]}
          </h2>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto font-normal">
            {cta.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2 w-full">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-md font-medium px-8 w-full sm:w-auto"
            >
              <MessageCircle className="mr-2 size-4" />
              {cta.primaryLabel}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 rounded-md font-medium px-8 w-full sm:w-auto"
            >
              {cta.secondaryLabel}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
