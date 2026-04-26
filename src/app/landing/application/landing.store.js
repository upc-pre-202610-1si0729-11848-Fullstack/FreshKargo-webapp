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
      'Hasta 5 unidades/logística básica',
      'Monitoreo básico',
      'Control de temperatura',
      'Reportes mensuales',
      'Soporte por correo'
    ]),
    createPricingPlan('professional', '$799', [
      'Hasta 25 vehículos',
      'Rastreo GPS en tiempo real',
      'Analítica avanzada + IA',
      'Optimización de rutas',
      'Integraciones API',
      'Soporte prioritario 24/7'
    ], true),
    createPricingPlan('enterprise', 'custom', [
      'Operación escalable',
      'Módulos personalizados',
      'SLA garantizado',
      'Gestor de cuenta dedicado',
      'Capacitación especializada',
      'Infraestructura dedicada'
    ])
  ],
  teamMembers: [
    createTeamMember('Josue R', 'Frontend Developer'),
    createTeamMember('Jennifer Riveros', 'Frontend Developer'),
    createTeamMember('Rodrigo Velasquez', 'Frontend Developer'),
    createTeamMember('Rodrigo Saavedra', 'Frontend Developer'),
    createTeamMember('Rodrigo Saavedra', 'Frontend Developer')
  ]
};
