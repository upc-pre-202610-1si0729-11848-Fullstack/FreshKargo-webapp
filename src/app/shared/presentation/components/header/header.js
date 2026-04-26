import { loadTemplate } from '../../../infrastructure/template-loader.js';
import { landingStore } from '../../../../landing/application/landing.store.js';
import { renderLanguageSwitcher, bindLanguageSwitcher } from '../language-switcher/language-switcher.js';
import { applyTranslations } from '../../../infrastructure/i18n/i18n.service.js';

const templatePath = '/src/app/shared/presentation/components/header/header.html';

export async function renderHeader() {
  const html = await loadTemplate(templatePath);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  const header = wrapper.firstElementChild;

  const nav = header.querySelector('[data-nav-links]');
  nav.innerHTML = landingStore.navLinks
    .map((link) => `<a href="${link.href}" data-i18n="${link.labelKey}">${link.labelKey}</a>`)
    .join('');

  header.querySelector('[data-language-switcher]').innerHTML = await renderLanguageSwitcher();
  applyTranslations(header);
  return header.outerHTML;
}

export function bindHeader(root = document) {
  const header = root.querySelector('.site-header');
  if (!header) return;
  const nav = header.querySelector('.main-nav');
  const toggle = header.querySelector('.menu-toggle');

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  bindLanguageSwitcher(header);
}
