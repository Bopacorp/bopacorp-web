import { Mail, MapPin, Phone } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import logoFallback from '@/assets/logo.png';
import { CMS_IMAGE_KEYS } from '@/modules/cms/cms-image-blocks.js';
import { ContactDialogProvider, useContactDialog } from '@/modules/contact/index.js';
import { useCmsLanding } from '@/modules/landing/hooks/use-cms-landing.js';
import { ModeToggle } from '@/shared/ui/ModeToggle';

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
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'text-foreground border-b-2 border-primary py-2 px-1'
                    : 'text-muted-foreground hover:text-foreground transition-colors py-2 px-1'
                }
              >
                Inicio
              </NavLink>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  isActive
                    ? 'text-foreground border-b-2 border-primary py-2 px-1'
                    : 'text-muted-foreground hover:text-foreground transition-colors py-2 px-1'
                }
              >
                Servicios
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? 'text-foreground border-b-2 border-primary py-2 px-1'
                    : 'text-muted-foreground hover:text-foreground transition-colors py-2 px-1'
                }
              >
                Nosotros
              </NavLink>
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  isActive
                    ? 'text-foreground border-b-2 border-primary py-2 px-1'
                    : 'text-muted-foreground hover:text-foreground transition-colors py-2 px-1'
                }
              >
                Trabaja con nosotros
              </NavLink>
            </nav>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <button
                type="button"
                onClick={() => openContactDialog()}
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Cotizar Servicios
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full overflow-hidden pt-20">
        <Outlet />
      </main>

      <footer className="w-full text-hero-foreground pt-16 pb-12 px-6 bg-background relative z-10 border-t border-hero -mt-px">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 w-full relative z-10">
          <div className="md:col-span-5 flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-1 w-full">
              <span className="text-2xl font-semibold text-foreground tracking-tight">
                BOHORQUEZ & PAUTA CORP.
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Distribuidor Oficial Tigo
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm w-full font-normal">
              Conectando el futuro de tu empresa. Soluciones de telecomunicaciones corporativas
              integrales en Ecuador desde 2019.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-col gap-4 w-full">
            <h4 className="text-sm font-semibold text-foreground w-full">SERVICIOS</h4>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col gap-3 w-full">
                <a
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-normal w-full"
                >
                  Conectividad Empresarial
                </a>
                <a
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-normal w-full"
                >
                  Planes Corporativos Tigo
                </a>
                <a
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-normal w-full"
                >
                  Equipos y Soluciones de Voz
                </a>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-4 w-full">
            <h4 className="text-sm font-semibold text-foreground w-full">CONTACTO</h4>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-normal w-full">
                <MapPin className="size-4 shrink-0 text-muted-foreground" /> Edificio Elite, Piso 3,
                Of. 308, Guayaquil
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-normal w-full">
                <Phone className="size-4 shrink-0 text-muted-foreground" /> 0991423895
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-normal w-full">
                <Mail className="size-4 shrink-0 text-muted-foreground" /> ch.pauta@bopacorp.com /
                j.bohorquez@bopacorp.com
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 border-t border-border">
          <span className="text-xs text-muted-foreground font-normal">
            © 2026 BOPACORP S.A. Todos los derechos reservados.
          </span>
          <div className="flex items-center gap-6">
            <a
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-normal"
            >
              Términos y Condiciones
            </a>
            <a
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-normal"
            >
              Políticas de Privacidad
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
