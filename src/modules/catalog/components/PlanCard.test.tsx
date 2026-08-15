import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createVoiceCatalogItem } from '@/test/fixtures/catalog-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';

const contactMocks = vi.hoisted(() => ({ openContactDialog: vi.fn() }));
const cmsMocks = vi.hoisted(() => ({
  useCmsLanding: vi.fn(),
}));

vi.mock('@/modules/contact/index.js', () => ({
  useContactDialog: () => contactMocks,
}));
vi.mock('@/modules/landing/hooks/use-cms-landing.js', () => cmsMocks);

import { PlanCard } from './PlanCard.js';

beforeEach(() => {
  contactMocks.openContactDialog.mockReset();
  cmsMocks.useCmsLanding.mockReturnValue({
    blocks: { 'site.contact.whatsapp': { body: '593999000111' } },
  });
});

describe('PlanCard', () => {
  it('renders plan details, benefits, WhatsApp contact, and quotation action', async () => {
    const item = createVoiceCatalogItem({ name: 'Plan Voz Pro', price: 79.5 });
    renderWithProviders(<PlanCard item={item} index={0} />, { withAuth: false });

    expect(screen.getByRole('heading', { name: 'Plan Voz Pro' })).toBeInTheDocument();
    expect(screen.getByText('$79.50')).toBeInTheDocument();
    expect(screen.getByText('16GB')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp ilimitado')).toBeInTheDocument();
    expect(screen.getByText('Redes sociales ilimitadas')).toBeInTheDocument();
    expect(screen.getByText('Atención prioritaria')).toBeInTheDocument();

    const whatsapp = screen.getByRole('link', { name: 'Contáctanos por WhatsApp' });
    const url = new URL(whatsapp.getAttribute('href') ?? '');
    expect(url.pathname).toBe('/593999000111');
    expect(url.searchParams.get('text')).toContain('Plan Voz Pro ($79.50/mes)');

    await userEvent.click(screen.getByRole('button', { name: 'Solicitar llamada' }));
    expect(contactMocks.openContactDialog).toHaveBeenCalledWith(item.id);
  });
});
