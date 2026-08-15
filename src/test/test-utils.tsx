import { type RenderOptions, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { type InitialEntry, MemoryRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip.js';
import i18n from '@/i18n/index.js';
import { AuthProvider } from '@/modules/auth/context/AuthContext.js';

interface ProviderTreeProps {
  children: ReactNode;
  withAuth: boolean;
  route: InitialEntry | InitialEntry[];
}

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: InitialEntry | InitialEntry[];
  withAuth?: boolean;
}

function ProviderTree({ children, withAuth, route }: ProviderTreeProps) {
  const content = withAuth ? <AuthProvider>{children}</AuthProvider> : children;
  return (
    <MemoryRouter initialEntries={Array.isArray(route) ? route : [route]}>
      <I18nextProvider i18n={i18n}>
        <TooltipProvider>{content}</TooltipProvider>
      </I18nextProvider>
    </MemoryRouter>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', withAuth = true, ...options }: RenderWithProvidersOptions = {},
) {
  return render(
    <ProviderTree route={route} withAuth={withAuth}>
      {ui}
    </ProviderTree>,
    options,
  );
}

export * from '@testing-library/react';
export { userEvent };
