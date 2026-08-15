import { describe, expect, it } from 'vitest';
import {
  listPublicCatalogItems,
  listPublicCategories,
  listPublicSegments,
} from '@/modules/catalog/catalog.service.js';
import {
  getPublicJobVacancy,
  listPublishedVacancies,
} from '@/modules/employability/employability.service.js';
import { request } from '@/services/api.js';
import { httpRequest, isErrorEnvelope, jsonHeaders } from './support/api-test-client.js';

interface CmsLandingResponse {
  blocks: Record<string, unknown>;
}

const missingId = '00000000-0000-0000-0000-000000000000';

describe('public API contracts', () => {
  it('returns catalog collections through the frontend services', async () => {
    const [items, categories, segments] = await Promise.all([
      listPublicCatalogItems(),
      listPublicCategories(),
      listPublicSegments(),
    ]);

    expect(Array.isArray(items)).toBe(true);
    expect(Array.isArray(categories)).toBe(true);
    expect(Array.isArray(segments)).toBe(true);
  });

  it('returns the public CMS block map through request', async () => {
    const data = await request<CmsLandingResponse>({ method: 'GET', url: '/cms/landing' });

    expect(data).toEqual(expect.objectContaining({ blocks: expect.any(Object) }));
  });

  it('returns paginated published vacancies through the frontend service', async () => {
    const response = await listPublishedVacancies({ page: 1, limit: 10, sortOrder: 'asc' });

    expect(Array.isArray(response.data)).toBe(true);
    expect(response.meta).toEqual(
      expect.objectContaining({ page: 1, limit: 10, totalItems: expect.any(Number) }),
    );
  });

  it('returns a public vacancy detail for a published vacancy', async () => {
    const list = await listPublishedVacancies({ page: 1, limit: 1, sortOrder: 'asc' });
    const vacancy = list.data[0];

    expect(vacancy).toBeDefined();
    if (!vacancy) throw new Error('The integration environment needs a published vacancy');

    const detail = await getPublicJobVacancy(vacancy.id);
    expect(detail).toEqual(expect.objectContaining({ id: vacancy.id, title: expect.any(String) }));
  });

  it('maps a missing public vacancy to the documented not-found error', async () => {
    await expect(getPublicJobVacancy(missingId)).rejects.toMatchObject({
      code: 'RESOURCE_NOT_FOUND',
    });
  });

  it('returns validation details for an invalid contact request', async () => {
    const response = await httpRequest('/contact-requests', {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ clientName: '', clientEmail: 'invalid' }),
    });

    expect(response.status).toBe(422);
    expect(isErrorEnvelope(response.body)).toBe(true);
    if (!isErrorEnvelope(response.body)) throw new Error('Expected an API error envelope');
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details).toEqual(expect.any(Array));
  });

  it('rejects an application without a PDF file', async () => {
    const response = await httpRequest('/employability/apply', {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({
        vacancyId: missingId,
        candidate: {
          nationalId: '0901234567',
          firstName: 'Frontend',
          lastName: 'Integration',
          email: 'integration@example.com',
          phone: '0991234567',
        },
      }),
    });

    expect(response.status).toBe(400);
    expect(isErrorEnvelope(response.body)).toBe(true);
    if (!isErrorEnvelope(response.body)) throw new Error('Expected an API error envelope');
    expect(response.body.error.code).toBe('BAD_REQUEST');
  });
});
