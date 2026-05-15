import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { StatsCard } from '../../../../shared/components/stats-card/stats-card';
import { DashboardService, Warehouse } from '../../infrastructure/services/dashboard.service';

import { InventoryProduct } from '../../../inventory/domain/model/product.entity';
import { Shipment } from '../../../shipments/domain/model/shipment.entity';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, StatsCard],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  products: InventoryProduct[] = [];
  shipments: Shipment[] = [];
  warehouses: Warehouse[] = [];
  recentShipments: Shipment[] = [];
  filteredRecentShipments: Shipment[] = [];
  filteredProducts: InventoryProduct[] = [];
  filteredShipments: Shipment[] = [];
  selectedShipmentFilter = 'All';
  selectedDateRange = 'Last 7 days';
  selectedWarehouseFilter = 'All warehouses';
  selectedShipment: Shipment | null = null;
  isShipmentDetailModalOpen = false;
  isAlertsModalOpen = false;
  categorySummary: {
    name: string;
    percent: number;
    className: string;
  }[] = [];

  warehousePerformance: {
    name: string;
    onTime: number;
    avgTemp: string;
    risk: string;
    statusClass: string;
  }[] = [];

  operationalAlerts: {
    title: string;
    description: string;
    detail: string;
    severity: string;
    className: string;
  }[] = [];

  isShipmentsModalOpen = false;

  inventoryHealth = '0%';
  activeShipments = '0';
  coldChainCompliance = '0%';
  spoilageRiskItems = '0';

  public operationsChartType: 'line' = 'line';

  public operationsChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  public operationsChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  openShipmentsModal(): void {
    this.isShipmentsModalOpen = true;
  }

  closeShipmentsModal(): void {
    this.isShipmentsModalOpen = false;
  }
  applyDashboardFilters(): void {
    this.filteredProducts =
      this.selectedWarehouseFilter === 'All warehouses'
        ? [...this.products]
        : this.products.filter((product) => product.warehouse === this.selectedWarehouseFilter);

    this.filteredShipments =
      this.selectedWarehouseFilter === 'All warehouses'
        ? [...this.shipments]
        : this.shipments.filter((shipment) =>
            shipment.route.includes(this.selectedWarehouseFilter),
          );

    this.recentShipments = this.filteredShipments.slice(0, 4);

    this.calculateMetrics();
    this.buildOperationsChart();
    this.applyShipmentFilter();
    this.cdr.detectChanges();
  }
  applyShipmentFilter(): void {
    if (this.selectedShipmentFilter === 'All') {
      this.filteredRecentShipments = [...this.recentShipments];
      return;
    }

    this.filteredRecentShipments = this.recentShipments.filter(
      (shipment) => shipment.status === this.selectedShipmentFilter,
    );
  }
  openShipmentDetail(shipment: Shipment): void {
    this.selectedShipment = shipment;
    this.isShipmentDetailModalOpen = true;
  }

  closeShipmentDetail(): void {
    this.selectedShipment = null;
    this.isShipmentDetailModalOpen = false;
  }
  openAlertsModal(): void {
    this.isAlertsModalOpen = true;
  }

  closeAlertsModal(): void {
    this.isAlertsModalOpen = false;
  }
  private loadDashboardData(): void {
    forkJoin({
      products: this.dashboardService.getProducts(),
      shipments: this.dashboardService.getShipments(),
      warehouses: this.dashboardService.getWarehouses(),
    }).subscribe({
      next: ({ products, shipments, warehouses }) => {
        this.products = products;
        this.shipments = shipments;
        this.warehouses = warehouses;

        this.applyDashboardFilters();
      },
    });
  }

  private calculateMetrics(): void {
    const healthyProducts = this.filteredProducts.filter(
      (product) => product.status === 'Good',
    ).length;

    const healthPercent =
      this.filteredProducts.length === 0
        ? 0
        : (healthyProducts / this.filteredProducts.length) * 100;

    this.inventoryHealth = `${healthPercent.toFixed(1)}%`;

    this.buildCategorySummary();
    this.buildWarehousePerformance();
    this.buildOperationalAlerts();

    this.activeShipments = this.filteredShipments
      .filter((shipment) => shipment.status !== 'Delivered')
      .length.toString();

    this.spoilageRiskItems = this.filteredProducts
      .filter(
        (product) =>
          product.status === 'Critical' ||
          product.status === 'Expiring Soon' ||
          product.status === 'Low Stock' ||
          product.stock <= product.minStock,
      )
      .length.toString();

    const coldSafeProducts = this.filteredProducts.filter(
      (product) => this.getTemperatureValue(product.temperature) <= 6,
    ).length;

    const compliance =
      this.filteredProducts.length === 0
        ? 0
        : (coldSafeProducts / this.filteredProducts.length) * 100;

    this.coldChainCompliance = `${compliance.toFixed(1)}%`;
  }

  private buildCategorySummary(): void {
    const totalUnits = this.filteredProducts.reduce(
      (total, product) => total + Number(product.stock),
      0,
    );

    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Frozen', 'Ready-to-ship'];

    const classMap: Record<string, string> = {
      Fruits: 'fill-1',
      Vegetables: 'fill-2',
      Dairy: 'fill-3',
      Frozen: 'fill-4',
      'Ready-to-ship': 'fill-5',
    };

    const grouped = this.filteredProducts.reduce(
      (acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + Number(product.stock);
        return acc;
      },
      {} as Record<string, number>,
    );

    this.categorySummary = categories.map((category) => {
      const units = grouped[category] || 0;

      const percent = totalUnits === 0 ? 0 : Math.round((units / totalUnits) * 100);

      return {
        name: category,
        percent,
        className: classMap[category],
      };
    });
  }

  private buildWarehousePerformance(): void {
    this.warehousePerformance = this.warehouses.map((warehouse) => {
      const warehouseProducts = this.filteredProducts.filter(
        (product) => product.warehouse === warehouse.name,
      );

      const avgTemperature =
        warehouseProducts.length === 0
          ? 0
          : warehouseProducts.reduce(
              (total, product) => total + this.getTemperatureValue(product.temperature),
              0,
            ) / warehouseProducts.length;

      const riskyProducts = warehouseProducts.filter(
        (product) =>
          product.status === 'Critical' ||
          product.status === 'Expiring Soon' ||
          product.status === 'Low Stock' ||
          product.stock <= product.minStock,
      ).length;

      const risk = riskyProducts >= 2 ? 'Medium' : 'Low';

      const warehouseShipments = this.filteredShipments.filter((shipment) =>
        shipment.route.includes(warehouse.name),
      );

      const deliveredShipments = warehouseShipments.filter(
        (shipment) => shipment.status === 'Delivered',
      ).length;

      const delayedShipments = warehouseShipments.filter(
        (shipment) => shipment.status === 'Delayed',
      ).length;

      const totalShipments = warehouseShipments.length;

      const onTimeRate = totalShipments === 0 ? 100 : (deliveredShipments / totalShipments) * 100;

      const adjustedOnTime = Math.max(70, onTimeRate - delayedShipments * 5);

      return {
        name: warehouse.name,
        onTime: Number(adjustedOnTime.toFixed(0)),
        avgTemp: `${avgTemperature.toFixed(0)}°C`,
        risk,
        statusClass: risk === 'Medium' ? 'yellow-status' : 'green-status',
      };
    });
  }

  private buildOperationalAlerts(): void {
    const temperatureAlerts = this.filteredProducts
      .filter((product) => this.getTemperatureValue(product.temperature) > 6)
      .slice(0, 1)
      .map((product) => ({
        title: 'Temperature deviation detected',
        description: `Product: ${product.name}`,
        detail: `Warehouse: ${product.warehouse} • ${product.temperature}`,
        severity: 'High',
        className: 'high',
      }));

    const delayedShipmentAlerts = this.filteredShipments
      .filter((shipment) => shipment.status === 'Delayed')
      .slice(0, 1)
      .map((shipment) => ({
        title: 'Delayed shipment',
        description: `Route: ${shipment.route}`,
        detail: `ETA: ${shipment.eta}`,
        severity: 'Medium',
        className: 'medium',
      }));

    const lowStockAlerts = this.filteredProducts
      .filter((product) => product.status === 'Low Stock' || product.stock <= product.minStock)
      .slice(0, 1)
      .map((product) => ({
        title: 'Low stock warning',
        description: `Product: ${product.name}`,
        detail: `Available units: ${product.stock}`,
        severity: 'Attention',
        className: 'attention',
      }));

    this.operationalAlerts = [...temperatureAlerts, ...delayedShipmentAlerts, ...lowStockAlerts];
  }

  private buildOperationsChart(): void {
    const delivered = this.filteredShipments.filter(
      (shipment) => shipment.status === 'Delivered',
    ).length;

    const inTransit = this.filteredShipments.filter(
      (shipment) => shipment.status === 'In Transit',
    ).length;

    const delayed = this.filteredShipments.filter(
      (shipment) => shipment.status === 'Delayed',
    ).length;

    const loading = this.filteredShipments.filter(
      (shipment) => shipment.status === 'Loading',
    ).length;

    this.operationsChartData = {
      labels: ['Delivered', 'In Transit', 'Delayed', 'Loading'],
      datasets: [
        {
          data: [delivered, inTransit, delayed, loading],
          label: 'Shipments',
          fill: true,
          tension: 0.4,
          borderColor: '#3f51b5',
          backgroundColor: 'rgba(63, 81, 181, 0.16)',
          pointBackgroundColor: '#3f51b5',
          pointBorderColor: '#3f51b5',
          borderWidth: 4,
        },
      ],
    };
  }

  exportDashboardReport(): void {
    const headers = ['Section', 'Metric', 'Value'];

    const rows = [
      ['Summary', 'Inventory Health', this.inventoryHealth],
      ['Summary', 'Active Shipments', this.activeShipments],
      ['Summary', 'Cold Chain Compliance', this.coldChainCompliance],
      ['Summary', 'Spoilage Risk Items', this.spoilageRiskItems],
      ['Summary', 'Total Products', this.products.length.toString()],
      ['Summary', 'Total Shipments', this.shipments.length.toString()],
      ['Summary', 'Total Warehouses', this.warehouses.length.toString()],
      ...this.categorySummary.map((category) => [
        'Inventory by Category',
        category.name,
        `${category.percent}%`,
      ]),
      ...this.warehousePerformance.map((warehouse) => [
        'Warehouse Performance',
        warehouse.name,
        `On-time ${warehouse.onTime}% | Avg temp ${warehouse.avgTemp} | Risk ${warehouse.risk}`,
      ]),
      ...this.operationalAlerts.map((alert) => [
        'Operational Alerts',
        alert.title,
        `${alert.description} | ${alert.detail} | ${alert.severity}`,
      ]),
    ];

    const csvContent = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'dashboard-report.csv');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  }
  private getTemperatureValue(temperature: string): number {
    const value = Number(String(temperature).replace('°C', '').trim());

    return Number.isNaN(value) ? 0 : value;
  }
}
