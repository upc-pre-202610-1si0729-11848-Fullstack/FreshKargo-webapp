import { loadTemplate } from '../../../../shared/infrastructure/template-loader.js';
import { renderHero } from '../../sections/hero/hero.js';
import { renderServices } from '../../sections/services/services.js';
import { renderHowItWorks } from '../../sections/how-it-works/how-it-works.js';
import { renderPricing } from '../../sections/pricing/pricing.js';
import { renderTeam } from '../../sections/team/team.js';
import { renderContact } from '../../sections/contact/contact.js';
import { renderFinalCta } from '../../sections/final-cta/final-cta.js';

const templatePath = '/src/app/landing/presentation/pages/landing-page/landing-page.html';

export async function renderLandingPage() {
  const html = await loadTemplate(templatePath);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  wrapper.querySelector('[data-section="hero"]').innerHTML = await renderHero();
  wrapper.querySelector('[data-section="services"]').innerHTML = await renderServices();
  wrapper.querySelector('[data-section="how-it-works"]').innerHTML = await renderHowItWorks();
  wrapper.querySelector('[data-section="pricing"]').innerHTML = await renderPricing();
  wrapper.querySelector('[data-section="team"]').innerHTML = await renderTeam();
  wrapper.querySelector('[data-section="contact"]').innerHTML = await renderContact();
  wrapper.querySelector('[data-section="final-cta"]').innerHTML = await renderFinalCta();
  return wrapper.innerHTML;
}
