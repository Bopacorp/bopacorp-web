import { Briefcase } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from '@/shared/ui/empty-state.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';

describe('EmptyState', () => {
  it('renders title, description, icon, and action', async () => {
    const onClick = vi.fn();
    const { container } = renderWithProviders(
      <EmptyState
        title="No hay vacantes"
        description="Regresa más tarde para revisar nuevas oportunidades."
        icon={Briefcase}
        action={{ label: 'Actualizar', onClick }}
      />,
      { withAuth: false },
    );

    expect(screen.getByText('No hay vacantes')).toBeInTheDocument();
    expect(
      screen.getByText('Regresa más tarde para revisar nuevas oportunidades.'),
    ).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('omits optional content when it is not provided', () => {
    const { container } = renderWithProviders(<EmptyState title="Archivo vacío" />, {
      withAuth: false,
    });

    expect(screen.getByText('Archivo vacío')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
