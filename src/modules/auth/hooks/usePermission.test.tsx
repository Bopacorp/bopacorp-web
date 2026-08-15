import { describe, expect, it } from 'vitest';
import { saveUser } from '@/services/auth-storage.js';
import { createAuthUser } from '@/test/fixtures/auth-fixtures.js';
import { renderWithProviders, screen } from '@/test/test-utils.js';
import { usePermission } from './usePermission.js';

function PermissionProbe() {
  const { hasPermission, hasAnyPermission } = usePermission();
  return (
    <>
      <output data-testid="read">{String(hasPermission('content_blocks.read'))}</output>
      <output data-testid="any">
        {String(hasAnyPermission(['missing', 'content_blocks.read']))}
      </output>
    </>
  );
}

describe('usePermission', () => {
  it('evaluates a single permission and an allowed permission list', () => {
    saveUser(createAuthUser({ permissions: ['content_blocks.read'] }));
    renderWithProviders(<PermissionProbe />);

    expect(screen.getByTestId('read')).toHaveTextContent('true');
    expect(screen.getByTestId('any')).toHaveTextContent('true');
  });
});
