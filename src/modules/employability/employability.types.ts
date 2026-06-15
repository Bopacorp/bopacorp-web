import type { ApplyJobVacancyRequest } from '@bopacorp/shared/employability';

export interface ApplyFormValues {
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  coverLetter: string;
}

export interface ApplyFormErrors {
  nationalId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  file?: string;
}

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

export interface ApplyValidationDetail {
  field: string;
  message: string;
}

export type ApplyState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; data: ApplyJobVacancyResponse }
  | {
      kind: 'error';
      code: string;
      message: string;
      details?: ApplyValidationDetail[];
    };
