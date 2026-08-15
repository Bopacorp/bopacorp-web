import { describe, expect, it } from 'vitest';
import { ApiError } from '@/services/api.js';
import { LOGIN_ERROR_KEYS } from './auth.js';
import { getErrorMessage } from './index.js';

describe('getErrorMessage', () => {
  it('maps an authentication error code to the localized message', () => {
    const error = new ApiError('INVALID_CREDENTIALS', 'invalid credentials');
    expect(getErrorMessage(error, LOGIN_ERROR_KEYS)).toBe('Correo o contraseña incorrectos.');
  });

  it('returns an Error message for unknown errors', () => {
    expect(getErrorMessage(new Error('Network unavailable'))).toBe('Network unavailable');
  });
});
