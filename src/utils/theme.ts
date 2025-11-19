// src/utils/theme.ts
export type ThemeMode = 'light' | 'dark' | 'hc' | 'auto';
const STORAGE_KEY = 'ui.theme';

export function setTheme(mode: ThemeMode = 'auto') {
  const html = document.documentElement;
  if (mode === 'auto') {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', mode);
  }
  localStorage.setItem(STORAGE_KEY, mode);
}

export function getTheme(): ThemeMode {
  return (localStorage.getItem(STORAGE_KEY) as ThemeMode) ?? 'auto';
}

export function initTheme() {
  setTheme(getTheme());
}
