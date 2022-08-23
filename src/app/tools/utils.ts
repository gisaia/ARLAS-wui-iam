export function saveState(key: string, value: boolean): void {
  window.localStorage.setItem(key, value ? 'true' : 'false');
}

export function getState(key: string): boolean {
  return window.localStorage.getItem(key) === 'true';
}
