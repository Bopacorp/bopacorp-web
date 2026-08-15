import { describe, expect, it, vi } from 'vitest';
import { createContentBlock, createImageContentBlock } from '@/test/fixtures/cms-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';
import { CmsBlockCard } from './CmsBlockCard.js';

describe('CmsBlockCard', () => {
  it('renders text content and opens the edit action', async () => {
    const block = createContentBlock();
    const onEdit = vi.fn();
    renderWithProviders(<CmsBlockCard block={block} onEdit={onEdit} />, { withAuth: false });

    expect(screen.getByText('Hero title')).toBeInTheDocument();
    expect(screen.getByText('Conectividad que impulsa tu empresa')).toBeInTheDocument();
    expect(screen.getByText('TEXT')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(onEdit).toHaveBeenCalledWith(block);
  });

  it('renders an image preview for visual blocks', () => {
    const block = createImageContentBlock();
    renderWithProviders(<CmsBlockCard block={block} onEdit={vi.fn()} />, { withAuth: false });

    expect(screen.getByRole('img', { name: 'Vista previa' })).toHaveAttribute('src', block.body);
  });

  it('shows the empty image state when a visual block has no body', () => {
    renderWithProviders(
      <CmsBlockCard block={createImageContentBlock({ body: null })} onEdit={vi.fn()} />,
      { withAuth: false },
    );

    expect(screen.getByText('Sin URL de imagen.')).toBeInTheDocument();
  });
});
