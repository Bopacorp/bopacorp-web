import { afterEach, describe, expect, it, vi } from 'vitest';

const validApiUrl = 'http://test.local/api/v1';

afterEach(() => vi.stubEnv('VITE_API_URL', validApiUrl));

describe('API configuration', () => {
  it('throws when VITE_API_URL is missing', async () => {
    vi.stubEnv('VITE_API_URL', '');
    vi.resetModules();

    await expect(import('./api.js')).rejects.toThrow('VITE_API_URL is required');
  });

  it('throws when VITE_API_URL has no API path', async () => {
    vi.stubEnv('VITE_API_URL', 'http://test.local');
    vi.resetModules();

    await expect(import('./api.js')).rejects.toThrow('VITE_API_URL must include the API path');
  });
});
