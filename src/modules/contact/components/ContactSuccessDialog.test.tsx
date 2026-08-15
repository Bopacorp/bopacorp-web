import { describe, expect, it, vi } from 'vitest';
import { createContactResponse } from '@/test/fixtures/catalog-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';
import { ContactSuccessDialog } from './ContactSuccessDialog.js';

describe('ContactSuccessDialog', () => {
  it('shows the submitted contact details and closes on confirmation', async () => {
    const onOpenChange = vi.fn();
    renderWithProviders(
      <ContactSuccessDialog open onOpenChange={onOpenChange} response={createContactResponse()} />,
      { withAuth: false },
    );

    expect(screen.getByRole('heading', { name: 'Solicitud enviada' })).toBeInTheDocument();
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('ana@empresa.com')).toBeInTheDocument();
    expect(screen.getByText(/Enviada:/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Entendido' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
