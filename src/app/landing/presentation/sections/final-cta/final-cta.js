import { loadTemplate } from '../../../../shared/infrastructure/template-loader.js';
import { applyTranslations } from '../../../../shared/infrastructure/i18n/i18n.service.js';

const templatePath = '/src/app/landing/presentation/sections/final-cta/final-cta.html';

export async function renderFinalCta() {
  const html = await loadTemplate(templatePath);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  applyTranslations(wrapper);
  return wrapper.innerHTML;
}
