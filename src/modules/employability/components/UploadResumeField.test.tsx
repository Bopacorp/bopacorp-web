import { describe, expect, it, vi } from 'vitest';
import { createResumeFile } from '@/test/fixtures/employability-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';
import { formatFileName, UploadResumeField } from './UploadResumeField.js';

function renderField(disabled = false, value?: File) {
  const onChange = vi.fn();
  const view = renderWithProviders(
    <UploadResumeField onChange={onChange} disabled={disabled} value={value} />,
    { withAuth: false },
  );
  return { ...view, onChange };
}

describe('UploadResumeField', () => {
  it('accepts a PDF and displays its file name', async () => {
    const view = renderField();
    const file = createResumeFile('resume.pdf');

    await userEvent.upload(screen.getByLabelText('CV en PDF'), file);

    expect(view.onChange).toHaveBeenCalledWith(file);
    view.rerender(<UploadResumeField onChange={view.onChange} value={file} />);
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    const input = screen.getByLabelText('CV en PDF');
    expect(input).toHaveAttribute('accept', 'application/pdf');
  });

  it('truncates long file names without changing short names', () => {
    expect(formatFileName('resume.pdf')).toBe('resume.pdf');
    expect(formatFileName('candidate-resume-with-a-very-long-file-name.pdf')).toBe(
      'candidate-resume-with-a-very-...',
    );
  });

  it('disables file selection while submitting', () => {
    renderField(true);

    expect(screen.getByLabelText('CV en PDF')).toBeDisabled();
  });
});
