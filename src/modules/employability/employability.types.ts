import type { ApplyJobVacancyRequest } from '@bopacorp/shared/employability';

export type ApplyCandidatePayload = ApplyJobVacancyRequest['candidate'];

export interface ApplyVacancyMeta {
  vacancyId: string;
  vacancyTitle: string;
}

export interface ApplyJobVacancyResponse {
  id: string;
  state: 'DRAFT' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string | null;
  candidate: { id: string; firstName: string; lastName: string; email: string };
  vacancy: { id: string; title: string };
}

export type ApplyState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; data: ApplyJobVacancyResponse }
  | {
      kind: 'error';
      code: string;
      message: string;
      details?: Array<{ field: string; message: string }>;
    };
