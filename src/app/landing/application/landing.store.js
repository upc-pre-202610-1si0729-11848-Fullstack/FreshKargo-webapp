import { createServiceItem } from '../domain/model/service-item.entity.js';
import { createProcessStep } from '../domain/model/process-step.entity.js';
import { createPricingPlan } from '../domain/model/pricing-plan.entity.js';
import { createTeamMember } from '../domain/model/team-member.entity.js';

export const landingStore = {
  navLinks: [
    { labelKey: 'nav.services', href: '#services' },
    { labelKey: 'nav.how', href: '#how-it-works' },
    { labelKey: 'nav.pricing', href: '#pricing' },
    { labelKey: 'nav.team', href: '#team' },
    { labelKey: 'nav.benefits', href: '#benefits' }
  ],
  services: [
    createServiceItem('temperature', '🌡️', false),
    createServiceItem('gps', '📍', true),
    createServiceItem('analytics', '📊', false),
    createServiceItem('inventory', '📦', true),
    createServiceItem('restock', '🔄', false),
    createServiceItem('dispatch', '⏱️', true)
  ],
  steps: [
    createProcessStep(1, 'step1'),
    createProcessStep(2, 'step2'),
    createProcessStep(3, 'step3'),
    createProcessStep(4, 'step4')
  ],
  plans: [
    createPricingPlan('basic', '$299', [
      'pricing.basic.f1',
      'pricing.basic.f2',
      'pricing.basic.f3',
      'pricing.basic.f4',
      'pricing.basic.f5'
    ]),
    createPricingPlan('professional', '$799', [
      'pricing.pro.f1',
      'pricing.pro.f2',
      'pricing.pro.f3',
      'pricing.pro.f4',
      'pricing.pro.f5',
      'pricing.pro.f6'
    ], true),
    createPricingPlan('enterprise', 'custom', [
      'pricing.ent.f1',
      'pricing.ent.f2',
      'pricing.ent.f3',
      'pricing.ent.f4',
      'pricing.ent.f5',
      'pricing.ent.f6'
    ])
  ],
  teamMembers: [
    createTeamMember('Josué Carpio', '', 'src/assets/images/Josue.png'),
    createTeamMember('Jennifer Riveros', '', 'src/assets/images/Jennifer.jpeg'),
    createTeamMember('Felix', '', 'src/assets/images/Felix.jpeg'),
    createTeamMember('Rodrigo', '', 'src/assets/images/Rodrigo.jpeg'),
    createTeamMember('Andree', '', 'src/assets/images/Andree.jpeg')
  ]
};
