import { loadTemplate } from '../../../infrastructure/template-loader.js';
import { getLanguage, setLanguage } from '../../../infrastructure/i18n/i18n.service.js';

const templatePath = '/src/app/shared/presentation/components/language-switcher/language-switcher.html';

export async function renderLanguageSwitcher() {
  return loadTemplate(templatePath);
}

export function bindLanguageSwitcher(root = document) {
  const switchers = root.querySelectorAll('.language-switcher');

  function refreshActiveState() {
    switchers.forEach((switcher) => {
      switcher.querySelectorAll('[data-language]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.language === getLanguage());
      });
    });
  }

  switchers.forEach((switcher) => {
    switcher.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-language]');
      if (!button) return;
      await setLanguage(button.dataset.language);
      refreshActiveState();
    });
  });

  refreshActiveState();
}
