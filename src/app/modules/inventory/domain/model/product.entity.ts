export type ProductStatus =
  | 'Good'
  | 'Expiring Soon'
  | 'Critical'
  | 'Low Stock';

export interface InventoryProduct {
  id: number;
  code: string;
  name: string;
  warehouse: string;
  expiryDate: string;
  category: string;
  stock: number;
  temperature: string;
  status: ProductStatus;
  batch: string;
  minStock: number;
}
