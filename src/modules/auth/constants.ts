export const ADMIN_ROLES = ['admin', 'web-admin'] as const;

export function hasAnyAdminRole(roles: string[]): boolean {
  return roles.some((role) => ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]));
}
