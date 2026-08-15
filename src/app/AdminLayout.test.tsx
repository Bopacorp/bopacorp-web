import { waitFor } from '@testing-library/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminLayout from '@/app/AdminLayout.js';
import i18n from '@/i18n/index.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';

const authMocks = vi.hoisted(() => ({
  user: {
    username: 'admin',
    email: 'admin@bopacorp.com',
    profile: { firstName: 'Ana', lastName: 'Pérez' },
  },
  logout: vi.fn(),
}));
const landingMocks = vi.hoisted(() => ({ blocks: null }));
const themeMocks = vi.hoisted(() => ({ theme: 'system', setTheme: vi.fn() }));

vi.mock('@/modules/auth/context/AuthContext.js', () => ({
  useAuth: () => authMocks,
}));

vi.mock('@/modules/landing/hooks/use-cms-landing.js', () => ({
  useCmsLanding: () => ({ blocks: landingMocks.blocks }),
}));

vi.mock('next-themes', () => ({
  useTheme: () => themeMocks,
}));

function LocationMarker() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderLayout(route = '/admin/cms') {
  return renderWithProviders(
    <Routes>
      <Route path="*" element={<AdminLayout />}>
        <Route path="*" element={<LocationMarker />} />
      </Route>
    </Routes>,
    { route, withAuth: false },
  );
}

describe('AdminLayout', () => {
  beforeEach(async () => {
    landingMocks.blocks = null;
    themeMocks.theme = 'system';
    themeMocks.setTheme.mockReset();
    authMocks.logout.mockReset().mockResolvedValue(undefined);
    await i18n.changeLanguage('es');
  });

  it('renders the site link and toggles the interface language', async () => {
    renderLayout();
    const user = userEvent.setup();

    expect(screen.getByRole('link', { name: 'Ver sitio' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Ver sitio' })).toHaveAttribute('target', '_blank');
    await user.click(screen.getByRole('button', { name: /es/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /en/i })).toBeInTheDocument());
    expect(localStorage.getItem('lang')).toBe('en');
  });

  it('changes theme from the profile menu', async () => {
    renderLayout();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /Ana Pérez/ }));
    await user.click(screen.getByRole('menuitem', { name: 'Oscuro' }));

    expect(themeMocks.setTheme).toHaveBeenCalledWith('dark');
  });

  it('logs out and navigates to the login route', async () => {
    renderLayout();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /Ana Pérez/ }));
    await user.click(screen.getByRole('menuitem', { name: 'Cerrar sesión' }));

    await waitFor(() => expect(authMocks.logout).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login'));
  });
});
