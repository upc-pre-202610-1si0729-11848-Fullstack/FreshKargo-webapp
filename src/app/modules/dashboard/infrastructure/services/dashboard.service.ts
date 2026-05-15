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

}
