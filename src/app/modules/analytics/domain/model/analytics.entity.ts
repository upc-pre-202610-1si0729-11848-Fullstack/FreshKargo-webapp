import { ChartConfiguration, ChartOptions } from 'chart.js';

export interface AnalyticsKpi {
  title: string;
  value: string;
  change: string;
  icon: string;
}

export interface SpoilageTrendItem {
  month: string;
  units: string;
  width: number;
}

export interface ShipmentCategory {
  count: number;
  name: string;
  percent: string;
  tone: string;
}

export interface WarehousePerformance {
  warehouse: string;
  onTime: string;
  accuracy: string;
  compliance: string;
  waste: string;
  type: string;
}

export interface SupplierPerformance {
  name: string;
  rating: string;
  onTime: string;
  quality: string;
}

export interface AnalyticsCharts {
  performanceChartType: 'bar';
  performanceChartData: ChartConfiguration<'bar'>['data'];
  performanceChartOptions: ChartOptions<'bar'>;

  temperatureChartType: 'doughnut';
  temperatureChartData: ChartConfiguration<'doughnut'>['data'];
  temperatureChartOptions: ChartOptions<'doughnut'>;
}
