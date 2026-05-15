import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';

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

import { AnalyticsService, Warehouse } from '../../infrastructure/services/analytics.service';
import { InventoryProduct } from '../../../inventory/domain/model/product.entity';
import { Shipment } from '../../../shipments/domain/model/shipment.entity';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './analytics-page.html',
  styleUrl: './analytics-page.css',
})
export class AnalyticsPage implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  products: InventoryProduct[] = [];
  shipments: Shipment[] = [];
  warehouses: Warehouse[] = [];
  performanceChartType: 'bar' | 'line' = 'bar';

  performanceChartData: ChartConfiguration<'bar' | 'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  performanceChartOptions: ChartOptions<'bar' | 'line'> = {};

  temperatureChartType: 'doughnut' = 'doughnut';

  temperatureChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [],
  };

  temperatureChartOptions: ChartOptions<'doughnut'> = {};

  kpis: AnalyticsKpi[] = [];
  spoilageTrend: SpoilageTrendItem[] = [];
  shipmentCategories: ShipmentCategory[] = [];
  warehousePerformance: WarehousePerformance[] = [];
  suppliers: SupplierPerformance[] = [];
  activePeriod: 'today' | 'weekly' | 'monthly' | 'quarterly' = 'today';

  withinRangeCount = 0;
  minorDeviationCount = 0;
  criticalDeviationCount = 0;
  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAnalyticsData();
  }
  setActivePeriod(period: 'today' | 'weekly' | 'monthly' | 'quarterly'): void {
    this.activePeriod = period;
  }

  exportAnalytics(): void {
    const content = [['Metric', 'Value'], ...this.kpis.map((kpi) => [kpi.title, kpi.value])];

    const csv = content.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'freshkargo-analytics.csv';
    link.click();

    URL.revokeObjectURL(url);
  }
  private loadAnalyticsData(): void {
    combineLatest({
      products: this.analyticsService.getProducts(),
      shipments: this.analyticsService.getShipments(),
      warehouses: this.analyticsService.getWarehouses(),
    }).subscribe({
      next: ({ products, shipments, warehouses }) => {
        this.products = products;
        this.shipments = shipments;
        this.warehouses = warehouses;

        this.buildKpis();
        this.buildShipmentCategories();
        this.buildTemperatureChart();
        this.buildPerformanceChart();
        this.buildSpoilageTrend();
        this.buildWarehousePerformance();
        this.buildSuppliers();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.chart?.update();
        });
      },
    });
  }
  private buildKpis(): void {
    const delivered = this.shipments.filter((shipment) => shipment.status === 'Delivered').length;

    const onTimeRate = this.shipments.length === 0 ? 0 : (delivered / this.shipments.length) * 100;

    const goodProducts = this.products.filter((product) => product.status === 'Good').length;

    const inventoryAccuracy =
      this.products.length === 0 ? 0 : (goodProducts / this.products.length) * 100;

    const coldSafeProducts = this.products.filter(
      (product) => this.getTemperatureValue(product.temperature) <= 6,
    ).length;

    const coldCompliance =
      this.products.length === 0 ? 0 : (coldSafeProducts / this.products.length) * 100;

    const riskyProducts = this.products.filter(
      (product) =>
        product.status === 'Critical' ||
        product.status === 'Expiring Soon' ||
        product.status === 'Low Stock' ||
        product.stock <= product.minStock,
    ).length;

    const wasteReduction =
      this.products.length === 0 ? 0 : 100 - (riskyProducts / this.products.length) * 100;

    this.kpis = [
      {
        title: 'On-Time Delivery Rate',
        value: `${onTimeRate.toFixed(1)}%`,
        change: 'Based on delivered shipments',
        icon: 'local_shipping',
      },
      {
        title: 'Inventory Accuracy',
        value: `${inventoryAccuracy.toFixed(1)}%`,
        change: 'Based on healthy products',
        icon: 'inventory_2',
      },
      {
        title: 'Cold Chain Compliance',
        value: `${coldCompliance.toFixed(1)}%`,
        change: 'Products within temperature range',
        icon: 'device_thermostat',
      },
      {
        title: 'Waste Reduction',
        value: `${wasteReduction.toFixed(1)}%`,
        change: 'Based on low-risk inventory',
        icon: 'trending_up',
      },
    ];
  }
  private buildSpoilageTrend(): void {
    const riskyProducts = this.products.filter(
      (product) =>
        product.status === 'Critical' ||
        product.status === 'Expiring Soon' ||
        product.status === 'Low Stock' ||
        product.stock <= product.minStock,
    );

    const totalRiskUnits = riskyProducts.reduce(
      (total, product) => total + Number(product.stock),
      0,
    );

    const months = [
      { month: 'January', multiplier: 1 },
      { month: 'February', multiplier: 0.85 },
      { month: 'March', multiplier: 0.7 },
      { month: 'April', multiplier: 0.55 },
    ];

    const maxUnits = Math.max(totalRiskUnits, 1);

    this.spoilageTrend = months.map((item) => {
      const units = Math.round(totalRiskUnits * item.multiplier);

      return {
        month: item.month,
        units: `${units} units`,
        width: Math.max(12, (units / maxUnits) * 100),
      };
    });
  }
  private buildShipmentCategories(): void {
    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Frozen', 'Ready-to-ship'];

    const grouped = this.products.reduce(
      (acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + Number(product.stock);
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalUnits = this.products.reduce((total, product) => total + Number(product.stock), 0);

    this.shipmentCategories = categories.map((category, index) => {
      const count = grouped[category] || 0;

      const percent = totalUnits === 0 ? 0 : (count / totalUnits) * 100;

      return {
        count,
        name: category,
        percent: `${percent.toFixed(1)}%`,
        tone: index < 2 ? 'dark' : index === 2 ? 'light' : 'gray',
      };
    });
  }

  private buildTemperatureChart(): void {
    this.withinRangeCount = this.products.filter(
      (product) => this.getTemperatureValue(product.temperature) <= 6,
    ).length;

    this.minorDeviationCount = this.products.filter(
      (product) =>
        this.getTemperatureValue(product.temperature) > 6 &&
        this.getTemperatureValue(product.temperature) <= 10,
    ).length;

    this.criticalDeviationCount = this.products.filter(
      (product) => this.getTemperatureValue(product.temperature) > 10,
    ).length;

    this.temperatureChartData = {
      labels: ['Within Range', 'Minor Deviation', 'Critical Deviation'],
      datasets: [
        {
          data: [this.withinRangeCount, this.minorDeviationCount, this.criticalDeviationCount],
          backgroundColor: ['#4056b4', '#f59e0b', '#ef4444'],
          borderWidth: 0,
        },
      ],
    };

    this.temperatureChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }

  private buildPerformanceChart(): void {
    const delivered = this.shipments.filter((shipment) => shipment.status === 'Delivered').length;
    const delayed = this.shipments.filter((shipment) => shipment.status === 'Delayed').length;

    const goodProducts = this.products.filter((product) => product.status === 'Good').length;

    const coldSafeProducts = this.products.filter(
      (product) => this.getTemperatureValue(product.temperature) <= 6,
    ).length;

    const onTimeRate = this.shipments.length === 0 ? 0 : (delivered / this.shipments.length) * 100;

    const inventoryAccuracy =
      this.products.length === 0 ? 0 : (goodProducts / this.products.length) * 100;

    const coldCompliance =
      this.products.length === 0 ? 0 : (coldSafeProducts / this.products.length) * 100;

    const delayPenalty = delayed * 1.5;

    this.performanceChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [
        {
          label: 'On-Time Delivery',
          data: [
            Math.max(0, onTimeRate - 10),
            Math.max(0, onTimeRate - 8),
            Math.max(0, onTimeRate - 6),
            Math.max(0, onTimeRate - 4),
            Math.max(0, onTimeRate - 3),
            Math.max(0, onTimeRate - 2),
            Math.max(0, onTimeRate - 1),
            Math.max(0, onTimeRate - delayPenalty),
          ],
          backgroundColor: '#4056b4',
          borderColor: '#4056b4',
          pointBackgroundColor: '#4056b4',
          pointBorderColor: '#4056b4',
          tension: 0.4,
          fill: false,
          borderRadius: 7,
          borderSkipped: false,
          barThickness: 22,
          maxBarThickness: 22,
        },
        {
          label: 'Inventory Accuracy',
          data: [
            Math.max(0, inventoryAccuracy - 8),
            Math.max(0, inventoryAccuracy - 6),
            Math.max(0, inventoryAccuracy - 5),
            Math.max(0, inventoryAccuracy - 3),
            Math.max(0, inventoryAccuracy - 2),
            Math.max(0, inventoryAccuracy - 1),
            inventoryAccuracy,
            inventoryAccuracy,
          ],
          backgroundColor: '#31429d',
          borderColor: '#31429d',
          pointBackgroundColor: '#31429d',
          pointBorderColor: '#31429d',
          tension: 0.4,
          fill: false,
          borderRadius: 7,
          borderSkipped: false,
          barThickness: 22,
          maxBarThickness: 22,
        },
        {
          label: 'Cold Chain Compliance',
          data: [
            Math.max(0, coldCompliance - 12),
            Math.max(0, coldCompliance - 10),
            Math.max(0, coldCompliance - 7),
            Math.max(0, coldCompliance - 5),
            Math.max(0, coldCompliance - 3),
            Math.max(0, coldCompliance - 2),
            Math.max(0, coldCompliance - 1),
            coldCompliance,
          ],
          backgroundColor: '#c7cdec',
          borderColor: '#c7cdec',
          pointBackgroundColor: '#c7cdec',
          pointBorderColor: '#c7cdec',
          tension: 0.4,
          fill: false,
          borderRadius: 7,
          borderSkipped: false,
          barThickness: 22,
          maxBarThickness: 22,
        },
      ],
    };

    this.performanceChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 12,
          right: 22,
          bottom: 6,
          left: 0,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#737373',
            font: {
              size: 13,
            },
            padding: 10,
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: '#eeeeee',
          },
          ticks: {
            color: '#737373',
            font: {
              size: 12,
            },
            stepSize: 10,
            padding: 8,
          },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          align: 'center',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 10,
            boxHeight: 10,
            padding: 26,
            color: '#737373',
            font: {
              size: 13,
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(38, 38, 38, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
        },
      },
    };
  }
  private buildWarehousePerformance(): void {
    this.warehousePerformance = this.warehouses.map((warehouse) => {
      const relatedProducts = this.products.filter(
        (product) => product.warehouse === warehouse.name,
      );

      const healthyProducts = relatedProducts.filter((product) => product.status === 'Good');

      const accuracy =
        relatedProducts.length === 0 ? 0 : (healthyProducts.length / relatedProducts.length) * 100;

      const waste =
        relatedProducts.length === 0
          ? 0
          : ((relatedProducts.length - healthyProducts.length) / relatedProducts.length) * 100;

      const type = accuracy >= 95 ? 'good' : accuracy >= 90 ? 'warning' : 'danger';

      return {
        warehouse: warehouse.name,
        onTime: `${Math.max(88, Math.round(accuracy - 1))}%`,
        accuracy: `${Math.round(accuracy)}%`,
        compliance: `${Math.min(99, Math.round(accuracy + 2))}%`,
        waste: `${waste.toFixed(1)}%`,
        type,
      };
    });
  }

  private buildSuppliers(): void {
    this.suppliers = this.analyticsService.getSuppliers();
  }
  setPerformanceChartType(type: 'bar' | 'line'): void {
    this.performanceChartType = type;
    this.buildPerformanceChart();
    setTimeout(() => {
      this.chart?.update();
    });
  }

  private getTemperatureValue(temperature: string): number {
    const value = Number(String(temperature).replace('°C', '').trim());

    return Number.isNaN(value) ? 0 : value;
  }
}
