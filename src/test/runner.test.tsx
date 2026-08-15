import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils.js';
import { renderWithProviders, screen } from './test-utils.js';

describe('testing infrastructure', () => {
  it('renders React in the jsdom environment', () => {
    renderWithProviders(<button type="button">Prueba</button>, { withAuth: false });
    expect(screen.getByRole('button', { name: 'Prueba' })).toBeInTheDocument();
  });

  it('resolves the @ alias in test files', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
