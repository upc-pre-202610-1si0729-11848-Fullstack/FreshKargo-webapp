import { ChartConfiguration, ChartOptions } from 'chart.js';

export interface DashboardOperationsChart {
  type: 'line';
  data: ChartConfiguration<'line'>['data'];
  options: ChartOptions<'line'>;
}
