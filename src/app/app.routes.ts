import { Routes } from '@angular/router';

import { DashboardLayout } from './layout/components/dashboard-layout/dashboard-layout';

import { DashboardPage } from './modules/dashboard/pages/dashboard-page/dashboard-page';
import { InventoryPage } from './modules/inventory/pages/inventory-page/inventory-page';
import { ShipmentsPage } from './modules/shipments/pages/shipments-page/shipments-page';
import { AnalyticsPage } from './modules/analytics/pages/analytics-page/analytics-page';

import { PlaceholderPage } from './shared/pages/placeholder-page/placeholder-page';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,

    children: [
      {
        path: '',
        component: DashboardPage,
      },

      {
        path: 'inventory',
        component: InventoryPage,
      },

      {
        path: 'shipments',
        component: ShipmentsPage,
      },

      {
        path: 'analytics',
        component: AnalyticsPage,
      },

      {
        path: 'suppliers',
        component: PlaceholderPage,
        data: { title: 'Suppliers' }
      },

      {
        path: 'alerts',
        component: PlaceholderPage,
        data: { title: 'Alerts' }
      },

      {
        path: 'users',
        component: PlaceholderPage,
        data: { title: 'Users & Roles' }
      },

      {
        path: 'integrations',
        component: PlaceholderPage,
        data: { title: 'Integrations' }
      }
    ]
  }
];
