import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const coverageInclude = [
  'src/App.tsx',
  'src/app/{AdminLayout,MainLayout}.tsx',
  'src/components/ScrollToTop.tsx',
  'src/services/**/*.ts',
  'src/modules/auth/**/*.{ts,tsx}',
  'src/modules/admin/components/PermissionRoute.tsx',
  'src/modules/catalog/**/*.{ts,tsx}',
  'src/modules/contact/**/*.{ts,tsx}',
  'src/modules/employability/**/*.{ts,tsx}',
  'src/modules/cms/**/*.{ts,tsx}',
  'src/modules/landing/hooks/use-cms-landing.ts',
  'src/modules/landing/pages/ServicesPage.tsx',
  'src/modules/landing/pages/JobsPage.tsx',
  'src/modules/landing/pages/JobDetailPage.tsx',
  'src/shared/errors/**/*.ts',
  'src/shared/hooks/use-unsaved-guard.ts',
  'src/shared/ui/page-loader.tsx',
  'src/shared/ui/error-state.tsx',
  'src/shared/ui/empty-state.tsx',
  'src/shared/ui/ModeToggle.tsx',
  'src/lib/sanitize.ts',
];

const coverageExclude = [
  'src/test/**',
  '**/*.test.*',
  '**/*.spec.*',
  'src/components/ui/**',
  'src/assets/**',
  'src/**/*.d.ts',
];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    testTimeout: 15000,
    hookTimeout: 15000,
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'coverage/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: coverageInclude,
      exclude: coverageExclude,
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['bopacorp-web.jointrymyride.com'],
  },
});
