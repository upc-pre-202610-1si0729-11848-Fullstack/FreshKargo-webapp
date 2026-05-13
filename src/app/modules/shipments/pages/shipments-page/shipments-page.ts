import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Shipment,
  ShipmentModalType,
  NewShipment,
  NewRoute,
  NewAssignment
} from '../../domain/model/shipment.entity';

import { ShipmentsService } from '../../infrastructure/services/shipments.service';

@Component({
  selector: 'app-shipments-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './shipments-page.html',
  styleUrl: './shipments-page.css'
})
export class ShipmentsPage implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private shipmentsService: ShipmentsService
  ) {}

  activeModal: ShipmentModalType = null;

  showToast = false;
  toastMessage = '';

  shipments: Shipment[] = [];

  newShipment: NewShipment = {
    product: '',
    batch: '',
    temperature: '',
    route: '',
    driver: '',
    eta: '',
    status: 'In Transit'
  };

  newRoute: NewRoute = {
    name: '',
    type: '',
    origin: '',
    destination: '',
    duration: '',
    distance: ''
  };

  newAssignment: NewAssignment = {
    shipmentId: '',
    vehicle: '',
    driver: '',
    departureTime: ''
  };

  ngOnInit(): void {
    this.shipments = this.shipmentsService.getShipments();
  }

  openShipmentModal(): void {
    this.activeModal = 'shipment';
  }

  openRouteModal(): void {
    this.activeModal = 'route';
  }

  openAssignModal(): void {
    this.activeModal = 'assign';
  }

  openModal(): void {
    this.openShipmentModal();
  }

  closeModal(): void {
    this.activeModal = null;
    this.resetForms();
  }

  createShipment(): void {
    if (
      !this.newShipment.product ||
      !this.newShipment.batch ||
      !this.newShipment.temperature ||
      !this.newShipment.route ||
      !this.newShipment.driver ||
      !this.newShipment.eta
    ) {
      return;
    }

    this.shipments = this.shipmentsService.createShipment(this.newShipment);

    this.closeModal();
    this.triggerToast('Shipment created successfully');
  }

  createRoute(): void {
    const wasCreated = this.shipmentsService.createRoute(this.newRoute);

    if (!wasCreated) {
      return;
    }

    this.closeModal();
    this.triggerToast('Route created successfully');
  }

  assignVehicle(): void {
    const wasAssigned = this.shipmentsService.assignVehicle(this.newAssignment);

    if (!wasAssigned) {
      return;
    }

    this.closeModal();
    this.triggerToast('Vehicle assigned successfully');
  }

  deleteShipment(index: number): void {
    this.shipments = this.shipmentsService.deleteShipment(index);

    this.triggerToast('Shipment deleted successfully');
  }

  triggerToast(message: string): void {
    this.toastMessage = message;
    this.showToast = true;

    this.cdr.detectChanges();

    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 2400);
  }

  private resetForms(): void {
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

}
