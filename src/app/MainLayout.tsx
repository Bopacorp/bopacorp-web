import { Mail, MapPin, Menu, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
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
  { to: '/services', label: 'Servicios' },
  { to: '/about', label: 'Nosotros' },
  { to: '/jobs', label: 'Trabaja con nosotros' },
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
  const { openContactDialog } = useContactDialog();
  const [mobileOpen, setMobileOpen] = useState(false);

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

      <footer className="w-full text-hero-foreground pt-16 pb-12 px-6 bg-hero relative z-10 border-t border-hero-mid -mt-px">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 w-full relative z-10">
          <div className="md:col-span-5 flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-1 w-full">
              <span className="text-2xl font-semibold text-white tracking-tight">
                BOHORQUEZ & PAUTA CORP.
              </span>
              <span className="text-xs font-medium text-white/60 uppercase tracking-widest">
                Distribuidor Oficial Tigo
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm w-full font-normal">
              Conectando el futuro de tu empresa. Soluciones de telecomunicaciones corporativas
              integrales en Ecuador desde 2019.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-col gap-4 w-full">
            <h4 className="text-sm font-semibold text-white w-full">SERVICIOS</h4>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col gap-3 w-full">
                <Link
                  to="/services"
                  className="text-sm text-white/70 hover:text-white transition-colors font-normal w-full"
                >
                  Conectividad Empresarial
                </Link>
                <Link
                  to="/services"
                  className="text-sm text-white/70 hover:text-white transition-colors font-normal w-full"
                >
                  Planes Corporativos Tigo
                </Link>
                <Link
                  to="/services"
                  className="text-sm text-white/70 hover:text-white transition-colors font-normal w-full"
                >
                  Equipos y Soluciones de Voz
                </Link>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-4 w-full">
            <h4 className="text-sm font-semibold text-white w-full">CONTACTO</h4>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-2 text-sm text-white/70 font-normal w-full">
                <MapPin className="size-4 shrink-0 text-white/60" /> Edificio Elite, Piso 3, Of.
                308, Guayaquil
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70 font-normal w-full">
                <Phone className="size-4 shrink-0 text-white/60" />
                <a href="tel:0912345678" className="hover:text-white transition-colors">
                  0912345678
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-white/70 font-normal w-full">
                <Mail className="size-4 shrink-0 text-white/60 mt-0.5" />
                <div className="flex flex-col">
                  <a
                    href="mailto:contacto@bopacorp.com"
                    className="hover:text-white transition-colors"
                  >
                    contacto@bopacorp.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 border-t border-white/10">
          <span className="text-xs text-white/50 font-normal">
            © 2026 BOPACORP S.A. Todos los derechos reservados.
          </span>
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className="text-xs text-white/60 hover:text-white transition-colors font-normal"
            >
              Términos y Condiciones
            </Link>
            <Link
              to="/privacy"
              className="text-xs text-white/60 hover:text-white transition-colors font-normal"
            >
              Políticas de Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
