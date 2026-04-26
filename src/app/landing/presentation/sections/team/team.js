import { loadTemplate } from '../../../../shared/infrastructure/template-loader.js';
import { applyTranslations } from '../../../../shared/infrastructure/i18n/i18n.service.js';
import { landingStore } from '../../../application/landing.store.js';

const templatePath = '/src/app/landing/presentation/sections/team/team.html';

function buildTeamCard(member) {
  return `
    <article class="team-card">
      <h3>${member.name}</h3>
      <p>${member.role}</p>
      <img src="${member.image}" alt="${member.name} profile placeholder" />
    </article>
  `;
}

export async function renderTeam() {
  const html = await loadTemplate(templatePath);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  wrapper.querySelector('[data-team-list]').innerHTML = landingStore.teamMembers.map(buildTeamCard).join('');
  applyTranslations(wrapper);
  return wrapper.innerHTML;
}
