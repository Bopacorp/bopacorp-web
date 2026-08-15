import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n/index.js';
import { ModeToggle } from '@/shared/ui/ModeToggle.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';

const themeMocks = vi.hoisted(() => ({
  theme: 'light',
  setTheme: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: () => themeMocks,
}));

describe('ModeToggle', () => {
  beforeEach(async () => {
    themeMocks.theme = 'light';
    themeMocks.setTheme.mockReset();
    await i18n.changeLanguage('es');
  });

  it('cycles from light to dark to system', async () => {
    const view = renderWithProviders(<ModeToggle />, { withAuth: false });
    const user = userEvent.setup();

    expect(screen.getByRole('button', { name: 'Claro' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Claro' }));
    expect(themeMocks.setTheme).toHaveBeenCalledWith('dark');

    themeMocks.theme = 'dark';
    view.unmount();
    renderWithProviders(<ModeToggle />, { withAuth: false });
    await user.click(screen.getByRole('button', { name: 'Oscuro' }));
    expect(themeMocks.setTheme).toHaveBeenCalledWith('system');
  });

  it('wraps from system to light and localizes its accessible label', async () => {
    themeMocks.theme = 'system';
    await i18n.changeLanguage('en');
    renderWithProviders(<ModeToggle />, { withAuth: false });
    const user = userEvent.setup();

    const button = screen.getByRole('button', { name: 'System' });
    await user.click(button);

    expect(themeMocks.setTheme).toHaveBeenCalledWith('light');
  });
});
