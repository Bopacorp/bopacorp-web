import { fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApplyResponse, createResumeFile } from '@/test/fixtures/employability-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';
import type { ApplyState } from '../employability.types.js';

const applyMocks = vi.hoisted(() => ({
  submit: vi.fn(),
  reset: vi.fn(),
  state: { kind: 'idle' } as ApplyState,
}));

vi.mock('../hooks/use-apply-job-vacancy.js', () => ({
  useApplyJobVacancy: () => ({
    state: applyMocks.state,
    submit: applyMocks.submit,
    reset: applyMocks.reset,
  }),
}));

import { ApplyDialog } from './ApplyDialog.js';

const vacancy = { id: 'vacancy-1', title: 'Frontend Developer' };

function renderDialog(overrides: Partial<React.ComponentProps<typeof ApplyDialog>> = {}) {
  const onOpenChange = vi.fn();
  const view = renderWithProviders(
    <ApplyDialog open onOpenChange={onOpenChange} vacancy={vacancy} {...overrides} />,
    { withAuth: false },
  );
  return { ...view, onOpenChange };
}

beforeEach(() => {
  applyMocks.submit.mockReset();
  applyMocks.reset.mockReset();
  applyMocks.state = { kind: 'idle' };
});

async function fillValidForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Cedula'), '0912345678');
  await user.type(screen.getByLabelText('Nombre'), '  Juan  ');
  await user.type(screen.getByLabelText('Apellido'), '  Pérez  ');
  await user.type(screen.getByLabelText('Correo electronico'), '  juan@empresa.com  ');
  await user.type(screen.getByLabelText('Telefono (opcional)'), '0991234567');
  await user.type(screen.getByLabelText('Direccion (opcional)'), '  Guayaquil  ');
  await user.type(screen.getByLabelText('Carta de presentacion (opcional)'), '  Me interesa  ');
  await user.upload(screen.getByLabelText('CV en PDF'), createResumeFile());
  return user;
}

describe('ApplyDialog', () => {
  it('validates required fields before submitting', async () => {
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: 'Enviar postulacion' }));

    expect(applyMocks.submit).not.toHaveBeenCalled();
    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(5);
  });

  it('rejects invalid candidate fields', async () => {
    renderDialog();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Cedula'), '123');
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'A'.repeat(51) } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'B'.repeat(51) } });
    await user.type(screen.getByLabelText('Correo electronico'), 'invalid-email');
    await user.type(screen.getByLabelText('Telefono (opcional)'), '123');
    await user.click(screen.getByRole('button', { name: 'Enviar postulacion' }));

    expect(applyMocks.submit).not.toHaveBeenCalled();
    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(6);
  });

  it('requires a CV before sending the application', async () => {
    renderDialog();
    const user = await fillValidFormWithoutFile();
    await user.click(screen.getByRole('button', { name: 'Enviar postulacion' }));

    expect(applyMocks.submit).not.toHaveBeenCalled();
    expect(await screen.findByText('Adjunta tu CV en PDF')).toBeInTheDocument();
  });

  it('accepts a PDF and submits trimmed candidate data', async () => {
    renderDialog();
    const user = await fillValidForm();
    await user.click(screen.getByRole('button', { name: 'Enviar postulacion' }));

    await waitFor(() =>
      expect(applyMocks.submit).toHaveBeenCalledWith({
        vacancyId: 'vacancy-1',
        candidate: {
          nationalId: '0912345678',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@empresa.com',
          phone: '0991234567',
          address: 'Guayaquil',
        },
        coverLetter: 'Me interesa',
        file: expect.any(File),
      }),
    );
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
  });

  it.each([
    ['text file', createResumeFile('notes.txt', 'text/plain')],
    ['oversized PDF', createResumeFile('large.pdf', 'application/pdf', 20 * 1024 * 1024 + 1)],
  ])('rejects a %s', async (_label, file) => {
    renderDialog();
    const user = await fillValidFormWithoutFile();
    await user.upload(screen.getByLabelText('CV en PDF'), file);
    await user.click(screen.getByRole('button', { name: 'Enviar postulacion' }));

    expect(applyMocks.submit).not.toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('disables the form while the application is submitting', () => {
    applyMocks.state = { kind: 'submitting' };
    renderDialog();

    expect(screen.getByLabelText('Cedula')).toBeDisabled();
    expect(screen.getByLabelText('Correo electronico')).toBeDisabled();
    expect(screen.getByLabelText('CV en PDF')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Enviando...' })).toBeDisabled();
  });

  it('shows a general error without losing the form', () => {
    applyMocks.state = {
      kind: 'error',
      code: 'INTERNAL_ERROR',
      message: 'No fue posible enviar la postulación.',
    };
    renderDialog();
    expect(screen.getByText('No fue posible enviar la postulación.')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('maps API field errors to the corresponding control', async () => {
    applyMocks.state = {
      kind: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Invalid fields',
      details: [{ field: 'candidate.email', message: 'Correo inválido.' }],
    };
    renderDialog();
    await waitFor(() => expect(screen.getByText('Correo inválido.')).toBeInTheDocument());
    expect(screen.getByLabelText('Correo electronico').parentElement).toHaveAttribute(
      'data-invalid',
      'true',
    );
  });

  it('calls the success handler with the received application', async () => {
    const onSuccess = vi.fn();
    const response = createApplyResponse();
    applyMocks.state = { kind: 'success', data: response };
    renderDialog({ onSuccess });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(response));
  });

  it('asks before discarding changes and resets after closing', async () => {
    const { onOpenChange, rerender } = renderDialog();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Nombre'), 'Juan');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Descartar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    rerender(<ApplyDialog open={false} onOpenChange={onOpenChange} vacancy={vacancy} />);
    await waitFor(() => expect(applyMocks.reset).toHaveBeenCalledTimes(1));
  });
});

async function fillValidFormWithoutFile() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Cedula'), '0912345678');
  await user.type(screen.getByLabelText('Nombre'), 'Juan');
  await user.type(screen.getByLabelText('Apellido'), 'Pérez');
  await user.type(screen.getByLabelText('Correo electronico'), 'juan@empresa.com');
  await user.type(screen.getByLabelText('Telefono (opcional)'), '0991234567');
  return user;
}
