import { describe, expect, it } from 'vitest';
import { PageLoader } from '@/shared/ui/page-loader.js';
import { renderWithProviders, screen } from '@/test/test-utils.js';

describe('PageLoader', () => {
  it('renders the provided loading message without skeletons', () => {
    const { container } = renderWithProviders(<PageLoader message="Cargando contenido" />, {
      withAuth: false,
    });

    expect(screen.getByText('Cargando contenido')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(0);
  });

  it('renders the skeleton layout when no message is provided', () => {
    const { container } = renderWithProviders(<PageLoader />, { withAuth: false });

    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(5);
    expect(screen.queryByText('Cargando contenido')).not.toBeInTheDocument();
  });
});
