import { act, fireEvent } from '@testing-library/react';
import { type InitialEntry, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAuthUser, createTokens } from '@/test/fixtures/auth-fixtures.js';
import { createDeferred } from '@/test/fixtures/axios-fixtures.js';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/test-utils.js';
import LoginPage from './LoginPage.js';

const authMocks = vi.hoisted(() => ({ login: vi.fn() }));
const errorMocks = vi.hoisted(() => ({ getErrorMessage: vi.fn() }));

vi.mock('@/services/auth.service.js', async () => {
  const actual = await vi.importActual<typeof import('@/services/auth.service.js')>(
    '@/services/auth.service.js',
  );
  return { ...actual, login: authMocks.login };
});

vi.mock('@/shared/errors/index.js', async () => {
  const actual = await vi.importActual<typeof import('@/shared/errors/index.js')>(
    '@/shared/errors/index.js',
  );
  return { ...actual, getErrorMessage: errorMocks.getErrorMessage };
});

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="pathname">{location.pathname}</output>;
}

function renderLogin(route: InitialEntry = '/login') {
  renderWithProviders(
    <>
      <LoginPage />
      <LocationProbe />
    </>,
    { route },
  );
}

async function fillLogin(email = 'admin@bopacorp.com', password = 'Password1!') {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Correo electrónico'), email);
  await user.type(screen.getByLabelText('Contraseña'), password);
  await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
}

beforeEach(() => {
  authMocks.login.mockReset();
  errorMocks.getErrorMessage.mockReset();
  errorMocks.getErrorMessage.mockImplementation((error: unknown) =>
    error instanceof Error ? error.message : 'Unknown error',
  );
});

describe('LoginPage', () => {
  it('logs in an administrator and navigates to the admin panel', async () => {
    authMocks.login.mockResolvedValue({ user: createAuthUser(), tokens: createTokens() });
    renderLogin();

    await fillLogin();
    await waitFor(() => expect(screen.getByTestId('pathname')).toHaveTextContent('/admin'));
    expect(authMocks.login).toHaveBeenCalledWith({
      email: 'admin@bopacorp.com',
      password: 'Password1!',
    });
  });

  it('preserves the requested destination after login', async () => {
    authMocks.login.mockResolvedValue({ user: createAuthUser(), tokens: createTokens() });
    renderLogin({ pathname: '/login', state: { from: '/admin/cms' } });

    await fillLogin();
    await waitFor(() => expect(screen.getByTestId('pathname')).toHaveTextContent('/admin/cms'));
  });

  it('shows the invalid credentials message', async () => {
    authMocks.login.mockResolvedValue({
      user: createAuthUser({ roles: ['editor'] }),
      tokens: createTokens(),
    });
    errorMocks.getErrorMessage.mockReturnValue('Correo o contraseña incorrectos.');
    renderLogin();

    await fillLogin();
    expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
  });

  it('rejects an authenticated user without an admin role', async () => {
    authMocks.login.mockResolvedValue({
      user: createAuthUser({ roles: ['editor'] }),
      tokens: createTokens(),
    });
    renderLogin();

    await fillLogin();
    expect(
      await screen.findByText('No tienes permisos para acceder al panel de administración.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pathname')).toHaveTextContent('/login');
  });

  it('does not submit empty or invalid fields', async () => {
    renderLogin();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(authMocks.login).not.toHaveBeenCalled();
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });

  it('disables the form while login is pending', async () => {
    const pending = createDeferred<{
      user: ReturnType<typeof createAuthUser>;
      tokens: ReturnType<typeof createTokens>;
    }>();
    authMocks.login.mockReturnValue(pending.promise);
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Correo electrónico'), 'admin@bopacorp.com');
    await user.type(screen.getByLabelText('Contraseña'), 'Password1!');
    const form = screen.getByRole('button', { name: 'Iniciar sesión' }).closest('form');
    if (!form) throw new Error('Login form was not found');
    fireEvent.submit(form);
    await waitFor(() => expect(authMocks.login).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeDisabled(),
    );

    expect(screen.getByLabelText('Correo electrónico')).toBeDisabled();
    expect(screen.getByLabelText('Contraseña')).toBeDisabled();
    await act(async () => {
      pending.resolve({ user: createAuthUser(), tokens: createTokens() });
      await pending.promise;
    });
  });
});
