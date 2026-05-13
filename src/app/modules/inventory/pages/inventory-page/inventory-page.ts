import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventoryProduct } from '../../domain/model/product.entity';
import { InventoryService } from '../../infrastructure/services/inventory.service';

type InventoryFormProduct = {
  id: number | null;
  code: string;
  name: string;
  warehouse: string;
  expiryDate: string;
  category: string;
  stock: number;
  temperature: string;
  batch: string;
  minStock: number;
};

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.css',
})
export class InventoryPage implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private inventoryService: InventoryService,
  ) {}

  isAddModalOpen = false;
  isEditing = false;
  editingProductId: number | null = null;
  isViewModalOpen = false;
  isDeleteModalOpen = false;

  selectedProduct: InventoryProduct | null = null;
  productToDelete: InventoryProduct | null = null;

  isMinStockModalOpen = false;
  productToUpdateMinStock: InventoryProduct | null = null;
  newMinStockValue = 0;

  isWasteModalOpen = false;

  wasteForm = {
    productId: 0,
    units: 0,
    reason: 'Expired',
  };

  searchText = '';
  selectedCategory = 'All categories';
  selectedWarehouse = 'All warehouses';
  selectedStatus = 'Filter by status';

  toastMessage = '';
  showToast = false;

  products: InventoryProduct[] = [];
  private readonly categoryClassMap: Record<string, string> = {
    Fruits: 'fill-fruits',
    Vegetables: 'fill-vegetables',
    Dairy: 'fill-dairy',
    Frozen: 'fill-frozen',
    'Ready-to-ship': 'fill-ready',
  };

  newProduct: InventoryFormProduct = {
    id: null,
    code: '',
    name: '',
    warehouse: 'Lima Central',
    expiryDate: '',
    category: 'Fruits',
    stock: 0,
    temperature: '',
    batch: '',
    minStock: 0,
  };
  get totalInventoryUnits(): number {
    return this.products.reduce((total, product) => total + Number(product.stock), 0);
  }

  get expiringSoonCount(): number {
    return this.products.filter((product) => product.status === 'Expiring Soon').length;
  }

  get coldStorageItems(): number {
    return this.products
      .filter(
        (product) =>
          product.category === 'Frozen' || this.getTemperatureValue(product.temperature) <= 0,
      )
      .reduce((total, product) => total + Number(product.stock), 0);
  }

  get coldStoragePercent(): string {
    if (this.totalInventoryUnits === 0) {
      return '0%';
    }

    const percent = (this.coldStorageItems / this.totalInventoryUnits) * 100;

    return `${percent.toFixed(1)}%`;
  }

  get lowStockItems(): number {
    return this.products.filter(
      (product) =>
        product.status === 'Low Stock' ||
        product.status === 'Critical' ||
        product.stock <= product.minStock,
    ).length;
  }

  get categoryStockSummary() {
    const totalUnits = this.totalInventoryUnits;
    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Frozen', 'Ready-to-ship'];

    const grouped = this.products.reduce(
      (acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + Number(product.stock);
        return acc;
      },
      {} as Record<string, number>,
    );

    return categories.map((name) => {
      const units = grouped[name] || 0;

      const percent = totalUnits === 0 ? 0 : Math.round((units / totalUnits) * 100);

      return {
        name,
        units,
        percent,
        className: this.categoryClassMap[name] || 'fill-ready',
      };
    });
  }

  get expiringProducts() {
    return this.products
      .filter((product) => product.status === 'Expiring Soon' || product.status === 'Critical')
      .slice(0, 3)
      .map((product) => ({
        name: product.name,
        batch: product.batch,
        units: product.stock,
        warehouse: product.warehouse,
        date: this.formatExpiryDate(product.expiryDate),
      }));
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.inventoryService.getProducts().subscribe({
      next: (products) => {
        this.products = products.map((product) => {
          let calculatedStatus = this.inventoryService.getProductStatus(
            product.stock,
            product.expiryDate,
          );

          if (product.stock <= product.minStock) {
            calculatedStatus = 'Low Stock';
          }

          return {
            ...product,
            status: calculatedStatus,
          };
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToastMessage('Error loading products');
      },
    });
  }

  get filteredProducts(): InventoryProduct[] {
    return this.products.filter((product) => {
      const query = this.searchText.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.code.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.batch.toLowerCase().includes(query) ||
        product.warehouse.toLowerCase().includes(query);

      const matchesCategory =
        this.selectedCategory === 'All categories' || product.category === this.selectedCategory;

      const matchesWarehouse =
        this.selectedWarehouse === 'All warehouses' || product.warehouse === this.selectedWarehouse;

      const matchesStatus =
        this.selectedStatus === 'Filter by status' || product.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesWarehouse && matchesStatus;
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingProductId = null;

    this.newProduct = {
      id: null,
      code: this.inventoryService.generateProductCode(this.products),
      name: '',
      warehouse: 'Lima Central',
      expiryDate: '',
      category: 'Fruits',
      stock: 0,
      temperature: '',
      batch: this.generateBatchCode(),
      minStock: 0,
    };

    this.isAddModalOpen = true;
  }

  openEditModal(product: InventoryProduct): void {
    this.isEditing = true;
    this.editingProductId = product.id;

    this.newProduct = {
      id: product.id,
      code: product.code,
      name: product.name,
      warehouse: product.warehouse,
      expiryDate: product.expiryDate,
      category: product.category,
      stock: product.stock,
      temperature: String(product.temperature).replace('°C', '').trim(),
      batch: product.batch,
      minStock: product.minStock,
    };

    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  openViewModal(product: InventoryProduct): void {
    this.selectedProduct = product;
    this.isViewModalOpen = true;
  }

  closeViewModal(): void {
    this.selectedProduct = null;
    this.isViewModalOpen = false;
  }

  openDeleteModal(product: InventoryProduct): void {
    this.productToDelete = product;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.productToDelete = null;
    this.isDeleteModalOpen = false;
  }

  confirmDeleteProduct(): void {
    if (!this.productToDelete) {
      return;
    }

    this.inventoryService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.loadProducts();
        this.closeDeleteModal();
        this.showToastMessage('Product deleted successfully');
      },
      error: () => {
        this.showToastMessage('Error deleting product');
      },
    });
  }

  openMinStockModal(product: InventoryProduct): void {
    this.productToUpdateMinStock = product;
    this.newMinStockValue = product.minStock;
    this.isMinStockModalOpen = true;
  }

  closeMinStockModal(): void {
    this.productToUpdateMinStock = null;
    this.newMinStockValue = 0;
    this.isMinStockModalOpen = false;
  }

  saveMinStock(): void {
    if (!this.productToUpdateMinStock) {
      return;
    }

    const updatedProduct: InventoryProduct = {
      ...this.productToUpdateMinStock,
      minStock: Number(this.newMinStockValue),
      status: this.inventoryService.getProductStatus(
        this.productToUpdateMinStock.stock,
        this.productToUpdateMinStock.expiryDate,
      ),
    };

    if (updatedProduct.stock <= updatedProduct.minStock) {
      updatedProduct.status = 'Low Stock';
    }

    this.inventoryService.updateProduct(updatedProduct.id, updatedProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.closeMinStockModal();
        this.showToastMessage('Minimum stock updated successfully');
      },
      error: () => {
        this.showToastMessage('Error updating minimum stock');
      },
    });
  }
  openWasteModal(): void {
    this.wasteForm = {
      productId: this.products.length > 0 ? this.products[0].id : 0,
      units: 0,
      reason: 'Expired',
    };

    this.isWasteModalOpen = true;
  }

  closeWasteModal(): void {
    this.isWasteModalOpen = false;

    this.wasteForm = {
      productId: 0,
      units: 0,
      reason: 'Expired',
    };
  }

  registerWaste(): void {
    const selectedProduct = this.products.find(
      (product) => product.id === Number(this.wasteForm.productId),
    );

    if (!selectedProduct || this.wasteForm.units <= 0) {
      this.showToastMessage('Please complete the waste form');
      return;
    }

    if (this.wasteForm.units > selectedProduct.stock) {
      this.showToastMessage('Waste units cannot exceed current stock');
      return;
    }

    const newStock = selectedProduct.stock - Number(this.wasteForm.units);

    let calculatedStatus = this.inventoryService.getProductStatus(
      newStock,
      selectedProduct.expiryDate,
    );

    if (newStock <= selectedProduct.minStock) {
      calculatedStatus = 'Low Stock';
    }

    const updatedProduct: InventoryProduct = {
      ...selectedProduct,
      stock: newStock,
      status: calculatedStatus,
    };

    this.inventoryService.updateProduct(updatedProduct.id, updatedProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.closeWasteModal();
        this.showToastMessage('Waste registered successfully');
      },
      error: () => {
        this.showToastMessage('Error registering waste');
      },
    });
  }

  showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 2400);
  }

  saveProduct(): void {
    const status = this.inventoryService.getProductStatus(
      this.newProduct.stock,
      this.newProduct.expiryDate,
    );

    const temperature = this.formatTemperature(this.newProduct.temperature);

    if (this.isEditing && this.editingProductId !== null && this.newProduct.id !== null) {
      const productData: InventoryProduct = {
        id: this.newProduct.id,
        code: this.newProduct.code,
        name: this.newProduct.name,
        warehouse: this.newProduct.warehouse,
        expiryDate: this.newProduct.expiryDate,
        category: this.newProduct.category,
        stock: this.newProduct.stock,
        temperature,
        batch: this.newProduct.batch,
        minStock: this.newProduct.minStock,
        status,
      };

      this.inventoryService.updateProduct(this.editingProductId, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeAddModal();
          this.showToastMessage('Product updated successfully');
        },
        error: () => {
          this.showToastMessage('Error updating product');
        },
      });

      return;
    }

    const productData: Omit<InventoryProduct, 'id'> = {
      code: this.newProduct.code,
      name: this.newProduct.name,
      warehouse: this.newProduct.warehouse,
      expiryDate: this.newProduct.expiryDate,
      category: this.newProduct.category,
      stock: this.newProduct.stock,
      temperature,
      batch: this.newProduct.batch,
      minStock: this.newProduct.minStock,
      status,
    };

    this.inventoryService.addProduct(productData).subscribe({
      next: () => {
        this.loadProducts();
        this.closeAddModal();
        this.showToastMessage('Product added successfully');
      },
      error: () => {
        this.showToastMessage('Error adding product');
      },
    });
  }

  private getTemperatureValue(temperature: string): number {
    const value = Number(String(temperature).replace('°C', '').trim());

    return Number.isNaN(value) ? 0 : value;
  }

  private formatTemperature(temperature: string): string {
    const cleanTemperature = String(temperature).replace('°C', '').trim();

    if (!cleanTemperature) {
      return '0°C';
    }

    return `${cleanTemperature}°C`;
  }

  private generateBatchCode(): string {
    const nextNumber = 4500 + this.products.length + 1;

    return `BT-${nextNumber}`;
  }

  private formatExpiryDate(date: string): string {
    if (!date) {
      return 'No date';
    }

    const [year, month, day] = date.split('-').map(Number);

    const parsedDate = new Date(year, month - 1, day);

    return parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
