import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createContactResponse } from '@/test/fixtures/catalog-fixtures.js';

const apiMocks = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock('@/services/api.js', () => apiMocks);

import { createContactRequest } from './contact.service.js';

beforeEach(() => {
  apiMocks.request.mockReset();
});

describe('contact service', () => {
  it('creates a contact request with the expected endpoint and payload', async () => {
    const data = {
      itemId: 'item-1',
      clientName: 'Ana Pérez',
      clientEmail: 'ana@empresa.com',
      clientPhone: '0991234567',
      message: 'Necesito una cotización.',
    };
    const response = createContactResponse();
    apiMocks.request.mockResolvedValue(response);

    await expect(createContactRequest(data)).resolves.toEqual(response);
    expect(apiMocks.request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/contact-requests',
      data,
    });
  });
});
