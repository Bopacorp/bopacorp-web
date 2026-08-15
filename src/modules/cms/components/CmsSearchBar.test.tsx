import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';
import { CmsSearchBar } from './CmsSearchBar.js';

function renderSearch(value = '', onChange = vi.fn()) {
  const view = renderWithProviders(
    <CmsSearchBar value={value} onChange={onChange} resultCount={2} total={5} />,
    { withAuth: false },
  );
  return { ...view, onChange };
}

describe('CmsSearchBar', () => {
  it('renders the search field without a result count when empty', () => {
    renderSearch();

    expect(screen.getByPlaceholderText('Buscar por título, contenido o tipo…')).toBeInTheDocument();
    expect(screen.queryByText('mostrando 2 de 5')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).not.toBeInTheDocument();
  });

  it('emits searches and can clear the current query', async () => {
    const { onChange } = renderSearch('hero');
    const user = userEvent.setup();

    expect(screen.getByText('mostrando 2 de 5')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
