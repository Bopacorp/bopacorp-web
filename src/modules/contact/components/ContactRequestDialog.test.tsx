import { waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createContactResponse } from '@/test/fixtures/catalog-fixtures.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';
import type { ContactState } from '../contact.types.js';

const contactMocks = vi.hoisted(() => ({
  submit: vi.fn(),
  reset: vi.fn(),
  state: { kind: 'idle' } as ContactState,
}));

vi.mock('../hooks/use-contact-request.js', () => ({
  useContactRequest: () => ({
    state: contactMocks.state,
    submit: contactMocks.submit,
    reset: contactMocks.reset,
  }),
}));

import { ContactRequestDialog } from './ContactRequestDialog.js';

function renderDialog(overrides: Partial<React.ComponentProps<typeof ContactRequestDialog>> = {}) {
  const onOpenChange = vi.fn();
  const view = renderWithProviders(
    <ContactRequestDialog open onOpenChange={onOpenChange} itemId="item-1" {...overrides} />,
    { withAuth: false },
  );
  return { ...view, onOpenChange };
}

beforeEach(() => {
  contactMocks.submit.mockReset();
  contactMocks.reset.mockReset();
  contactMocks.state = { kind: 'idle' };
});

async function fillRequiredFields() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Nombre completo'), '  Ana Pérez  ');
  await user.type(screen.getByLabelText('Correo electronico'), '  ana@empresa.com  ');
  return user;
}

describe('ContactRequestDialog', () => {
  it('validates required and invalid email fields before submitting', async () => {
    const { onOpenChange } = renderDialog();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }));
    expect(contactMocks.submit).not.toHaveBeenCalled();
    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('dialog', { name: 'Solicitar Cotizacion' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Correo electronico')).toHaveAttribute('aria-invalid', 'true');

    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez');
    await user.type(screen.getByLabelText('Correo electronico'), 'invalid-email');
    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }));

    expect(contactMocks.submit).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('does not submit when Enter is pressed with required fields missing', async () => {
    renderDialog();
    const user = userEvent.setup();

    await user.click(screen.getByLabelText('Nombre completo'));
    await user.keyboard('{Enter}');

    expect(contactMocks.submit).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('aria-invalid', 'true');
  });

  it('submits trimmed required values and preserves the selected item', async () => {
    renderDialog();
    const user = await fillRequiredFields();

    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }));

    await waitFor(() =>
      expect(contactMocks.submit).toHaveBeenCalledWith({
        itemId: 'item-1',
        clientName: 'Ana Pérez',
        clientEmail: 'ana@empresa.com',
        clientPhone: undefined,
        message: undefined,
      }),
    );
  });

  it('exposes the current field limits and allows optional fields to be omitted', () => {
    renderDialog();

    expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('maxlength', '50');
    expect(screen.getByLabelText('Correo electronico')).toHaveAttribute('maxlength', '150');
    expect(screen.getByLabelText('Telefono (opcional)')).toHaveAttribute('maxlength', '10');
    expect(screen.getByLabelText('Mensaje (opcional)')).toHaveAttribute('maxlength', '1000');
  });

  it('disables the form while a request is submitting', () => {
    contactMocks.state = { kind: 'submitting' };
    renderDialog();

    expect(screen.getByLabelText('Nombre completo')).toBeDisabled();
    expect(screen.getByLabelText('Correo electronico')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Enviando...' })).toBeDisabled();
  });

  it('keeps the form and shows a general API error', () => {
    contactMocks.state = {
      kind: 'error',
      code: 'INTERNAL_ERROR',
      message: 'No fue posible enviar la solicitud.',
    };
    renderDialog();

    expect(screen.getByText('No fue posible enviar la solicitud.')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
  });

  it('maps API field errors to the corresponding controls', async () => {
    contactMocks.state = {
      kind: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Invalid fields',
      details: [{ field: 'clientEmail', message: 'El correo no es válido.' }],
    };
    renderDialog();

    await waitFor(() => expect(screen.getByText('El correo no es válido.')).toBeInTheDocument());
    expect(screen.getByLabelText('Correo electronico').parentElement).toHaveAttribute(
      'data-invalid',
      'true',
    );
  });

  it('calls the success handler with the received response', async () => {
    const onSuccess = vi.fn();
    const response = createContactResponse();
    contactMocks.state = { kind: 'success', data: response };
    renderDialog({ onSuccess });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(response));
  });

  it('asks before discarding dirty changes and resets after closing', async () => {
    const { onOpenChange, rerender } = renderDialog();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Seguir editando' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Ana Pérez');

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await user.click(screen.getByRole('button', { name: 'Descartar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);

    rerender(<ContactRequestDialog open={false} onOpenChange={onOpenChange} itemId="item-1" />);
    await waitFor(() => expect(contactMocks.reset).toHaveBeenCalledTimes(1));
  });

  it('closes a clean form without opening the discard confirmation', async () => {
    const { onOpenChange } = renderDialog();
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('closes a clean form when Escape is pressed', async () => {
    const { onOpenChange } = renderDialog();

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });
});
