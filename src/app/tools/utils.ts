export const ARLAS_ROLE_PREFIX = 'role/arlas';

export function saveState(key: string, value: boolean): void {
  window.localStorage.setItem(key, value ? 'true' : 'false');
}

export function getState(key: string): boolean {
  return window.localStorage.getItem(key) === 'true';
}

export function getPrivateOrgDisplayName(userEmail: string): string {
  return userEmail.split('@')[0];
}
