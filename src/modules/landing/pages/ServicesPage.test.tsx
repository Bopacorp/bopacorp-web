import { useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCatalogItem } from '@/test/fixtures/catalog-fixtures.js';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/test-utils.js';

const catalogMocks = vi.hoisted(() => ({
  usePublicCatalogItems: vi.fn(),
  usePublicCategories: vi.fn(),
  usePublicSegments: vi.fn(),
}));
const contactMocks = vi.hoisted(() => ({ openContactDialog: vi.fn() }));
const cmsMocks = vi.hoisted(() => ({ useCmsLanding: vi.fn() }));

vi.mock('@/modules/catalog/hooks/use-public-catalog-items.js', () => catalogMocks);
vi.mock('@/modules/catalog/hooks/use-public-categories.js', () => catalogMocks);
vi.mock('@/modules/catalog/hooks/use-public-segments.js', () => catalogMocks);
vi.mock('@/modules/contact/index.js', () => ({
  useContactDialog: () => contactMocks,
}));
vi.mock('@/modules/landing/hooks/use-cms-landing.js', () => cmsMocks);

import ServicesPage from './ServicesPage.js';

const categories = [
  { id: 'category-voice', name: 'Voz', slug: 'voz' },
  { id: 'category-connectivity', name: 'Conectividad', slug: 'conectividad' },
];
const segments = [{ id: 'segment-sme', code: 'SME', name: 'Pymes' }];

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="search">{location.search}</output>;
}

function setCatalogState(overrides: Record<string, unknown> = {}) {
  catalogMocks.usePublicCategories.mockReturnValue({ categories });
  catalogMocks.usePublicSegments.mockReturnValue({ segments });
  catalogMocks.usePublicCatalogItems.mockReturnValue({
    items: [createCatalogItem()],
    loading: false,
    reloading: false,
    error: null,
    retry: vi.fn(),
    ...overrides,
  });
}

beforeEach(() => {
  catalogMocks.usePublicCatalogItems.mockReset();
  catalogMocks.usePublicCategories.mockReset();
  catalogMocks.usePublicSegments.mockReset();
  contactMocks.openContactDialog.mockReset();
  cmsMocks.useCmsLanding.mockReturnValue({ blocks: null });
  setCatalogState();
});

describe('ServicesPage', () => {
  it('shows catalog skeleton while the initial request is loading', () => {
    setCatalogState({ items: [], loading: true });
    renderWithProviders(<ServicesPage />, { withAuth: false });

    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
    expect(screen.queryByText('No hay servicios disponibles')).not.toBeInTheDocument();
  });

  it('shows an error and retries the catalog request', async () => {
    const retry = vi.fn();
    setCatalogState({ items: [], error: 'Catalog failed', retry });
    renderWithProviders(<ServicesPage />, { withAuth: false });

    expect(screen.getByText('No se pudo cargar el catálogo')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('shows an empty state when the catalog has no items', () => {
    setCatalogState({ items: [] });
    renderWithProviders(<ServicesPage />, { withAuth: false });

    expect(screen.getByText('No hay servicios disponibles')).toBeInTheDocument();
    expect(
      screen.getByText(/En este momento no hay planes publicados para mostrar/),
    ).toBeInTheDocument();
  });

  it('updates filters, URL navigation, and debounced prices', async () => {
    renderWithProviders(
      <>
        <ServicesPage />
        <LocationProbe />
      </>,
      { route: '/servicios?categoria=voz', withAuth: false },
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('combobox', { name: 'Categoría' }));
    await user.click(screen.getByRole('option', { name: 'Conectividad' }));
    expect(screen.getByTestId('search')).toHaveTextContent('?categoria=conectividad');

    await user.click(screen.getByRole('combobox', { name: 'Segmento' }));
    await user.click(screen.getByRole('option', { name: 'Pymes' }));
    await user.type(screen.getByLabelText('Precio mín. ($)'), '0');

    await waitFor(
      () =>
        expect(catalogMocks.usePublicCatalogItems).toHaveBeenLastCalledWith({
          categoryId: 'category-connectivity',
          segmentId: 'segment-sme',
          minPrice: 0,
        }),
      { timeout: 2000 },
    );
  });

  it('clears active filters and renders the current catalog result', async () => {
    renderWithProviders(<ServicesPage />, { withAuth: false });
    const user = userEvent.setup();

    await user.click(screen.getByRole('combobox', { name: 'Segmento' }));
    await user.click(screen.getByRole('option', { name: 'Pymes' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Limpiar' })).toBeInTheDocument(),
    );
    await user.click(screen.getByRole('button', { name: 'Limpiar' }));

    await waitFor(() =>
      expect(catalogMocks.usePublicCatalogItems).toHaveBeenLastCalledWith({
        categoryId: 'category-voice',
      }),
    );
    expect(screen.getByRole('heading', { name: 'Plan Empresarial' })).toBeInTheDocument();
  });
});
