import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Shipment,
  NewShipment,
  NewRoute,
  NewAssignment,
  ShipmentStatus
} from '../../domain/model/shipment.entity';

import { environment } from '../../../../../environments/environment';
import { FirebaseDataService } from '../../../../shared/firebase/firebase-data.service';

@Injectable({
  providedIn: 'root',
})
export class ShipmentsService {
  private readonly shipmentsUrl = `${environment.apiBaseUrl}/shipments`;
  private readonly routesUrl = `${environment.apiBaseUrl}/routes`;
  private readonly dispatchesUrl = `${environment.apiBaseUrl}/dispatches`;

  constructor(
    private http: HttpClient,
    private firebaseDataService: FirebaseDataService,
  ) {}

  getShipments(): Observable<Shipment[]> {
    return this.firebaseDataService.getCollection<Shipment>('shipments');
  }

  createShipment(newShipment: NewShipment, currentShipments: Shipment[]): Observable<Shipment> {
    const shipment: Shipment = {
      ...newShipment,
      id: this.generateShipmentId(currentShipments),
    };

    return this.http.post<Shipment>(this.shipmentsUrl, shipment);
  }

  updateShipmentStatus(shipmentId: string, status: ShipmentStatus): Observable<Shipment> {
    return this.http.patch<Shipment>(`${this.shipmentsUrl}/${shipmentId}`, { status });
  }

  deleteShipment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.shipmentsUrl}/${id}`);
  }

  createRoute(route: NewRoute): Observable<NewRoute> {
    return this.http.post<NewRoute>(this.routesUrl, route);
  }

  assignVehicle(assignment: NewAssignment): Observable<NewAssignment> {
    return this.http.post<NewAssignment>(this.dispatchesUrl, assignment);
  }

  private generateShipmentId(shipments: Shipment[]): string {
    const highestId = shipments.reduce((highest, shipment) => {
      const numericId = Number(shipment.id.replace('FK-', ''));

      return Number.isNaN(numericId) ? highest : Math.max(highest, numericId);
    }, 1022);

    return `FK-${highestId + 1}`;
  }
}
