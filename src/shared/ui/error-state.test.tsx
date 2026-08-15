import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n/index.js';
import { ErrorState } from '@/shared/ui/error-state.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';

describe('ErrorState', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('translates known error codes before using a custom message', () => {
    renderWithProviders(<ErrorState code="NOT_FOUND" message="Mensaje del servidor" />, {
      withAuth: false,
    });

    expect(screen.getByText('El recurso solicitado no existe.')).toBeInTheDocument();
    expect(screen.queryByText('Mensaje del servidor')).not.toBeInTheDocument();
  });

  it('uses a custom message and falls back to the generic translation', () => {
    const { rerender } = renderWithProviders(
      <ErrorState message="No fue posible cargar los datos." />,
      { withAuth: false },
    );

    expect(screen.getByText('No fue posible cargar los datos.')).toBeInTheDocument();
    rerender(<ErrorState />);
    expect(
      screen.getByText('Ocurrió un error inesperado. Intenta de nuevo más tarde.'),
    ).toBeInTheDocument();
  });

  it('calls retry when the retry action is activated', async () => {
    const onRetry = vi.fn();
    renderWithProviders(<ErrorState onRetry={onRetry} />, { withAuth: false });

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
