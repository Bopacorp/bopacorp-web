import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPublicVacancy } from '@/test/fixtures/employability-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';

const employabilityMocks = vi.hoisted(() => ({ usePublicJobVacancy: vi.fn() }));

vi.mock('@/modules/employability', async () => {
  const actual =
    await vi.importActual<typeof import('@/modules/employability')>('@/modules/employability');
  return { ...actual, usePublicJobVacancy: employabilityMocks.usePublicJobVacancy };
});

import JobDetailPage from './JobDetailPage.js';

function renderPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/empleos/:id" element={<JobDetailPage />} />
    </Routes>,
    { route: '/empleos/vacancy-1', withAuth: false },
  );
}

beforeEach(() => {
  employabilityMocks.usePublicJobVacancy.mockReset();
});

describe('JobDetailPage', () => {
  it('renders a valid vacancy and preserves the return link', () => {
    employabilityMocks.usePublicJobVacancy.mockReturnValue({
      vacancy: createPublicVacancy(),
      loading: false,
      error: null,
      retry: vi.fn(),
    });
    renderPage();

    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(
      screen.getByText('Construye experiencias web para clientes empresariales.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('React, TypeScript y experiencia con pruebas frontend.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver a vacantes/ })).toHaveAttribute(
      'href',
      '/empleos',
    );
  });

  it('shows a not-found error and retries', async () => {
    const retry = vi.fn();
    employabilityMocks.usePublicJobVacancy.mockReturnValue({
      vacancy: null,
      loading: false,
      error: { code: 'NOT_FOUND', message: 'Esta vacante ya no esta disponible.' },
      retry,
    });
    renderPage();

    expect(screen.getByText('No pudimos cargar la vacante')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('shows the unavailable state when no vacancy is returned', () => {
    employabilityMocks.usePublicJobVacancy.mockReturnValue({
      vacancy: null,
      loading: false,
      error: null,
      retry: vi.fn(),
    });
    renderPage();

    expect(screen.getByText('Esta vacante ya no esta disponible')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver vacantes disponibles' })).toHaveAttribute(
      'href',
      '/empleos',
    );
  });
});
