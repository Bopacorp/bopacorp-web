import { describe, expect, it } from 'vitest';
import { listContentBlockSections, listContentBlocks } from '@/modules/cms/cms.service.js';
import { fetchMe } from '@/services/auth.service.js';
import {
  authenticate,
  authorizationHeaders,
  httpRequest,
  isErrorEnvelope,
} from './support/api-test-client.js';

describe('authentication and permission contracts', () => {
  it('logs in the CMS account and reads the authenticated profile', async () => {
    const user = await authenticate('cms');
    const me = await fetchMe();

    expect(user.email).toBe(me.email);
    expect(me.roles).toEqual(expect.any(Array));
    expect(me.profile === null || typeof me.profile === 'object').toBe(true);
  });

  it('returns 401 for a protected request without credentials', async () => {
    const response = await httpRequest('/auth/me');

    expect(response.status).toBe(401);
    expect(isErrorEnvelope(response.body)).toBe(true);
    if (!isErrorEnvelope(response.body)) throw new Error('Expected an API error envelope');
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('reads CMS sections and blocks with the authenticated frontend services', async () => {
    await authenticate('cms');
    const [sections, blocks] = await Promise.all([
      listContentBlockSections(),
      listContentBlocks(1, '', ''),
    ]);

    expect(Array.isArray(sections)).toBe(true);
    expect(Array.isArray(blocks.data)).toBe(true);
    expect(blocks.meta).toEqual(expect.objectContaining({ page: 1, limit: 50 }));
  });

  it('maps a missing CMS permission to 403 and FORBIDDEN', async () => {
    await authenticate('limited');
    const response = await httpRequest('/catalog/content-blocks/sections', {
      headers: authorizationHeaders(),
    });

    expect(response.status).toBe(403);
    expect(isErrorEnvelope(response.body)).toBe(true);
    if (!isErrorEnvelope(response.body)) throw new Error('Expected an API error envelope');
    expect(response.body.error.code).toBe('FORBIDDEN');
    await expect(listContentBlockSections()).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });
});
