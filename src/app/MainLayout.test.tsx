import { waitFor } from '@testing-library/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MainLayout from '@/app/MainLayout.js';
import i18n from '@/i18n/index.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';

const landingMocks = vi.hoisted(() => ({ blocks: null }));
const themeMocks = vi.hoisted(() => ({ theme: 'system', setTheme: vi.fn() }));

vi.mock('@/modules/landing/hooks/use-cms-landing.js', () => ({
  useCmsLanding: () => ({
    blocks: landingMocks.blocks,
    loading: false,
    error: null,
    retry: vi.fn(),
  }),
}));

vi.mock('next-themes', () => ({
  useTheme: () => themeMocks,
}));

function LocationMarker() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderLayout(route = '/') {
  return renderWithProviders(
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="*" element={<LocationMarker />} />
      </Route>
    </Routes>,
    { route, withAuth: false },
  );
}

describe('MainLayout', () => {
  beforeEach(async () => {
    landingMocks.blocks = null;
    themeMocks.theme = 'system';
    themeMocks.setTheme.mockReset();
    await i18n.changeLanguage('es');
  });

  it('exposes navigation, contact actions, and labeled controls', () => {
    renderLayout();

    expect(screen.getByAltText('Logo Bopacorp')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Servicios' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Cotizar Servicios' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Menú' })).toBeInTheDocument();
  });

  it('opens the mobile menu and navigates through its links', async () => {
    renderLayout();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Menú' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const serviceLinks = screen.getAllByRole('link', { name: 'Servicios' });
    await user.click(serviceLinks[serviceLinks.length - 1]);

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/servicios'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the contact dialog with an accessible title', async () => {
    renderLayout();

    await userEvent.click(screen.getAllByRole('button', { name: 'Cotizar Servicios' })[0]);

    expect(await screen.findByRole('dialog', { name: 'Solicitar Cotizacion' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
  });
});
