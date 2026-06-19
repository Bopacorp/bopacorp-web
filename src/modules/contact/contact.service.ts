import type { ContactRequestResponse, CreateContactRequest } from '@bopacorp/shared/catalog';
import { request } from '@/services/api.js';

export function createContactRequest(data: CreateContactRequest) {
  return request<ContactRequestResponse>({
    method: 'POST',
    url: '/contact-requests',
    data,
  });
}

export type { CreateContactRequest };
