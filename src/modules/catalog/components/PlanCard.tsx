import type { PublicCatalogItemResponse } from '@bopacorp/shared';
import {
  Cloud,
  CreditCard,
  Globe,
  HardDrive,
  MessageCircle,
  Phone,
  Plane,
  Share2,
  Smartphone,
  Timer,
  Wifi,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useContactDialog } from '@/modules/contact/index.js';

const WHATSAPP_NUMBER = '593912345678';

const HEADER_CLASSES = [
  'bg-plan-1 text-white',
  'bg-plan-2 text-white',
  'bg-plan-3 text-white',
  'bg-plan-4 text-white',
  'bg-plan-5 text-white',
];

interface PlanCardProps {
  item: PublicCatalogItemResponse;
  index: number;
}

export function PlanCard({ item, index }: PlanCardProps) {
  const { openContactDialog } = useContactDialog();
  const headerClass = HEADER_CLASSES[index % HEADER_CLASSES.length] ?? HEADER_CLASSES[0];
  const highlight = buildHighlight(item);
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
        {highlight && (
          <div className="flex items-center gap-3 rounded-xl bg-muted/60 px-4 py-3.5">
            <highlight.icon className="size-5 text-primary" />
            <div className="flex flex-col">
              <span className="font-brand text-2xl font-bold leading-none text-foreground tabular-nums">
                {highlight.value}
              </span>
              {highlight.subtitle && (
                <span className="text-xs font-medium text-muted-foreground">
                  {highlight.subtitle}
                </span>
              )}
            </div>
          </div>
        )}

        {benefits.length > 0 && (
          <ul className="flex flex-col gap-3.5">
            {benefits.map((benefit) => (
              <li key={benefit.key} className="flex items-start gap-3">
                <benefit.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.label}
                </span>
              </li>
            ))}
          </ul>
        )}

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

interface Highlight {
  icon: typeof Globe;
  value: string;
  subtitle: string | null;
}

function buildHighlight(item: PublicCatalogItemResponse): Highlight | null {
  if (item.voiceDetails) {
    const totalGigas = item.voiceDetails.gigasStructural + item.voiceDetails.gigasLoyalty;
    return { icon: Smartphone, value: `${totalGigas}GB`, subtitle: 'para navegar' };
  }
  if (item.connectivityDetails) {
    return {
      icon: Wifi,
      value: `${item.connectivityDetails.bandwidthMbps} Mbps`,
      subtitle: 'simétricos',
    };
  }
  if (item.digitalDetails) {
    return { icon: Cloud, value: item.digitalDetails.provider, subtitle: 'servicio digital' };
  }
  if (item.roamingDetails) {
    return {
      icon: Plane,
      value: `${item.roamingDetails.dataMb}MB`,
      subtitle: `${item.roamingDetails.durationDays} días`,
    };
  }
  if (item.deviceDetails) {
    const d = item.deviceDetails;
    return {
      icon: Smartphone,
      value: `${d.brand} ${d.model}`,
      subtitle: d.storageGb ? `${d.storageGb}GB` : null,
    };
  }
  return null;
}

interface BenefitEntry {
  key: string;
  label: string;
  icon: typeof Globe;
}

function buildBenefits(item: PublicCatalogItemResponse): BenefitEntry[] {
  const entries: BenefitEntry[] = [];

  if (item.voiceDetails) {
    const voice = item.voiceDetails;
    if (voice.hasUnlimitedWhatsapp) {
      entries.push({ key: 'whatsapp', label: 'WhatsApp ilimitado', icon: MessageCircle });
    }
    if (voice.hasSocialNetworks) {
      entries.push({ key: 'social', label: 'Redes sociales ilimitadas', icon: Share2 });
    }
    if (voice.hasUnlimitedMinutes) {
      entries.push({ key: 'minutes', label: 'Minutos ilimitados a todo destino', icon: Phone });
    } else if (voice.minutesNational !== null) {
      entries.push({
        key: 'minutes',
        label: `${voice.minutesNational} minutos a todo destino`,
        icon: Phone,
      });
    }
    if (voice.minutesLdi > 0) {
      entries.push({ key: 'ldi', label: `${voice.minutesLdi} minutos LDI mundo`, icon: Globe });
    }
    if (voice.includedRoamingGb > 0) {
      entries.push({
        key: 'roaming',
        label: `${voice.includedRoamingGb}GB de roaming incluido`,
        icon: Plane,
      });
    }
  }

  if (item.connectivityDetails) {
    entries.push({
      key: 'bandwidth',
      label: `Internet dedicado ${item.connectivityDetails.bandwidthMbps} Mbps`,
      icon: Wifi,
    });
  }

  if (item.digitalDetails) {
    entries.push({
      key: 'provider',
      label: `Proveedor: ${item.digitalDetails.provider}`,
      icon: Cloud,
    });
  }

  if (item.roamingDetails) {
    const r = item.roamingDetails;
    entries.push({ key: 'roaming-data', label: `${r.dataMb}MB de datos`, icon: Globe });
    entries.push({ key: 'roaming-days', label: `Vigencia: ${r.durationDays} días`, icon: Timer });
    if (r.hasThrottle) {
      entries.push({ key: 'throttle', label: 'Velocidad reducida al agotar datos', icon: Wifi });
    }
  }

  if (item.deviceDetails) {
    const d = item.deviceDetails;
    entries.push({ key: 'device-model', label: `${d.brand} ${d.model}`, icon: Smartphone });
    if (d.storageGb) {
      entries.push({
        key: 'storage',
        label: `${d.storageGb}GB de almacenamiento`,
        icon: HardDrive,
      });
    }
    if (d.financingMonths && d.financingMonthly) {
      entries.push({
        key: 'financing',
        label: `${d.financingMonths} cuotas de $${formatPrice(d.financingMonthly)}`,
        icon: CreditCard,
      });
    }
  }

  for (const b of item.benefits) {
    entries.push({ key: `benefit-${b.id}`, label: b.name, icon: Globe });
  }

  return entries;
}

function formatPrice(price: number): string {
  return price.toFixed(2);
}

function buildWhatsappUrl(item: PublicCatalogItemResponse): string {
  const message = `Hola, estoy interesado en el servicio ${item.name} ($${formatPrice(item.price)}/mes). Quisiera más información.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
