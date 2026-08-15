import type { ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { saveUser } from '@/services/auth-storage.js';
import { createAuthUser } from '@/test/fixtures/auth-fixtures.js';
import { renderWithProviders, screen } from '@/test/test-utils.js';
import RequireAuth from './RequireAuth.js';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location-state">{JSON.stringify(location.state)}</output>;
}

function renderGuard(route: string | { pathname: string; search?: string }, children: ReactNode) {
  renderWithProviders(
    <Routes>
      <Route
        path="/admin/*"
        element={
          <RequireAuth>
            {children}
            <LocationProbe />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<LocationProbe />} />
    </Routes>,
    { route },
  );
}

describe('RequireAuth', () => {
  it('redirects unauthenticated users and preserves the original location', () => {
    renderGuard({ pathname: '/admin/cms', search: '?tab=all' }, <span>Protected content</span>);
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(screen.getByTestId('location-state')).toHaveTextContent(
      JSON.stringify({ from: '/admin/cms?tab=all' }),
    );
  });

  it('renders children for an authenticated user', () => {
    saveUser(createAuthUser());
    renderGuard('/admin', <span>Protected content</span>);
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
