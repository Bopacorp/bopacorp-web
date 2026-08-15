import type { PaginationMeta } from '@bopacorp/shared/common';
import type {
  JobVacancyListItemResponse,
  PublicJobVacancyResponse,
} from '@bopacorp/shared/employability';
import type { ApplyJobVacancyResponse } from '@/modules/employability/employability.types.js';

export function createVacancyListItem(
  overrides: Partial<JobVacancyListItemResponse> = {},
): JobVacancyListItemResponse {
  return {
    id: 'vacancy-1',
    title: 'Frontend Developer',
    isActive: true,
    isPublished: true,
    publicationDate: '2026-08-01T12:00:00.000Z',
    closingDate: '2099-12-31T23:59:59.000Z',
    creator: { id: 'creator-1', username: 'talent.admin' },
    createdAt: '2026-08-01T12:00:00.000Z',
    updatedAt: '2026-08-01T12:00:00.000Z',
    ...overrides,
  };
}

export function createPublicVacancy(
  overrides: Partial<PublicJobVacancyResponse> = {},
): PublicJobVacancyResponse {
  return {
    id: 'vacancy-1',
    title: 'Frontend Developer',
    description: 'Construye experiencias web para clientes empresariales.',
    requirements: 'React, TypeScript y experiencia con pruebas frontend.',
    publicationDate: '2026-08-01T12:00:00.000Z',
    closingDate: '2099-12-31T23:59:59.000Z',
    creator: { id: 'creator-1', username: 'talent.admin' },
    createdAt: '2026-08-01T12:00:00.000Z',
    updatedAt: '2026-08-01T12:00:00.000Z',
    ...overrides,
  };
}

export function createVacancyMeta(overrides: Partial<PaginationMeta> = {}): PaginationMeta {
  return {
    page: 1,
    limit: 10,
    totalItems: 1,
    totalPages: 1,
    ...overrides,
  };
}

export function createApplyResponse(
  overrides: Partial<ApplyJobVacancyResponse> = {},
): ApplyJobVacancyResponse {
  return {
    id: 'application-1',
    state: 'PENDING',
    appliedAt: '2026-08-15T12:00:00.000Z',
    candidate: {
      id: 'candidate-1',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@empresa.com',
    },
    vacancy: { id: 'vacancy-1', title: 'Frontend Developer' },
    ...overrides,
  };
}

export function createResumeFile(name = 'resume.pdf', type = 'application/pdf', size = 1024): File {
  const file = new File(['resume content'], name, { type });
  Object.defineProperty(file, 'size', { configurable: true, value: size });
  return file;
}
