import { describe, expect, it } from 'vitest';
import { createJwtToken, createMeResponse, createTokens } from '@/test/fixtures/auth-fixtures.js';
import { buildAuthUser } from './auth.service.js';
import { saveTokens } from './auth-storage.js';

describe('buildAuthUser', () => {
  it('extracts permissions from a valid access token', () => {
    saveTokens({
      ...createTokens(),
      accessToken: createJwtToken({ permissions: ['content_blocks.read'] }),
    });

    expect(buildAuthUser(createMeResponse()).permissions).toEqual(['content_blocks.read']);
  });

  it('falls back to empty permissions for an invalid access token', () => {
    localStorage.setItem('bopacorp_access_token', 'malformed-token');

    expect(buildAuthUser(createMeResponse()).permissions).toEqual([]);
  });
});
