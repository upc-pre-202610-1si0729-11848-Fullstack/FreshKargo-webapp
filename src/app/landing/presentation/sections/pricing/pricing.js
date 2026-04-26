import { loadTemplate } from '../../../../shared/infrastructure/template-loader.js';
import { applyTranslations, translate } from '../../../../shared/infrastructure/i18n/i18n.service.js';
import { landingStore } from '../../../application/landing.store.js';

const templatePath = '/src/app/landing/presentation/sections/pricing/pricing.html';

function getPlanButton(plan) {
  return plan.key === 'enterprise' ? translate('pricing.contact') : translate('pricing.start');
}

function getPlanPrice(plan) {
  if (plan.price === 'custom') {
    return `<strong>${translate('pricing.custom')}</strong>`;
  }
  return `<span>${translate('pricing.from')}</span><strong>${plan.price}</strong><span>/mes</span>`;
}

function buildPlan(plan) {
  return `
    <article class="plan-card ${plan.highlighted ? 'is-highlighted' : ''}">
      ${plan.highlighted ? `<span class="plan-badge">${translate('pricing.popular')}</span>` : ''}
      <h3 class="plan-name">${translate(`pricing.${plan.key}.name`)}</h3>
      <p class="plan-segment">${translate(`pricing.${plan.key}.segment`)}</p>
      <div class="plan-price">${getPlanPrice(plan)}</div>
      <ul class="plan-features">
        ${plan.features.map((feature) => `<li>${feature}</li>`).join('')}
      </ul>
      <a class="plan-button" href="#contact">${getPlanButton(plan)}</a>
    </article>
  `;
}

export async function renderPricing() {
  const html = await loadTemplate(templatePath);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  wrapper.querySelector('[data-pricing-list]').innerHTML = landingStore.plans.map(buildPlan).join('');
  applyTranslations(wrapper);
  return wrapper.innerHTML;
}
