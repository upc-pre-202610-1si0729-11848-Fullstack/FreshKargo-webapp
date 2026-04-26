import { loadTemplate } from '../../../../shared/infrastructure/template-loader.js';
import { applyTranslations, translate } from '../../../../shared/infrastructure/i18n/i18n.service.js';
import { landingStore } from '../../../application/landing.store.js';

const templatePath = '/src/app/landing/presentation/sections/how-it-works/how-it-works.html';

function buildStep(step) {
  return `
    <article class="step-card">
      <span class="step-number">${step.number}</span>
      <h3>${translate(`how.${step.key}.title`)}</h3>
      <p>${translate(`how.${step.key}.desc`)}</p>
    </article>
  `;
}

export async function renderHowItWorks() {
  const html = await loadTemplate(templatePath);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  wrapper.querySelector('[data-steps-list]').innerHTML = landingStore.steps.map(buildStep).join('');
  applyTranslations(wrapper);
  return wrapper.innerHTML;
}
