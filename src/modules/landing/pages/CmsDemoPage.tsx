import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import type { CmsLandingResponse, ContentBlockResponse } from '@bopacorp/shared/catalog';

type CmsBlocks = Record<string, ContentBlockResponse>;

function getSection(key: string, blocks: CmsBlocks): ContentBlockResponse[] {
  return Object.values(blocks).filter(
    (b) => b.contentKey === key || b.contentKey.startsWith(`${key}.`),
  );
}

function getBlock(key: string, blocks: CmsBlocks): ContentBlockResponse | undefined {
  return blocks[key];
}

function HtmlBlock({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function HeroSection({ blocks }: { blocks: CmsBlocks }) {
  const title = getBlock('hero.title', blocks);
  const subtitle = getBlock('hero.subtitle', blocks);
  const cta = getBlock('hero.cta', blocks);
  const background = getBlock('hero.background', blocks);

  return (
    <section
      className="relative flex flex-col items-center justify-center gap-6 py-24 px-6 text-center min-h-[500px] bg-cover bg-center"
      style={
        background?.body
          ? { backgroundImage: `linear-gradient(rgba(4,9,20,0.85), rgba(4,9,20,0.85)), url(${background.body})` }
          : { background: 'linear-gradient(135deg, #0a0a2e, #1a1a4e)' }
      }
    >
      <h1 className="text-4xl font-bold text-white max-w-2xl">
        {title?.body ?? 'Bienvenido a Bopacorp'}
      </h1>
      {subtitle?.body && (
        <p className="text-lg text-white/70 max-w-xl">{subtitle.body}</p>
      )}
      {cta?.body && (
        <button className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold">
          {cta.body}
        </button>
      )}
    </section>
  );
}

function FeaturesSection({ blocks }: { blocks: CmsBlocks }) {
  const section = getSection('features', blocks);
  const title = getBlock('features.title', blocks);
  const subtitle = getBlock('features.subtitle', blocks);
  const items = section.filter((b) => b.contentKey.startsWith('features.item.'));

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold text-foreground">
          {title?.body ?? 'Ningun mensaje recibido'}
        </h2>
        {subtitle?.body && (
          <p className="text-muted-foreground">{subtitle.body}</p>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="p-6 flex flex-col gap-3">
            {item.body && <HtmlBlock html={item.body} />}
          </Card>
        ))}
      </div>
    </section>
  );
}

function BannerSection({ blocks }: { blocks: CmsBlocks }) {
  const banner = getBlock('banner.promo', blocks);
  if (!banner?.body) return null;

  return (
    <section className="py-12 px-6 max-w-5xl mx-auto">
      <HtmlBlock html={banner.body} />
    </section>
  );
}

function VideoSection({ blocks }: { blocks: CmsBlocks }) {
  const video = getBlock('video.intro', blocks);
  if (!video?.body) return null;

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-foreground text-center">Video</h2>
      <div className="rounded-lg overflow-hidden border border-border">
        <HtmlBlock html={video.body} />
      </div>
    </section>
  );
}

function CtaSection({ blocks }: { blocks: CmsBlocks }) {
  const title = getBlock('cta.title', blocks);
  const button = getBlock('cta.button', blocks);

  return (
    <section className="py-20 px-6 text-center flex flex-col gap-6 bg-muted/30">
      <h2 className="text-3xl font-bold text-foreground">
        {title?.body ?? 'Impulsa tu negocio'}
      </h2>
      {button?.body && (
        <button className="mx-auto bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg">
          {button.body}
        </button>
      )}
    </section>
  );
}

function FooterSection({ blocks }: { blocks: CmsBlocks }) {
  const text = getBlock('footer.text', blocks);
  const links = getBlock('footer.links', blocks);

  return (
    <footer className="py-10 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">
          {text?.body ?? '2026 BOPACORP S.A.'}
        </span>
        {links?.body && <HtmlBlock html={links.body} />}
      </div>
    </footer>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Skeleton className="h-[500px] w-full rounded-none" />
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
        <div className="flex flex-col gap-2 items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center py-20">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Error al cargar el contenido</EmptyTitle>
          <EmptyDescription>{message}</EmptyDescription>
        </EmptyHeader>
        <Button onClick={onRetry}>Reintentar</Button>
      </Empty>
    </div>
  );
}

export default function CmsDemoPage() {
  const [blocks, setBlocks] = useState<CmsBlocks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/v1/cms/landing')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ success: boolean; data: CmsLandingResponse }>;
      })
      .then((json) => {
        if (cancelled) return;
        setBlocks(json.data.blocks);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((n) => n + 1);
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!blocks || Object.keys(blocks).length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Sin contenido</EmptyTitle>
            <EmptyDescription>
              No hay bloques CMS publicados. Ejecuta el script de seed para poblarlos.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background">
      <HeroSection blocks={blocks} />
      <FeaturesSection blocks={blocks} />
      <BannerSection blocks={blocks} />
      <VideoSection blocks={blocks} />
      <CtaSection blocks={blocks} />
      <FooterSection blocks={blocks} />
    </div>
  );
}
