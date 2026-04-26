import { loadTemplate } from '../../../infrastructure/template-loader.js';
import { applyTranslations } from '../../../infrastructure/i18n/i18n.service.js';

const templatePath = '/src/app/shared/presentation/components/footer/footer.html';

export async function renderFooter() {
  const html = await loadTemplate(templatePath);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  applyTranslations(wrapper);
  return wrapper.innerHTML;
}
