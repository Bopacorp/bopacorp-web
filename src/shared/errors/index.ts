import i18n from '@/i18n/index.js';
import { ApiError } from '@/services/api.js';

const GENERIC_KEYS: Record<string, string> = {
  UNAUTHORIZED: 'error.unauthorized',
  FORBIDDEN: 'error.forbidden',
  RESOURCE_NOT_FOUND: 'error.notFound',
  CONFLICT: 'error.conflict',
  VALIDATION_ERROR: 'error.validation',
  BAD_REQUEST: 'error.badRequest',
  INTERNAL_ERROR: 'error.generic',
  ROUTE_NOT_FOUND: 'error.routeNotFound',
};

export function getErrorMessage(error: unknown, overrideKeys?: Record<string, string>): string {
  if (error instanceof ApiError) {
    const key = overrideKeys?.[error.code] ?? GENERIC_KEYS[error.code];
    if (key) return i18n.t(key);
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return i18n.t('error.generic');
}

export function getErrorCode(error: unknown): string | undefined {
  if (error instanceof ApiError) return error.code;
  return undefined;
}
