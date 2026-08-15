import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import RequireAuth from './RequireAuth.js';

const authState = vi.hoisted(() => ({ user: null, isLoading: false }));

vi.mock('../context/AuthContext.js', () => ({
  useAuth: () => authState,
}));

function renderGuard() {
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <span>Protected content</span>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAuth loading state', () => {
  it('shows the session loader while authentication is pending', () => {
    authState.isLoading = true;
    renderGuard();
    expect(screen.getByText('Verificando sesión...')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});
