const STORAGE_KEY = 'freshkargo-language';
const SUPPORTED_LANGUAGES = ['en', 'es'];
let currentLanguage = localStorage.getItem(STORAGE_KEY) || 'en';
let translations = {};

export async function initI18n() {
  await setLanguage(currentLanguage);
}

export async function setLanguage(language) {
  currentLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'en';
  localStorage.setItem(STORAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage;
  const response = await fetch(`/i18n/${currentLanguage}.json`);
  translations = await response.json();
  applyTranslations();
  window.dispatchEvent(new CustomEvent('freshkargo:language-changed', { detail: { language: currentLanguage } }));
}

export function getLanguage() {
  return currentLanguage;
}

export function translate(key) {
  return translations[key] || key;
}

export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', translate(element.dataset.i18nPlaceholder));
  });
  root.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', translate(element.dataset.i18nAria));
  });
}
