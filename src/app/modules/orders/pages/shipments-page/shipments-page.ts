import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ModalType = 'shipment' | 'route' | 'assign' | null;

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipments-page.html',
  styleUrl: './shipments-page.css'
})
export class ShipmentsPage implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {}

  activeModal: ModalType = null;

  showToast = false;
  toastMessage = '';

  shipments: any[] = [];

  newShipment = {
    product: '',
    batch: '',
    temperature: '',
    route: '',
    driver: '',
    eta: '',
    status: 'In Transit'
  };

  newRoute = {
    name: '',
    type: '',
    origin: '',
    destination: '',
    duration: '',
    distance: ''
  };

  newAssignment = {
    shipmentId: '',
    vehicle: '',
    driver: '',
    departureTime: ''
  };

  ngOnInit(): void {
    const savedShipments =
      localStorage.getItem('freshkargo-shipments-v2');

    if (savedShipments) {
      this.shipments = JSON.parse(savedShipments);
    } else {
      this.shipments = [
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

      this.saveShipments();
    }
  }

  saveShipments() {
    localStorage.setItem(
      'freshkargo-shipments-v2',
      JSON.stringify(this.shipments)
    );
  }

  openShipmentModal() {
    this.activeModal = 'shipment';
  }

  openRouteModal() {
    this.activeModal = 'route';
  }

  openAssignModal() {
    this.activeModal = 'assign';
  }

  openModal() {
    this.openShipmentModal();
  }

  closeModal() {
    this.activeModal = null;

    this.newShipment = {
      product: '',
      batch: '',
      temperature: '',
      route: '',
      driver: '',
      eta: '',
      status: 'In Transit'
    };

    this.newRoute = {
      name: '',
      type: '',
      origin: '',
      destination: '',
      duration: '',
      distance: ''
    };

    this.newAssignment = {
      shipmentId: '',
      vehicle: '',
      driver: '',
      departureTime: ''
    };
  }

  createShipment() {
    if (
      !this.newShipment.product ||
      !this.newShipment.batch ||
      !this.newShipment.temperature ||
      !this.newShipment.route ||
      !this.newShipment.driver ||
      !this.newShipment.eta
    ) return;

    const shipment = {
      ...this.newShipment,
      id: `FK-${1023 + this.shipments.length}`
    };

    this.shipments.unshift(shipment);
    this.saveShipments();
    this.closeModal();
    this.triggerToast('Shipment created successfully');
  }

  createRoute() {
    if (
      !this.newRoute.name ||
      !this.newRoute.origin ||
      !this.newRoute.destination
    ) return;

    this.closeModal();
    this.triggerToast('Route created successfully');
  }

  assignVehicle() {
    if (
      !this.newAssignment.shipmentId ||
      !this.newAssignment.vehicle ||
      !this.newAssignment.driver
    ) return;

    this.closeModal();
    this.triggerToast('Vehicle assigned successfully');
  }

  deleteShipment(index: number) {
    this.shipments.splice(index, 1);
    this.saveShipments();
    this.triggerToast('Shipment deleted successfully');
  }

  triggerToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 2400);
  }
}
