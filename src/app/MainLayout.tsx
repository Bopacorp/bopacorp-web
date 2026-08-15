import { Mail, MapPin, Menu, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import logoFallback from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { CMS_IMAGE_KEYS } from '@/modules/cms/cms-image-blocks.js';
import { ContactDialogProvider, useContactDialog } from '@/modules/contact/index.js';
import { useCmsLanding } from '@/modules/landing/hooks/use-cms-landing.js';
import { ModeToggle } from '@/shared/ui/ModeToggle';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/empleos', label: 'Trabaja con nosotros' },
] as const;

export default function MainLayout() {
  return (
    <ContactDialogProvider>
      <MainLayoutInner />
    </ContactDialogProvider>
  );
}

function MainLayoutInner() {
  const { blocks } = useCmsLanding();
  const logoUrl = blocks?.[CMS_IMAGE_KEYS.logo]?.body ?? logoFallback;
  const phone = blocks?.['site.contact.phone']?.body ?? '0912345678';
  const email = blocks?.['site.contact.email']?.body ?? 'contacto@bopacorp.com';
  const address =
    blocks?.['site.contact.address']?.body ?? 'Edificio Elite, Piso 3, Of. 308, Guayaquil';
  const { openContactDialog } = useContactDialog();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isDarkFooter = !['/', '/servicios'].includes(location.pathname);

  const textHeading = isDarkFooter ? 'text-white' : 'text-foreground';
  const textMuted = isDarkFooter ? 'text-white/60' : 'text-muted-foreground';
  const textBody = isDarkFooter ? 'text-white/70' : 'text-muted-foreground';
  const textLink = isDarkFooter
    ? 'text-white/70 hover:text-white'
    : 'text-muted-foreground hover:text-foreground';
  const textAnchor = isDarkFooter ? 'hover:text-white' : 'hover:text-foreground';
  const borderDivider = isDarkFooter ? 'border-white/10' : 'border-border';
  const textCopyright = isDarkFooter ? 'text-white/50' : 'text-muted-foreground';
  const textBottomLink = isDarkFooter
    ? 'text-white/60 hover:text-white'
    : 'text-muted-foreground hover:text-foreground';
  const iconColor = isDarkFooter ? 'text-white/60' : 'text-muted-foreground';

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans overflow-x-hidden">
      <header className="w-full bg-background border-b border-border fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <img src={logoUrl} alt="Logo Bopacorp" className="size-10 object-contain rounded-lg" />
            <div className="flex flex-col">
              <span className="font-extrabold text-foreground tracking-tight leading-none text-lg">
                BOPACORP
              </span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-1 leading-none">
                Distribuidor Tigo
              </span>
            </div>
          </NavLink>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'py-2 px-1 transition-colors',
                      isActive
                        ? 'text-foreground border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => openContactDialog()}
                className="hidden sm:inline-flex"
              >
                <MessageCircle data-icon="inline-start" />
                Cotizar Servicios
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => openContactDialog()}
                className="sm:hidden"
                aria-label="Cotizar Servicios"
              >
                <MessageCircle />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
                className="md:hidden"
              >
                <Menu />
                <span className="sr-only">Menú</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 flex flex-col gap-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo Bopacorp" className="size-8 object-contain rounded-lg" />
              BOPACORP
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'text-base font-semibold py-3 px-4 rounded-lg transition-colors',
                    isActive
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <main className="flex-1 w-full overflow-hidden pt-20">
        <Outlet />
      </main>

      <footer
        className={cn(
          'w-full pt-16 pb-12 px-6 relative z-10 border-t -mt-px transition-colors duration-200',
          isDarkFooter
            ? 'bg-hero text-hero-foreground border-hero-mid'
            : 'bg-background text-foreground border-border',
        )}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 w-full relative z-10">
          <div className="md:col-span-5 flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-1 w-full">
              <span className={cn('text-2xl font-semibold tracking-tight', textHeading)}>
                BOHORQUEZ & PAUTA CORP.
              </span>
              <span className={cn('text-xs font-medium uppercase tracking-widest', textMuted)}>
                Distribuidor Oficial Tigo
              </span>
            </div>
            <p className={cn('text-sm leading-relaxed max-w-sm w-full font-normal', textBody)}>
              Conectando el futuro de tu empresa. Soluciones de telecomunicaciones corporativas
              integrales en Ecuador desde 2019.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-col gap-4 w-full">
            <h4 className={cn('text-sm font-semibold w-full', textHeading)}>SERVICIOS</h4>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col gap-3 w-full">
                <Link
                  to="/servicios?categoria=conectividad"
                  className={cn('text-sm transition-colors font-normal w-full', textLink)}
                >
                  Conectividad Empresarial
                </Link>
                <Link
                  to="/servicios?categoria=voz"
                  className={cn('text-sm transition-colors font-normal w-full', textLink)}
                >
                  Planes Corporativos Tigo
                </Link>
                <Link
                  to="/servicios?categoria=servicios-digitales"
                  className={cn('text-sm transition-colors font-normal w-full', textLink)}
                >
                  Servicios Digitales
                </Link>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-4 w-full">
            <h4 className={cn('text-sm font-semibold w-full', textHeading)}>CONTACTO</h4>
            <div className="flex flex-col gap-3 w-full">
              <div className={cn('flex items-center gap-2 text-sm font-normal w-full', textBody)}>
                <MapPin className={cn('size-4 shrink-0', iconColor)} /> {address}
              </div>
              <div className={cn('flex items-center gap-2 text-sm font-normal w-full', textBody)}>
                <Phone className={cn('size-4 shrink-0', iconColor)} />
                <a href={`tel:${phone}`} className={cn('transition-colors', textAnchor)}>
                  {phone}
                </a>
              </div>
              <div className={cn('flex items-start gap-2 text-sm font-normal w-full', textBody)}>
                <Mail className={cn('size-4 shrink-0 mt-0.5', iconColor)} />
                <div className="flex flex-col">
                  <a href={`mailto:${email}`} className={cn('transition-colors', textAnchor)}>
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'max-w-7xl mx-auto w-full mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 border-t',
            borderDivider,
          )}
        >
          <span className={cn('text-xs font-normal', textCopyright)}>
            © 2026 BOPACORP S.A. Todos los derechos reservados.
          </span>
          <div className="flex items-center gap-6">
            <Link
              to="/terminos"
              className={cn('text-xs transition-colors font-normal', textBottomLink)}
            >
              Términos y Condiciones
            </Link>
            <Link
              to="/privacidad"
              className={cn('text-xs transition-colors font-normal', textBottomLink)}
            >
              Políticas de Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
