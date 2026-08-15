import type { AuthTokensResponse } from '@bopacorp/shared/auth';
import type { AuthUser } from '@/services/auth.service.js';
import type { JwtPayload } from '@/services/jwt.js';

export function createAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'user-1',
    username: 'admin.user',
    email: 'admin@bopacorp.com',
    roles: ['admin'],
    permissions: ['content_blocks.read', 'content_blocks.update'],
    profile: null,
    ...overrides,
  };
}

export function createMeResponse(
  overrides: Partial<Omit<AuthUser, 'permissions'>> = {},
): Omit<AuthUser, 'permissions'> {
  const user = createAuthUser(overrides);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    profile: user.profile,
  };
}

export function createTokens(overrides: Partial<AuthTokensResponse> = {}): AuthTokensResponse {
  return {
    accessToken: createJwtToken(),
    refreshToken: 'refresh-token',
    expiresIn: 3600,
    ...overrides,
  };
}

export function createJwtToken(overrides: Partial<JwtPayload> = {}): string {
  const payload: JwtPayload = {
    sub: 'user-1',
    email: 'admin@bopacorp.com',
    roles: ['admin'],
    permissions: ['content_blocks.read'],
    ...overrides,
  };
  return `${encodeBase64Url({ alg: 'none', typ: 'JWT' })}.${encodeBase64Url(payload)}.signature`;
}

function encodeBase64Url(value: object): string {
  return btoa(JSON.stringify(value)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}
