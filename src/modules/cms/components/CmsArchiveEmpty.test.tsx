import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/test-utils.js';
import { CmsArchiveEmpty } from './CmsArchiveEmpty.js';

describe('CmsArchiveEmpty', () => {
  it('distinguishes an empty archive from an empty search result', () => {
    const { rerender } = renderWithProviders(<CmsArchiveEmpty />, { withAuth: false });
    expect(screen.getByText('El archivo está vacío')).toBeInTheDocument();

    rerender(<CmsArchiveEmpty searchQuery="missing" />);
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
    expect(screen.getByText('Ningún bloque coincide con tu búsqueda.')).toBeInTheDocument();
  });
});
