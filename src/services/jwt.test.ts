import { describe, expect, it } from 'vitest';
import { createJwtToken } from '@/test/fixtures/auth-fixtures.js';
import { decodeJwtPayload } from './jwt.js';

describe('decodeJwtPayload', () => {
  it('decodes roles and permissions from a valid token', () => {
    const token = createJwtToken({ roles: ['web-admin'], permissions: ['content_blocks.read'] });
    expect(decodeJwtPayload(token)).toMatchObject({
      roles: ['web-admin'],
      permissions: ['content_blocks.read'],
    });
  });

  it('rejects a token without a payload', () => {
    expect(() => decodeJwtPayload('invalid-token')).toThrow('Invalid JWT');
  });

  it('rejects malformed JSON payloads', () => {
    const malformedToken = 'header.bm90LWpzb24.signature';
    expect(() => decodeJwtPayload(malformedToken)).toThrow();
  });
});
