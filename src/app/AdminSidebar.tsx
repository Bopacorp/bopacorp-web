import { ChevronsUpDown, LogOut, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { allMenuItems } from '@/modules/admin/config/menu.js';
import { useAuth } from '@/modules/auth/context/AuthContext.js';
import { usePermission } from '@/modules/auth/hooks/usePermission.js';

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

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const { hasPermission } = usePermission();
  const isCollapsed = state === 'collapsed';

  const isActive = (id: string) => location.pathname.startsWith(`/admin/${id}`);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex flex-col">
              <span className="font-extrabold text-foreground tracking-tight leading-none text-lg">
                BOPACORP
              </span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-1 leading-none">
                Distribuidor Tigo
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-1">
            <Avatar className="size-8 rounded-md">
              <AvatarFallback className="rounded-md bg-primary text-primary-foreground font-bold">
                B
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allMenuItems
                .filter((item) => !item.permission || hasPermission(item.permission))
                .map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={isActive(item.id)} tooltip={item.title}>
                      <Link to={`/admin/${item.id}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" tooltip={user?.email ?? 'Usuario'}>
                  <Avatar className="size-7 shrink-0">
                    <AvatarFallback className="text-xs">
                      {getInitials(user?.profile)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col truncate">
                    <span className="truncate text-sm font-medium">
                      {user?.profile
                        ? `${user.profile.firstName} ${user.profile.lastName}`
                        : user?.username}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isCollapsed ? 'right' : 'top'}
                align="start"
                className="w-56"
              >
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
