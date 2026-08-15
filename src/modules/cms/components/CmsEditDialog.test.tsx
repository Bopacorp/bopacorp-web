import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  createContentBlock,
  createImageContentBlock,
  createImageFile,
} from '@/test/fixtures/cms-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';
import { CmsEditDialog } from './CmsEditDialog.js';

function createProps(block = createContentBlock()) {
  return {
    block,
    body: block.body ?? '',
    file: null,
    saving: false,
    onBodyChange: vi.fn(),
    onFileChange: vi.fn(),
    onSave: vi.fn(),
    onCancel: vi.fn(),
    onDirtyChange: vi.fn(),
  };
}

describe('CmsEditDialog', () => {
  it('renders text content, character limits, and save actions', async () => {
    const props = createProps();
    renderWithProviders(<CmsEditDialog {...props} />, { withAuth: false });
    const user = userEvent.setup();
    const textarea = screen.getByRole('textbox');

    expect(textarea).toHaveValue(props.body);
    expect(textarea).toHaveAttribute('maxlength', '10000');
    expect(screen.getByText(`${props.body.length} caracteres`)).toBeInTheDocument();
    fireEvent.change(textarea, { target: { value: 'Updated content' } });
    expect(props.onBodyChange).toHaveBeenCalledWith('Updated content');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(props.onSave).toHaveBeenCalledTimes(1);
  });

  it('renders the image editor and requires a new file before saving', () => {
    const props = createProps(createImageContentBlock());
    renderWithProviders(<CmsEditDialog {...props} />, { withAuth: false });

    expect(screen.getByRole('img', { name: 'Vista previa' })).toBeInTheDocument();
    expect(screen.getByLabelText('Imagen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeDisabled();
  });

  it('shows image errors and disables all save controls while saving', () => {
    const props = {
      ...createProps(createImageContentBlock()),
      saving: true,
      file: createImageFile(),
      imageError: 'Formato no válido.',
    };
    renderWithProviders(<CmsEditDialog {...props} />, { withAuth: false });

    expect(screen.getByText('Formato no válido.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Guardando…' })).toBeDisabled();
    expect(screen.getByLabelText('Imagen')).toBeDisabled();
  });

  it('calls the cancel handler when the dialog requests a close', async () => {
    const props = createProps();
    renderWithProviders(<CmsEditDialog {...props} />, { withAuth: false });

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });
});
