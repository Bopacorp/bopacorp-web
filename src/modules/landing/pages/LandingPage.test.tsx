import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/test-utils.js';

const landingMocks = vi.hoisted(() => ({ useCmsLanding: vi.fn() }));
const contactMocks = vi.hoisted(() => ({ openContactDialog: vi.fn() }));

vi.mock('../hooks/use-cms-landing.js', () => landingMocks);
vi.mock('@/modules/contact/index.js', () => ({
  useContactDialog: () => contactMocks,
}));

import LandingPage from './LandingPage.js';

const maliciousBody = '<img src="x" onerror="alert(1)"><script>alert(2)</script>';

beforeEach(() => {
  landingMocks.useCmsLanding.mockReset();
  landingMocks.useCmsLanding.mockReturnValue({
    blocks: {
      'hero.description': { body: maliciousBody },
      'about.description': { body: maliciousBody },
    },
    loading: false,
    error: null,
    retry: vi.fn(),
  });
});

describe('LandingPage CMS content safety', () => {
  it('renders CMS text as escaped content instead of executable HTML', () => {
    const { container } = renderWithProviders(<LandingPage />, { withAuth: false });

    expect(screen.getAllByText(maliciousBody).length).toBeGreaterThan(0);
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.querySelector('[onerror]')).not.toBeInTheDocument();
  });
});
