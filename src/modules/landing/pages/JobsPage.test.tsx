import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createPublicVacancy,
  createVacancyListItem,
  createVacancyMeta,
} from '@/test/fixtures/employability-fixtures.js';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/test-utils.js';

const employabilityMocks = vi.hoisted(() => ({
  usePublishedVacancies: vi.fn(),
  usePublicJobVacancy: vi.fn(),
}));

vi.mock('@/modules/employability', async () => {
  const actual =
    await vi.importActual<typeof import('@/modules/employability')>('@/modules/employability');
  return {
    ...actual,
    usePublishedVacancies: employabilityMocks.usePublishedVacancies,
    usePublicJobVacancy: employabilityMocks.usePublicJobVacancy,
  };
});

import JobsPage from './JobsPage.js';

function renderPage() {
  return renderWithProviders(<JobsPage />, { route: '/empleos', withAuth: false });
}

beforeEach(() => {
  employabilityMocks.usePublishedVacancies.mockReset();
  employabilityMocks.usePublicJobVacancy.mockReset();
  employabilityMocks.usePublicJobVacancy.mockImplementation((id: string | null) => ({
    vacancy: id ? createPublicVacancy({ id }) : null,
    loading: false,
    error: null,
    retry: vi.fn(),
  }));
});

describe('JobsPage', () => {
  it('shows the initial loading skeleton', () => {
    employabilityMocks.usePublishedVacancies.mockReturnValue({
      vacancies: [],
      meta: null,
      loading: true,
      error: null,
      retry: vi.fn(),
    });
    renderPage();

    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });

  it('shows the empty state when there are no published vacancies', () => {
    employabilityMocks.usePublishedVacancies.mockReturnValue({
      vacancies: [],
      meta: createVacancyMeta({ totalItems: 0, totalPages: 0 }),
      loading: false,
      error: null,
      retry: vi.fn(),
    });
    renderPage();

    expect(screen.getByText('No hay vacantes publicadas')).toBeInTheDocument();
  });

  it('shows the error state and retries the list', async () => {
    const retry = vi.fn();
    employabilityMocks.usePublishedVacancies.mockReturnValue({
      vacancies: [],
      meta: null,
      loading: false,
      error: { code: 'NOT_FOUND', message: 'Vacancies unavailable' },
      retry,
    });
    renderPage();

    expect(screen.getByText('Error al cargar el contenido')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('renders vacancies, metadata, selection, and page navigation', async () => {
    const vacancy = createVacancyListItem();
    employabilityMocks.usePublishedVacancies.mockReturnValue({
      vacancies: [vacancy],
      meta: createVacancyMeta({ totalItems: 11, totalPages: 2 }),
      loading: false,
      error: null,
      retry: vi.fn(),
    });
    renderPage();

    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Mostrando 1 de 11')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cargar más vacantes' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Frontend Developer/ }));
    await waitFor(() =>
      expect(employabilityMocks.usePublicJobVacancy).toHaveBeenLastCalledWith('vacancy-1'),
    );
    expect(
      screen.getByText('Construye experiencias web para clientes empresariales.'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cargar más vacantes' }));
    await waitFor(() =>
      expect(employabilityMocks.usePublishedVacancies).toHaveBeenLastCalledWith({
        page: 2,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    );
  });

  it('disables a closed vacancy and prevents selecting it', async () => {
    const vacancy = createVacancyListItem({ closingDate: '2020-01-01T00:00:00.000Z' });
    employabilityMocks.usePublishedVacancies.mockReturnValue({
      vacancies: [vacancy],
      meta: createVacancyMeta(),
      loading: false,
      error: null,
      retry: vi.fn(),
    });
    renderPage();

    const card = screen.getByRole('button', { name: /Frontend Developer/ });
    expect(card).toBeDisabled();
    await userEvent.click(card);
    expect(employabilityMocks.usePublicJobVacancy).toHaveBeenLastCalledWith(null);
  });
});
