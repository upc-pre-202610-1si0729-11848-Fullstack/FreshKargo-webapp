import { Injectable } from '@angular/core';
import { DashboardOperationsChart } from '../../domain/model/dashboard-chart.entity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryProduct } from '../../../inventory/domain/model/product.entity';
import { Shipment } from '../../../shipments/domain/model/shipment.entity';
import { environment } from '../../../../../environments/environment';
import { FirebaseDataService } from '../../../../shared/firebase/firebase-data.service';

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

  constructor(
    private http: HttpClient,
    private firebaseDataService: FirebaseDataService,
  ) {}

  getProducts(): Observable<InventoryProduct[]> {
    return this.firebaseDataService.getCollection<InventoryProduct>('products');
  }

  getShipments(): Observable<Shipment[]> {
    return this.firebaseDataService.getCollection<Shipment>('shipments');
  }

  getWarehouses(): Observable<Warehouse[]> {
    return this.firebaseDataService.getCollection<Warehouse>('warehouses');
  }
}
