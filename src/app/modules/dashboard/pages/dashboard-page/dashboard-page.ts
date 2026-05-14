import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { StatsCard } from '../../../../shared/components/stats-card/stats-card';
import { DashboardService, Warehouse } from '../../infrastructure/services/dashboard.service';

import { InventoryProduct } from '../../../inventory/domain/model/product.entity';
import { Shipment } from '../../../shipments/domain/model/shipment.entity';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, StatsCard],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  products: InventoryProduct[] = [];
  shipments: Shipment[] = [];
  warehouses: Warehouse[] = [];
  recentShipments: Shipment[] = [];
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

  private loadDashboardData(): void {
    forkJoin({
      products: this.dashboardService.getProducts(),
      shipments: this.dashboardService.getShipments(),
      warehouses: this.dashboardService.getWarehouses(),
    }).subscribe({
      next: ({ products, shipments, warehouses }) => {
        this.products = products;
        this.shipments = shipments;
        this.recentShipments = shipments.slice(0, 4);
        this.warehouses = warehouses;

        this.calculateMetrics();
        this.buildOperationsChart();
        this.cdr.detectChanges();
      },
    });
  }

  private calculateMetrics(): void {
    const totalUnits = this.products.reduce((total, product) => total + Number(product.stock), 0);
    const healthyProducts = this.products.filter((product) => product.status === 'Good').length;

    const healthPercent =
      this.products.length === 0 ? 0 : (healthyProducts / this.products.length) * 100;

    this.inventoryHealth = `${healthPercent.toFixed(1)}%`;
    this.buildCategorySummary();
    this.buildWarehousePerformance();
    this.buildOperationalAlerts();

    this.activeShipments = this.shipments
      .filter((shipment) => shipment.status !== 'Delivered')
      .length.toString();

    this.spoilageRiskItems = this.products
      .filter(
        (product) =>
          product.status === 'Critical' ||
          product.status === 'Expiring Soon' ||
          product.status === 'Low Stock' ||
          product.stock <= product.minStock,
      )
      .length.toString();

    const coldSafeProducts = this.products.filter(
      (product) => this.getTemperatureValue(product.temperature) <= 6,
    ).length;

    const compliance =
      this.products.length === 0 ? 0 : (coldSafeProducts / this.products.length) * 100;

    this.coldChainCompliance = `${compliance.toFixed(1)}%`;
  }
  private buildCategorySummary(): void {
    const totalUnits = this.products.reduce((total, product) => total + Number(product.stock), 0);

    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Frozen', 'Ready-to-ship'];

    const classMap: Record<string, string> = {
      Fruits: 'fill-1',
      Vegetables: 'fill-2',
      Dairy: 'fill-3',
      Frozen: 'fill-4',
      'Ready-to-ship': 'fill-5',
    };

    const grouped = this.products.reduce(
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
      const warehouseProducts = this.products.filter(
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
      const warehouseShipments = this.shipments.filter((shipment) =>
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
    const temperatureAlerts = this.products
      .filter((product) => this.getTemperatureValue(product.temperature) > 6)
      .slice(0, 1)
      .map((product) => ({
        title: 'Temperature deviation detected',
        description: `Product: ${product.name}`,
        detail: `Warehouse: ${product.warehouse} • ${product.temperature}`,
        severity: 'High',
        className: 'high',
      }));

    const delayedShipmentAlerts = this.shipments
      .filter((shipment) => shipment.status === 'Delayed')
      .slice(0, 1)
      .map((shipment) => ({
        title: 'Delayed shipment',
        description: `Route: ${shipment.route}`,
        detail: `ETA: ${shipment.eta}`,
        severity: 'Medium',
        className: 'medium',
      }));

    const lowStockAlerts = this.products
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
    const delivered = this.shipments.filter((shipment) => shipment.status === 'Delivered').length;

    const inTransit = this.shipments.filter((shipment) => shipment.status === 'In Transit').length;

    const delayed = this.shipments.filter((shipment) => shipment.status === 'Delayed').length;

    const loading = this.shipments.filter((shipment) => shipment.status === 'Loading').length;

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

  private getTemperatureValue(temperature: string): number {
    const value = Number(String(temperature).replace('°C', '').trim());

    return Number.isNaN(value) ? 0 : value;
  }
}
