import { Mail, MapPin, Phone } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import logoBopacorp from '@/assets/logo.png';

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full bg-[#040914] flex flex-col font-sans overflow-x-hidden">
      <header className="w-full bg-background border-b border-border fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src={logoBopacorp}
              alt="Logo Bopacorp"
              className="size-10 object-contain rounded-lg"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-foreground tracking-tight leading-none text-lg">
                BOPACORP
              </span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-1 leading-none">
                Partner Movistar
              </span>
            </div>
          </div>
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
              <button
                type="button"
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

      <footer className="w-full text-white pt-16 pb-12 px-6 bg-[#040914] relative z-10 border-t border-[#06152b] -mt-px">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 w-full relative z-10">
          <div className="md:col-span-5 flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-1 w-full">
              <span className="text-2xl font-semibold text-white tracking-tight">BOPACORP</span>
              <span className="text-xs font-medium text-white/60 uppercase tracking-widest">
                Partner Movistar
              </span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm w-full font-normal">
              Bohorquez & Pauta Corp S.A. — Soluciones de telecomunicaciones corporativas en Ecuador
              desde 2019.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-col gap-4 w-full">
            <h4 className="text-sm font-semibold text-white/90 w-full">SERVICIOS</h4>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col gap-3 w-full">
                <a
                  href="/services"
                  className="text-sm text-white/80 hover:text-white transition-colors font-normal w-full"
                >
                  Conectividad Empresarial
                </a>
                <a
                  href="/services"
                  className="text-sm text-white/80 hover:text-white transition-colors font-normal w-full"
                >
                  Planes Corporativos
                </a>
                <a
                  href="/services"
                  className="text-sm text-white/80 hover:text-white transition-colors font-normal w-full"
                >
                  Servicios Digitales
                </a>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-4 w-full">
            <h4 className="text-sm font-semibold text-white/90 w-full">CONTACTO</h4>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-2 text-sm text-white/80 font-normal w-full">
                <MapPin className="size-4 shrink-0 text-white/60" /> Guayaquil
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80 font-normal w-full">
                <Phone className="size-4 shrink-0 text-white/60" /> +593 0 000 0000
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80 font-normal w-full">
                <Mail className="size-4 shrink-0 text-white/60" /> boopa@bopacorp.com
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 border-t border-white/10">
          <span className="text-xs text-white/50 font-normal">
            © 2026 BOPACORP S.A. Todos los derechos reservados.
          </span>
          <div className="flex items-center gap-6">
            <a
              href="/terms"
              className="text-xs text-white/50 hover:text-white transition-colors font-normal"
            >
              Términos y Condiciones
            </a>
            <a
              href="/privacy"
              className="text-xs text-white/50 hover:text-white transition-colors font-normal"
            >
              Políticas de Privacidad
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
