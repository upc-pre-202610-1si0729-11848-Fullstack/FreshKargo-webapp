import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  ChartConfiguration,
  ChartOptions,
  registerables
} from 'chart.js';

import {
  AnalyticsKpi,
  ShipmentCategory,
  SpoilageTrendItem,
  SupplierPerformance,
  WarehousePerformance
} from '../../domain/model/analytics.entity';

import { AnalyticsService } from '../../infrastructure/services/analytics.service';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './analytics-page.html',
  styleUrl: './analytics-page.css',
})
export class AnalyticsPage implements OnInit {

  performanceChartType: 'bar' = 'bar';

  performanceChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  performanceChartOptions: ChartOptions<'bar'> = {};

  temperatureChartType: 'doughnut' = 'doughnut';

  temperatureChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: []
  };

  temperatureChartOptions: ChartOptions<'doughnut'> = {};

  kpis: AnalyticsKpi[] = [];
  spoilageTrend: SpoilageTrendItem[] = [];
  shipmentCategories: ShipmentCategory[] = [];
  warehousePerformance: WarehousePerformance[] = [];
  suppliers: SupplierPerformance[] = [];

  constructor(
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    const charts = this.analyticsService.getCharts();

    this.performanceChartType = charts.performanceChartType;
    this.performanceChartData = charts.performanceChartData;
    this.performanceChartOptions = charts.performanceChartOptions;

    this.temperatureChartType = charts.temperatureChartType;
    this.temperatureChartData = charts.temperatureChartData;
    this.temperatureChartOptions = charts.temperatureChartOptions;

    this.kpis = this.analyticsService.getKpis();
    this.spoilageTrend = this.analyticsService.getSpoilageTrend();
    this.shipmentCategories = this.analyticsService.getShipmentCategories();
    this.warehousePerformance = this.analyticsService.getWarehousePerformance();
    this.suppliers = this.analyticsService.getSuppliers();
  }

}
