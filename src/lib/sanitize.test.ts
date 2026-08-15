import { describe, expect, it } from 'vitest';
import { sanitizeHtml } from './sanitize.js';

describe('sanitizeHtml', () => {
  it('removes executable HTML payloads while preserving safe text and markup', () => {
    const dirty =
      '<p>Contenido seguro</p><script>alert(1)</script><img src="x" onerror="alert(2)"><a href="javascript:alert(3)">link</a>';

    const clean = sanitizeHtml(dirty);

    expect(clean).toContain('<p>Contenido seguro</p>');
    expect(clean).not.toContain('<script');
    expect(clean).not.toContain('onerror');
    expect(clean).not.toContain('javascript:');
  });

  it('returns an empty string for a null-like empty input', () => {
    expect(sanitizeHtml('')).toBe('');
  });
});
