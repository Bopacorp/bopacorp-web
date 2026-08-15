import { describe, expect, it, vi } from 'vitest';
import { createApplyResponse } from '@/test/fixtures/employability-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';
import { ApplySuccessDialog } from './ApplySuccessDialog.js';

describe('ApplySuccessDialog', () => {
  it('shows vacancy, candidate, and submission date', async () => {
    const onOpenChange = vi.fn();
    renderWithProviders(
      <ApplySuccessDialog open onOpenChange={onOpenChange} response={createApplyResponse()} />,
      { withAuth: false },
    );

    expect(screen.getByRole('heading', { name: 'Postulacion enviada' })).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
    expect(screen.getByText(/Enviada:/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Entendido' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
