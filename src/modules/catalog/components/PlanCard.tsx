import { Globe, MessageCircle, Phone, Plane, Share2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useContactDialog } from '@/modules/contact/index.js';
import type { PublicCatalogItem } from '../catalog.types.js';

const WHATSAPP_NUMBER = '59399999999';

const HEADER_CLASSES = [
  'bg-plan-1 text-white',
  'bg-plan-2 text-white',
  'bg-plan-3 text-white',
  'bg-plan-4 text-white',
  'bg-plan-5 text-white',
];

interface PlanCardProps {
  item: PublicCatalogItem;
  index: number;
}

export function PlanCard({ item, index }: PlanCardProps) {
  const { openContactDialog } = useContactDialog();
  const headerClass = HEADER_CLASSES[index % HEADER_CLASSES.length] ?? HEADER_CLASSES[0];
  const totalGigas = item.voiceDetails
    ? item.voiceDetails.gigasStructural + item.voiceDetails.gigasLoyalty
    : null;
  const benefits = buildBenefits(item);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg">
      <header className={cn('flex flex-col gap-2 px-6 py-7', headerClass)}>
        <h3 className="font-brand text-xl font-semibold tracking-tight">{item.name}</h3>
        <div className="flex items-baseline gap-1.5">
          <span className="font-brand text-4xl font-bold tracking-tight tabular-nums">
            ${formatPrice(item.price)}
          </span>
          <span className="text-sm font-medium opacity-80">/mes + IVA</span>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-6 py-6">
        {totalGigas !== null && (
          <div className="flex items-center gap-3 rounded-xl bg-muted/60 px-4 py-3.5">
            <Smartphone className="size-5 text-primary" />
            <div className="flex flex-col">
              <span className="font-brand text-2xl font-bold leading-none text-foreground tabular-nums">
                {totalGigas}GB
              </span>
              <span className="text-xs font-medium text-muted-foreground">para navegar</span>
            </div>
          </div>
        )}

        <ul className="flex flex-col gap-3.5">
          {benefits.map((benefit) => (
            <li key={benefit.key} className="flex items-start gap-3">
              <benefit.icon className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="text-sm leading-relaxed text-muted-foreground">{benefit.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-2.5 pt-2">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 w-full rounded-md px-5 text-sm font-semibold"
          >
            <a
              href={buildWhatsappUrl(item)}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <MessageCircle className="size-4" />
              Contáctanos por WhatsApp
            </a>
          </Button>
          <Button
            size="lg"
            className="h-11 w-full rounded-md px-5 text-sm font-semibold"
            onClick={() => openContactDialog(item.id)}
          >
            Solicitar llamada
          </Button>
        </div>
      </div>
    </article>
  );
}

interface BenefitEntry {
  key: string;
  label: string;
  icon: typeof Globe;
}

function buildBenefits(item: PublicCatalogItem): BenefitEntry[] {
  const voice = item.voiceDetails;
  if (!voice) return [];
  const entries: BenefitEntry[] = [];

  if (voice.hasUnlimitedWhatsapp) {
    entries.push({
      key: 'whatsapp',
      label: 'WhatsApp ilimitado',
      icon: MessageCircle,
    });
  }

  if (voice.hasSocialNetworks) {
    entries.push({
      key: 'social',
      label: 'Redes sociales ilimitadas',
      icon: Share2,
    });
  }

  if (voice.hasUnlimitedMinutes) {
    entries.push({
      key: 'minutes',
      label: 'Minutos ilimitados a todo destino',
      icon: Phone,
    });
  } else if (voice.minutesNational !== null) {
    entries.push({
      key: 'minutes',
      label: `${voice.minutesNational} minutos a todo destino`,
      icon: Phone,
    });
  }

  if (voice.minutesLdi > 0) {
    entries.push({
      key: 'ldi',
      label: `${voice.minutesLdi} minutos LDI mundo`,
      icon: Globe,
    });
  }

  if (voice.includedRoamingGb > 0) {
    entries.push({
      key: 'roaming',
      label: `${voice.includedRoamingGb}GB de roaming incluido`,
      icon: Plane,
    });
  }

  return entries;
}

function formatPrice(price: number): string {
  return price.toFixed(2);
}

function buildWhatsappUrl(item: PublicCatalogItem): string {
  const message = `Hola, estoy interesado en el plan ${item.name} ($${formatPrice(item.price)}/mes). Quisiera más información.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
