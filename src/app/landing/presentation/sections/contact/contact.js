import { loadTemplate } from '../../../../shared/infrastructure/template-loader.js';
import { applyTranslations } from '../../../../shared/infrastructure/i18n/i18n.service.js';
import { trackEvent } from '../../../infrastructure/analytics-adapter.js';

const templatePath = '/src/app/landing/presentation/sections/contact/contact.html';

export async function renderContact() {
  const html = await loadTemplate(templatePath);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  applyTranslations(wrapper);
  return wrapper.innerHTML;
}

export function bindContactForm(root = document) {
  const form = root.querySelector('[data-demo-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    trackEvent('demo_requested', { fullName, email, phone });
    const message = encodeURIComponent(`Hola FreshKargo, soy ${fullName}. Me gustaría agendar una demo. Correo: ${email}. Teléfono: ${phone}.`);
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
  });
}
