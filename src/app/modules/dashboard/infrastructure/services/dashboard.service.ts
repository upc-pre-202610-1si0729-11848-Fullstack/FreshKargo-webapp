import { Injectable } from '@angular/core';
import { DashboardOperationsChart } from '../../domain/model/dashboard-chart.entity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryProduct } from '../../../inventory/domain/model/product.entity';
import { Shipment } from '../../../shipments/domain/model/shipment.entity';
import { environment } from '../../../../../environments/environment';

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly productsUrl = `${environment.apiBaseUrl}/products`;
  private readonly shipmentsUrl = `${environment.apiBaseUrl}/shipments`;
  private readonly warehousesUrl = `${environment.apiBaseUrl}/warehouses`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<InventoryProduct[]> {
    return this.http.get<InventoryProduct[]>(this.productsUrl);
  }

  getShipments(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(this.shipmentsUrl);
  }

  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.warehousesUrl);
  }

  getOperationsChart(shipments: Shipment[]): DashboardOperationsChart {
    const delivered = shipments.filter((shipment) => shipment.status === 'Delivered').length;

    const inTransit = shipments.filter((shipment) => shipment.status === 'In Transit').length;

    const delayed = shipments.filter((shipment) => shipment.status === 'Delayed').length;

    const loading = shipments.filter((shipment) => shipment.status === 'Loading').length;

    const rejected = shipments.filter((shipment) => shipment.status === 'Rejected').length;

    return {
      type: 'line',

      data: {
        labels: ['Delivered', 'In Transit', 'Delayed', 'Loading', 'Rejected'],
        datasets: [
          {
            data: [delivered, inTransit, delayed, loading, rejected],
            label: 'Shipment Status',
            fill: true,
            tension: 0.4,
            borderColor: '#3f51b5',
            backgroundColor: 'rgba(63, 81, 181, 0.18)',
            pointBackgroundColor: '#3f51b5',
            pointBorderColor: '#3f51b5',
            pointRadius: 5,
            pointHoverRadius: 6,
            borderWidth: 4,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          x: {
            grid: {
              color: 'rgba(148, 163, 184, 0.18)',
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 13,
              },
            },
          },

          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: '#64748b',
              font: {
                size: 13,
              },
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.18)',
            },
          },
        },
      },
    };
  }
}
