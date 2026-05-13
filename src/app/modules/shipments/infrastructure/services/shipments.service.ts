import { Injectable } from '@angular/core';
import {
  Shipment,
  NewShipment,
  NewRoute,
  NewAssignment
} from '../../domain/model/shipment.entity';

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {

  private readonly storageKey = 'freshkargo-shipments-v2';

  private readonly defaultShipments: Shipment[] = [
    {
      id: 'FK-1023',
      product: 'Berries',
      batch: 'BT-4521',
      temperature: '3°C',
      route: 'Lima Central → Surco Market',
      driver: 'Carlos M.',
      eta: '12:30 PM',
      status: 'In Transit'
    },
    {
      id: 'FK-1024',
      product: 'Lettuce',
      batch: 'BT-4518',
      temperature: '5°C',
      route: 'Callao Hub → Miraflores Store',
      driver: 'Ana R.',
      eta: '1:15 PM',
      status: 'Delivered'
    },
    {
      id: 'FK-1025',
      product: 'Dairy Products',
      batch: 'BT-4503',
      temperature: '6°C',
      route: 'Lima Central → San Isidro',
      driver: 'Luis P.',
      eta: '2:40 PM',
      status: 'Delayed'
    },
    {
      id: 'FK-1026',
      product: 'Frozen Chicken',
      batch: 'BT-4490',
      temperature: '-18°C',
      route: 'Surco Warehouse → Barranco',
      driver: 'Maria G.',
      eta: '3:00 PM',
      status: 'In Transit'
    },
    {
      id: 'FK-1027',
      product: 'Fresh Avocados',
      batch: 'BT-4476',
      temperature: '6°C',
      route: 'North Hub → Lima Downtown',
      driver: 'Pedro S.',
      eta: '3:45 PM',
      status: 'Loading'
    },
    {
      id: 'FK-1028',
      product: 'Tomatoes',
      batch: 'BT-4465',
      temperature: '8°C',
      route: 'South Hub → Callao Market',
      driver: 'Sofia L.',
      eta: '4:20 PM',
      status: 'Rejected'
    }
  ];

  getShipments(): Shipment[] {
    const savedShipments = localStorage.getItem(this.storageKey);

    if (savedShipments) {
      return JSON.parse(savedShipments);
    }

    this.saveShipments(this.defaultShipments);

    return this.defaultShipments;
  }

  saveShipments(shipments: Shipment[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(shipments)
    );
  }

  createShipment(newShipment: NewShipment): Shipment[] {
    const shipments = this.getShipments();

    const shipment: Shipment = {
      ...newShipment,
      id: this.generateShipmentId(shipments)
    };

    const updatedShipments = [shipment, ...shipments];

    this.saveShipments(updatedShipments);

    return updatedShipments;
  }

  deleteShipment(index: number): Shipment[] {
    const shipments = this.getShipments();

    shipments.splice(index, 1);

    this.saveShipments(shipments);

    return shipments;
  }

  createRoute(route: NewRoute): boolean {
    return !!route.name && !!route.origin && !!route.destination;
  }

  assignVehicle(assignment: NewAssignment): boolean {
    return !!assignment.shipmentId && !!assignment.vehicle && !!assignment.driver;
  }

  private generateShipmentId(shipments: Shipment[]): string {
    return `FK-${1023 + shipments.length}`;
  }

}
