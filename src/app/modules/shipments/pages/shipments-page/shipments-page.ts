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
  NewAssignment,
  ShipmentStatus
} from '../../domain/model/shipment.entity';

import { ShipmentsService } from '../../infrastructure/services/shipments.service';

type RoutePerformance = {
  route: string;
  total: number;
  delivered: number;
  delayed: number;
  percent: number;
};

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
  selectedStatus: ShipmentStatus | 'All statuses' = 'All statuses';
  selectedRoute = 'All routes';

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
    this.loadShipments();
  }

  get activeShipmentsCount(): number {
    return this.shipments.filter(shipment => shipment.status !== 'Delivered').length;
  }

  get inTransitCount(): number {
    return this.getStatusCount('In Transit');
  }

  get deliveredCount(): number {
    return this.getStatusCount('Delivered');
  }

  get delayedShipments(): Shipment[] {
    return this.shipments.filter(shipment => shipment.status === 'Delayed');
  }

  get delayedCount(): number {
    return this.delayedShipments.length;
  }

  get loadingCount(): number {
    return this.getStatusCount('Loading');
  }

  get averageTransitTemperature(): string {
    const temperatures = this.shipments
      .map(shipment => Number.parseFloat(shipment.temperature))
      .filter(temperature => !Number.isNaN(temperature));

    if (!temperatures.length) {
      return '0.0C';
    }

    const average = temperatures.reduce((sum, temperature) => sum + temperature, 0) / temperatures.length;

    return `${average.toFixed(1)}C`;
  }

  get routeOptions(): string[] {
    return [...new Set(this.shipments.map(shipment => shipment.route))];
  }

  get filteredShipments(): Shipment[] {
    return this.shipments.filter(shipment => {
      const matchesStatus =
        this.selectedStatus === 'All statuses'
        || shipment.status === this.selectedStatus;

      const matchesRoute =
        this.selectedRoute === 'All routes'
        || shipment.route === this.selectedRoute;

      return matchesStatus && matchesRoute;
    });
  }

  get performanceRoutes(): RoutePerformance[] {
    return this.routeOptions
      .map(route => {
        const routeShipments = this.shipments.filter(shipment => shipment.route === route);
        const delivered = routeShipments.filter(shipment => shipment.status === 'Delivered').length;
        const delayed = routeShipments.filter(shipment => shipment.status === 'Delayed').length;
        const percent = routeShipments.length
          ? Math.round((delivered / routeShipments.length) * 100)
          : 0;

        return {
          route,
          total: routeShipments.length,
          delivered,
          delayed,
          percent
        };
      })
      .sort((first, second) => second.total - first.total)
      .slice(0, 4);
  }

  loadShipments(): void {
    this.shipmentsService.getShipments().subscribe({
      next: (shipments) => {
        this.shipments = [...shipments];
        this.cdr.detectChanges();
      },
      error: () => {
        this.triggerToast('Error loading shipments');
      }
    });
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

    this.shipmentsService.createShipment(
      this.newShipment,
      this.shipments
    ).subscribe({
      next: (shipment) => {
        this.shipments = [shipment, ...this.shipments];
        this.closeModal();
        this.triggerToast('Shipment created successfully');
      },
      error: () => {
        this.triggerToast('Error creating shipment');
      }
    });
  }

  createRoute(): void {
    if (!this.newRoute.name || !this.newRoute.origin || !this.newRoute.destination) {
      return;
    }

    this.shipmentsService.createRoute(this.newRoute).subscribe({
      next: () => {
        this.closeModal();
        this.triggerToast('Route created successfully');
      },
      error: () => {
        this.triggerToast('Error creating route');
      }
    });
  }

  assignVehicle(): void {
    if (!this.newAssignment.shipmentId || !this.newAssignment.vehicle || !this.newAssignment.driver) {
      return;
    }

    this.shipmentsService.assignVehicle(this.newAssignment).subscribe({
      next: () => {
        this.closeModal();
        this.triggerToast('Vehicle assigned successfully');
      },
      error: () => {
        this.triggerToast('Error assigning vehicle');
      }
    });
  }

  updateShipmentStatus(
    shipment: Shipment,
    status: ShipmentStatus
  ): void {
    this.shipmentsService.updateShipmentStatus(shipment.id, status).subscribe({
      next: (updatedShipment) => {
        this.shipments = this.shipments.map(currentShipment =>
          currentShipment.id === updatedShipment.id ? updatedShipment : currentShipment
        );
        this.triggerToast('Shipment updated successfully');
      },
      error: () => {
        this.triggerToast('Error updating shipment');
      }
    });
  }

  deleteShipment(shipment: Shipment): void {
    this.shipmentsService.deleteShipment(shipment.id).subscribe({
      next: () => {
        this.shipments = this.shipments.filter(currentShipment => currentShipment.id !== shipment.id);
        this.triggerToast('Shipment deleted successfully');
      },
      error: () => {
        this.triggerToast('Error deleting shipment');
      }
    });
  }

  clearFilters(): void {
    this.selectedStatus = 'All statuses';
    this.selectedRoute = 'All routes';
  }

  exportShipments(): void {
    const headers = [
      'id',
      'product',
      'batch',
      'temperature',
      'route',
      'driver',
      'eta',
      'status'
    ];

    const rows = this.filteredShipments.map(shipment =>
      headers
        .map(header => this.escapeCsvValue(shipment[header as keyof Shipment]))
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'freshkargo-shipments.csv';
    link.click();

    URL.revokeObjectURL(url);
    this.triggerToast('Shipments exported successfully');
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

  private getStatusCount(status: ShipmentStatus): number {
    return this.shipments.filter(shipment => shipment.status === status).length;
  }

  private escapeCsvValue(value: string | number): string {
    const text = String(value).replace(/"/g, '""');

    return `"${text}"`;
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
