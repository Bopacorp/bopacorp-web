import { describe, expect, it } from 'vitest';
import { saveUser } from '@/services/auth-storage.js';
import { createAuthUser } from '@/test/fixtures/auth-fixtures.js';
import { renderWithProviders, screen } from '@/test/test-utils.js';
import { PermissionRoute } from './PermissionRoute.js';

function renderRoute(permission: string, permissions: string[]) {
  saveUser(createAuthUser({ permissions }));
  renderWithProviders(
    <PermissionRoute permission={permission}>
      <span>Protected page</span>
    </PermissionRoute>,
  );
}

describe('PermissionRoute', () => {
  it('renders an access denied message without permission', () => {
    renderRoute('content_blocks.read', []);
    expect(screen.getByRole('heading', { name: 'Acceso denegado' })).toBeInTheDocument();
    expect(screen.queryByText('Protected page')).not.toBeInTheDocument();
  });

  it('renders the protected page with permission', () => {
    renderRoute('content_blocks.read', ['content_blocks.read']);
    expect(screen.getByText('Protected page')).toBeInTheDocument();
  });

  it('renders the child when no permission is required', () => {
    saveUser(createAuthUser({ permissions: [] }));
    renderWithProviders(
      <PermissionRoute permission={null}>
        <span>Public section</span>
      </PermissionRoute>,
    );
    expect(screen.getByText('Public section')).toBeInTheDocument();
  });
});
