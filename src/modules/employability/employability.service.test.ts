import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createApplyResponse,
  createPublicVacancy,
  createVacancyListItem,
} from '@/test/fixtures/employability-fixtures.js';

const apiMocks = vi.hoisted(() => ({
  request: vi.fn(),
  requestPaginated: vi.fn(),
}));

vi.mock('@/services/api.js', () => apiMocks);

import {
  applyJobVacancy,
  getPublicJobVacancy,
  listPublishedVacancies,
} from './employability.service.js';

beforeEach(() => {
  apiMocks.request.mockReset();
  apiMocks.requestPaginated.mockReset();
});

describe('employability service', () => {
  it('lists published vacancies with the complete query', async () => {
    const response = {
      data: [createVacancyListItem()],
      meta: { page: 2, limit: 10, totalItems: 21, totalPages: 3 },
    };
    const query = {
      page: 2,
      limit: 10,
      search: 'frontend',
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
    };
    apiMocks.requestPaginated.mockResolvedValue(response);

    await expect(listPublishedVacancies(query)).resolves.toEqual(response);
    expect(apiMocks.requestPaginated).toHaveBeenCalledWith({
      method: 'GET',
      url: '/employability/vacancies/published',
      params: query,
    });
  });

  it('gets a public vacancy by id', async () => {
    const vacancy = createPublicVacancy();
    apiMocks.request.mockResolvedValue(vacancy);

    await expect(getPublicJobVacancy('vacancy-1')).resolves.toEqual(vacancy);
    expect(apiMocks.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/employability/vacancies/vacancy-1/public',
    });
  });

  it('submits the application FormData to the public endpoint', async () => {
    const form = new FormData();
    const response = createApplyResponse();
    apiMocks.request.mockResolvedValue(response);

    await expect(applyJobVacancy(form)).resolves.toEqual(response);
    expect(apiMocks.request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/employability/apply',
      data: form,
    });
  });
});
