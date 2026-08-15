import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '@/App.js';
import { renderWithProviders, screen } from '@/test/test-utils.js';

vi.mock('@/app/MainLayout.js', () => ({
  default: () => (
    <div data-testid="main-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock('@/app/AdminLayout.js', () => ({
  default: () => (
    <div data-testid="admin-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock('@/components/ScrollToTop.js', () => ({ ScrollToTop: () => null }));

vi.mock('@/modules/auth/components/RequireAuth.js', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/modules/auth/components/RequireAdminRole.js', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/modules/admin/components/PermissionRoute.js', () => ({
  PermissionRoute: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/modules/auth/pages/LoginPage.js', () => ({
  default: () => <span>login-page</span>,
}));

vi.mock('@/modules/cms/CmsAdminPage.js', () => ({
  CmsPage: () => <span>cms-page</span>,
}));

vi.mock('@/modules/landing/pages/LandingPage', () => ({
  default: () => <span>landing-page</span>,
}));

vi.mock('@/modules/landing/pages/ServicesPage', () => ({
  default: () => <span>services-page</span>,
}));

vi.mock('@/modules/landing/pages/AboutPage', () => ({
  default: () => <span>about-page</span>,
}));

vi.mock('@/modules/landing/pages/JobsPage', () => ({
  default: () => <span>jobs-page</span>,
}));

vi.mock('@/modules/landing/pages/JobDetailPage', () => ({
  default: () => <span>job-detail-page</span>,
}));

vi.mock('@/modules/landing/pages/TermsPage.js', () => ({
  default: () => <span>terms-page</span>,
}));

vi.mock('@/modules/landing/pages/PrivacyPage.js', () => ({
  default: () => <span>privacy-page</span>,
}));

describe('App routes', () => {
  it.each([
    ['/', 'landing-page'],
    ['/servicios', 'services-page'],
    ['/nosotros', 'about-page'],
    ['/empleos', 'jobs-page'],
    ['/empleos/vacancy-1', 'job-detail-page'],
    ['/terminos', 'terms-page'],
    ['/privacidad', 'privacy-page'],
    ['/login', 'login-page'],
  ])('renders the expected page for %s', (route, marker) => {
    renderWithProviders(<App />, { route, withAuth: false });

    expect(screen.getByText(marker)).toBeInTheDocument();
  });

  it('redirects an unknown public route to the landing page', async () => {
    renderWithProviders(<App />, { route: '/unknown', withAuth: false });

    expect(await screen.findByText('landing-page')).toBeInTheDocument();
  });

  it('redirects an unknown admin route to CMS', async () => {
    renderWithProviders(<App />, { route: '/admin/unknown', withAuth: false });

    expect(await screen.findByText('cms-page')).toBeInTheDocument();
  });
});
