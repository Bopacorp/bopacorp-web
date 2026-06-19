import { ChevronsUpDown, ExternalLink, LogOut, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logoFallback from '@/assets/logo.png';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/modules/auth/context/AuthContext.js';
import { CMS_IMAGE_KEYS } from '@/modules/cms/cms-image-blocks.js';
import { useCmsLanding } from '@/modules/landing/hooks/use-cms-landing.js';

function getInitials(profile: { firstName: string; lastName: string } | null | undefined): string {
  if (!profile) return '??';
  return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
}

function ThemeMenuItems() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem onClick={() => setTheme('light')}>
        <Sun />
        Claro
        {theme === 'light' && <span className="ml-auto text-xs text-muted-foreground">✓</span>}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')}>
        <Moon />
        Oscuro
        {theme === 'dark' && <span className="ml-auto text-xs text-muted-foreground">✓</span>}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')}>
        <Monitor />
        Sistema
        {theme === 'system' && <span className="ml-auto text-xs text-muted-foreground">✓</span>}
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { blocks } = useCmsLanding();
  const logoUrl = blocks?.[CMS_IMAGE_KEYS.logo]?.body ?? logoFallback;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-14 items-center gap-3 border-b border-border px-4">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Logo Bopacorp" className="size-8 object-contain rounded-lg" />
          <div className="flex flex-col">
            <span className="font-extrabold text-foreground tracking-tight leading-none text-base">
              BOPACORP
            </span>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-0.5 leading-none">
              CMS
            </span>
          </div>
        </div>

        <div className="flex-1" />

        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground">
          <Link to="/">
            <ExternalLink className="size-3.5" />
            <span className="hidden sm:inline">Ver sitio</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent transition-colors"
            >
              <Avatar className="size-7 shrink-0">
                <AvatarFallback className="text-xs">{getInitials(user?.profile)}</AvatarFallback>
              </Avatar>
              <span className="hidden truncate font-medium sm:inline">
                {user?.profile
                  ? `${user.profile.firstName} ${user.profile.lastName}`
                  : user?.username}
              </span>
              <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  {user?.profile
                    ? `${user.profile.firstName} ${user.profile.lastName}`
                    : user?.username}
                </span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ThemeMenuItems />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="grain flex-1 overflow-x-hidden p-6 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}
