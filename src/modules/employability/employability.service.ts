import type { PaginationMeta } from '@bopacorp/shared/common';
import type {
  ApplyJobVacancyRequest,
  JobVacancyResponse,
  JobVacancyListItemResponse,
  ListJobVacanciesQuery,
} from '@bopacorp/shared/employability';
import { request, requestPaginated } from '@/services/api.js';
import type { ApplyJobVacancyResponse } from './employability.types.js';

export function listPublishedVacancies(query: ListJobVacanciesQuery) {
  return requestPaginated<JobVacancyListItemResponse, PaginationMeta>({
    method: 'GET',
    url: '/employability/vacancies/published',
    params: query,
  });
}

export function getPublicJobVacancy(id: string) {
  return request<JobVacancyResponse>({
    method: 'GET',
    url: `/employability/vacancies/${id}/public`,
  });
}

export function applyJobVacancy(form: FormData) {
  return request<ApplyJobVacancyResponse>({
    method: 'POST',
    url: '/employability/apply',
    data: form,
  });
}

export type { ApplyJobVacancyRequest };
