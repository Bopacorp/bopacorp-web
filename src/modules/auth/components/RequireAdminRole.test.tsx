import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { saveUser } from '@/services/auth-storage.js';
import { createAuthUser } from '@/test/fixtures/auth-fixtures.js';
import { renderWithProviders, screen } from '@/test/test-utils.js';
import RequireAdminRole from './RequireAdminRole.js';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="pathname">{location.pathname}</output>;
}

function renderRoleGuard(user: ReturnType<typeof createAuthUser>, children: ReactNode) {
  saveUser(user);
  renderWithProviders(
    <>
      <RequireAdminRole>{children}</RequireAdminRole>
      <LocationProbe />
    </>,
    { route: '/admin' },
  );
}

describe('RequireAdminRole', () => {
  it.each([['admin'], ['web-admin']])('allows the %s role', (role) => {
    renderRoleGuard(createAuthUser({ roles: [role] }), <span>Admin content</span>);
    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });

  it('redirects users without an administrative role', () => {
    renderRoleGuard(createAuthUser({ roles: ['editor'] }), <span>Admin content</span>);
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
    expect(screen.getByTestId('pathname')).toHaveTextContent('/login');
  });
});
