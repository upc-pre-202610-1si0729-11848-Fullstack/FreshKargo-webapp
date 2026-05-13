export type ShipmentStatus =
  | 'In Transit'
  | 'Delivered'
  | 'Delayed'
  | 'Loading'
  | 'Rejected';

export type ShipmentModalType =
  | 'shipment'
  | 'route'
  | 'assign'
  | null;

export interface Shipment {
  id: string;
  product: string;
  batch: string;
  temperature: string;
  route: string;
  driver: string;
  eta: string;
  status: ShipmentStatus;
}

export interface NewShipment {
  product: string;
  batch: string;
  temperature: string;
  route: string;
  driver: string;
  eta: string;
  status: ShipmentStatus;
}

export interface NewRoute {
  name: string;
  type: string;
  origin: string;
  destination: string;
  duration: string;
  distance: string;
}

export interface NewAssignment {
  shipmentId: string;
  vehicle: string;
  driver: string;
  departureTime: string;
}
