import { describe, expect, it } from 'vitest';
import { saveUser } from '@/services/auth-storage.js';
import { createAuthUser } from '@/test/fixtures/auth-fixtures.js';
import { renderWithProviders, screen } from '@/test/test-utils.js';
import { Can } from './Can.js';

function renderAction(props: { permission?: string; any?: string[] }) {
  renderWithProviders(
    <Can {...props}>
      <span>Protected action</span>
    </Can>,
  );
}

describe('Can', () => {
  it('hides an action when the required permission is missing', () => {
    saveUser(createAuthUser({ permissions: [] }));
    renderAction({ permission: 'content_blocks.read' });
    expect(screen.queryByText('Protected action')).not.toBeInTheDocument();
  });

  it('shows an action when the required permission exists', () => {
    saveUser(createAuthUser({ permissions: ['content_blocks.read'] }));
    renderAction({ permission: 'content_blocks.read' });
    expect(screen.getByText('Protected action')).toBeInTheDocument();
  });

  it('shows an action when any allowed permission exists', () => {
    saveUser(createAuthUser({ permissions: ['content_blocks.read'] }));
    renderAction({ any: ['content_blocks.update', 'content_blocks.read'] });
    expect(screen.getByText('Protected action')).toBeInTheDocument();
  });
});
