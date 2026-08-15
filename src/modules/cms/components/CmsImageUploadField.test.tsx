import { describe, expect, it, vi } from 'vitest';
import { createImageFile } from '@/test/fixtures/cms-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';
import { CmsImageUploadField } from './CmsImageUploadField.js';

function renderField(overrides: Partial<React.ComponentProps<typeof CmsImageUploadField>> = {}) {
  const onChange = overrides.onChange ?? vi.fn();
  const view = renderWithProviders(
    <CmsImageUploadField
      id="cms-image"
      currentUrl={null}
      file={null}
      onChange={onChange}
      {...overrides}
    />,
    { withAuth: false },
  );
  return { ...view, onChange };
}

describe('CmsImageUploadField', () => {
  it('shows the current preview and accepts the supported image formats', () => {
    renderField({ currentUrl: 'https://cdn.test/current.webp' });

    expect(screen.getByRole('img', { name: 'Vista previa' })).toHaveAttribute(
      'src',
      'https://cdn.test/current.webp',
    );
    expect(screen.getByLabelText('Imagen')).toHaveAttribute(
      'accept',
      'image/png,image/jpeg,image/webp,image/avif',
    );
  });

  it('emits a selected file and renders its preview when controlled', async () => {
    const view = renderField();
    const file = createImageFile('candidate-image.webp');

    await userEvent.upload(screen.getByLabelText('Imagen'), file);

    expect(view.onChange).toHaveBeenCalledWith(file);
    view.rerender(
      <CmsImageUploadField id="cms-image" currentUrl={null} file={file} onChange={view.onChange} />,
    );
    expect(screen.getByText('candidate-image.webp')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Vista previa' })).toHaveAttribute('src', 'blob:test');
  });

  it('clears the selected file and resets the input', async () => {
    const file = createImageFile();
    const view = renderField({ file });
    const input = screen.getByLabelText('Imagen') as HTMLInputElement;

    await userEvent.click(screen.getByRole('button', { name: 'Quitar imagen' }));

    expect(view.onChange).toHaveBeenCalledWith(null);
    expect(input.value).toBe('');
  });

  it('shows errors and disables selection while saving', () => {
    renderField({ disabled: true, error: 'Formato no válido.' });

    expect(screen.getByText('Formato no válido.')).toBeInTheDocument();
    expect(screen.getByLabelText('Imagen')).toBeDisabled();
  });
});
