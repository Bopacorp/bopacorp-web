import { fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createContentBlock,
  createContentMeta,
  createContentSection,
  createImageContentBlock,
  createImageFile,
} from '@/test/fixtures/cms-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';

const sectionMocks = vi.hoisted(() => ({ useSections: vi.fn() }));
const blockMocks = vi.hoisted(() => ({ useContentBlocks: vi.fn() }));
const serviceMocks = vi.hoisted(() => ({
  updateContentBlock: vi.fn(),
  uploadContentBlockImage: vi.fn(),
}));
const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock('./useSections.js', () => sectionMocks);
vi.mock('./useContentBlocks.js', () => blockMocks);
vi.mock('./cms.service.js', () => serviceMocks);
vi.mock('sonner', () => ({ toast: toastMocks }));

import { CmsPage } from './CmsAdminPage.js';

const sections = [createContentSection(), createContentSection({ prefix: 'about', count: 1 })];
const textBlock = createContentBlock();

function defaultBlockState(overrides: Record<string, unknown> = {}) {
  return {
    contentBlocks: [textBlock],
    meta: createContentMeta(),
    loading: false,
    error: null,
    retry: vi.fn(),
    refresh: vi.fn().mockResolvedValue(undefined),
    setContentBlocks: vi.fn(),
    ...overrides,
  };
}

function renderPage() {
  return renderWithProviders(<CmsPage />, { withAuth: false });
}

beforeEach(() => {
  sectionMocks.useSections.mockReset();
  blockMocks.useContentBlocks.mockReset();
  serviceMocks.updateContentBlock.mockReset();
  serviceMocks.uploadContentBlockImage.mockReset();
  toastMocks.success.mockReset();
  toastMocks.error.mockReset();
  sectionMocks.useSections.mockReturnValue({ sections, loading: false, error: null });
  blockMocks.useContentBlocks.mockReturnValue(defaultBlockState());
  serviceMocks.updateContentBlock.mockResolvedValue(textBlock);
  serviceMocks.uploadContentBlockImage.mockResolvedValue({
    url: 'https://cdn.test/updated.webp',
    key: 'updated.webp',
    contentKey: 'landing.hero.background_image_url',
  });
});

describe('CmsPage', () => {
  it('shows the CMS skeleton while sections are loading', () => {
    sectionMocks.useSections.mockReturnValue({ sections: [], loading: true, error: null });
    renderPage();

    expect(screen.queryByText('Bloques de Contenido')).not.toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });

  it('shows a section loading error with a retry action', () => {
    sectionMocks.useSections.mockReturnValue({
      sections: [],
      loading: false,
      error: 'No se pudieron cargar las secciones.',
    });
    renderPage();

    expect(screen.getByText('No se pudieron cargar las secciones.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('selects the first section and renders metadata and blocks', async () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Bloques de Contenido' })).toBeInTheDocument();
    expect(screen.getByText('3 entradas')).toBeInTheDocument();
    expect(screen.getByText('Hero title')).toBeInTheDocument();
    await waitFor(() =>
      expect(blockMocks.useContentBlocks).toHaveBeenLastCalledWith(1, 'hero', ''),
    );
    expect(screen.getByRole('tab', { name: /Hero/ })).toHaveAttribute('data-state', 'active');
  });

  it('changes section and applies the debounced search and clear actions', async () => {
    renderPage();
    const user = userEvent.setup();
    await waitFor(() =>
      expect(blockMocks.useContentBlocks).toHaveBeenLastCalledWith(1, 'hero', ''),
    );

    await user.click(screen.getByRole('tab', { name: /Acerca de/ }));
    await waitFor(() =>
      expect(blockMocks.useContentBlocks).toHaveBeenLastCalledWith(1, 'about', ''),
    );
    const search = screen.getByPlaceholderText('Buscar por título, contenido o tipo…');
    await user.type(search, 'connect');
    await waitFor(
      () => expect(blockMocks.useContentBlocks).toHaveBeenLastCalledWith(1, 'about', 'connect'),
      { timeout: 1200 },
    );
    await user.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }));
    await waitFor(() =>
      expect(blockMocks.useContentBlocks).toHaveBeenLastCalledWith(1, 'about', ''),
    );
  });

  it('shows an empty archive and a distinct no-results state', async () => {
    blockMocks.useContentBlocks.mockReturnValue(defaultBlockState({ contentBlocks: [] }));
    renderPage();
    const user = userEvent.setup();

    expect(screen.getByText('El archivo está vacío')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Buscar por título, contenido o tipo…'), 'missing');
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('retries a block loading error', async () => {
    const retry = vi.fn();
    blockMocks.useContentBlocks.mockReturnValue(
      defaultBlockState({ error: 'No se pudieron cargar los bloques.', retry }),
    );
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('edits and saves a text block', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Editar' }));
    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'Updated CMS text');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() =>
      expect(serviceMocks.updateContentBlock).toHaveBeenCalledWith(textBlock.id, {
        body: 'Updated CMS text',
      }),
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps the text editor open and reports update errors', async () => {
    serviceMocks.updateContentBlock.mockRejectedValue(new Error('Update failed'));
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Editar' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Updated CMS text');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => expect(toastMocks.error).toHaveBeenCalledWith('Update failed'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('validates and uploads an image block', async () => {
    const imageBlock = createImageContentBlock();
    const refresh = vi.fn().mockResolvedValue(undefined);
    blockMocks.useContentBlocks.mockReturnValue(
      defaultBlockState({ contentBlocks: [imageBlock], refresh }),
    );
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Editar' }));
    const input = screen.getByLabelText('Imagen');
    fireEvent.change(input, {
      target: { files: [createImageFile('bad.gif', 'image/gif')] },
    });
    expect(screen.getByText('Formato no válido. Usa JPG, PNG, WebP o AVIF.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeDisabled();

    fireEvent.change(input, {
      target: { files: [createImageFile('large.webp', 'image/webp', 5 * 1024 * 1024 + 1)] },
    });
    expect(screen.getByText('La imagen debe pesar menos de 5 MB.')).toBeInTheDocument();

    fireEvent.change(input, {
      target: { files: [createImageFile('valid.webp')] },
    });
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() =>
      expect(serviceMocks.uploadContentBlockImage).toHaveBeenCalledWith(
        imageBlock.contentKey,
        expect.any(File),
      ),
    );
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
    expect(toastMocks.success).toHaveBeenCalledWith('Imagen actualizada');
  });

  it('asks for confirmation before discarding text changes', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Editar' }));
    await user.type(screen.getByRole('textbox'), ' changed');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Seguir editando' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await user.click(screen.getByRole('button', { name: 'Descartar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
