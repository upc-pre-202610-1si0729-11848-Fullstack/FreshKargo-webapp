import { renderHeader, bindHeader } from './shared/presentation/components/header/header.js';
import { renderFooter } from './shared/presentation/components/footer/footer.js';
import { renderLandingPage } from './landing/presentation/pages/landing-page/landing-page.js';
import { initI18n, applyTranslations } from './shared/infrastructure/i18n/i18n.service.js';
import { bindSmoothAnchors } from './shared/infrastructure/dom.js';
import { bindContactForm } from './landing/presentation/sections/contact/contact.js';

export async function bootstrapFreshKargo() {
  await initI18n();
  const app = document.querySelector('#app');

  async function renderApp() {
    app.innerHTML = `
      ${await renderHeader()}
      ${await renderLandingPage()}
      ${await renderFooter()}
    `;
    applyTranslations(app);
    bindHeader(app);
    bindContactForm(app);
    bindSmoothAnchors(app);
  }

  await renderApp();

  window.addEventListener('freshkargo:language-changed', async () => {
    await renderApp();
  });
}
