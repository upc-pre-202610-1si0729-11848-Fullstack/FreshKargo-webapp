import { loadTemplate } from '../../../../shared/infrastructure/template-loader.js';
import { applyTranslations, translate } from '../../../../shared/infrastructure/i18n/i18n.service.js';
import { landingStore } from '../../../application/landing.store.js';

const templatePath = '/src/app/landing/presentation/sections/services/services.html';

function buildServiceCard(service) {
  return `
    <article class="service-card ${service.highlighted ? 'is-highlighted' : ''}">
      <h3>${translate(`services.${service.key}.title`)}</h3>
      <p>${translate(`services.${service.key}.desc`)}</p>
    </article>
  `;
}

export async function renderServices() {
  const html = await loadTemplate(templatePath);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  wrapper.querySelector('[data-services-list]').innerHTML = landingStore.services.map(buildServiceCard).join('');
  applyTranslations(wrapper);
  return wrapper.innerHTML;
}
