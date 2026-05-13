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
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.css',
})
export class InventoryPage implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private inventoryService: InventoryService
  ) {}

  isAddModalOpen = false;
  isEditing = false;
  editingProductId: number | null = null;

  searchText = '';
  selectedCategory = 'All categories';
  selectedWarehouse = 'All warehouses';
  selectedStatus = 'Filter by status';

  toastMessage = '';
  showToast = false;

  products: InventoryProduct[] = [];

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

  categoryStock = [
    { name: 'Fruits', units: 820, percent: 45, className: 'fill-fruits' },
    { name: 'Vegetables', units: 610, percent: 33, className: 'fill-vegetables' },
    { name: 'Dairy', units: 180, percent: 10, className: 'fill-dairy' },
    { name: 'Frozen', units: 160, percent: 9, className: 'fill-frozen' },
    { name: 'Ready-to-ship', units: 72, percent: 3, className: 'fill-ready' },
  ];

  expiringItems = [
    { name: 'Fresh Milk', batch: 'BT-4521', units: 180, warehouse: 'Lima Central', date: 'Apr 24' },
    { name: 'Organic Lettuce', batch: 'BT-4518', units: 320, warehouse: 'North Hub', date: 'Apr 25' },
    { name: 'Fresh Avocados', batch: 'BT-4503', units: 42, warehouse: 'Lima Central', date: 'Apr 26' },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.inventoryService.getProducts().subscribe({
      next: (products) => {
        this.products = [...products];
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToastMessage('Error loading products');
      }
    });
  }

  get filteredProducts(): InventoryProduct[] {
    return this.products.filter(product => {
      const query = this.searchText.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(query)
        || product.code.toLowerCase().includes(query)
        || product.category.toLowerCase().includes(query);

      const matchesCategory =
        this.selectedCategory === 'All categories'
        || product.category === this.selectedCategory;

      const matchesWarehouse =
        this.selectedWarehouse === 'All warehouses'
        || product.warehouse === this.selectedWarehouse;

      const matchesStatus =
        this.selectedStatus === 'Filter by status'
        || product.status === this.selectedStatus;

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
      batch: '',
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
      temperature: product.temperature,
      batch: product.batch,
      minStock: product.minStock,
    };

    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
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
      this.newProduct.expiryDate
    );

    if (this.isEditing && this.editingProductId !== null && this.newProduct.id !== null) {
      const productData: InventoryProduct = {
        id: this.newProduct.id,
        code: this.newProduct.code,
        name: this.newProduct.name,
        warehouse: this.newProduct.warehouse,
        expiryDate: this.newProduct.expiryDate,
        category: this.newProduct.category,
        stock: this.newProduct.stock,
        temperature: this.newProduct.temperature,
        batch: this.newProduct.batch,
        minStock: this.newProduct.minStock,
        status,
      };

      this.inventoryService.updateProduct(
        this.editingProductId,
        productData
      ).subscribe({
        next: () => {
          this.loadProducts();
          this.closeAddModal();
          this.showToastMessage('Product updated successfully');
        },
        error: () => {
          this.showToastMessage('Error updating product');
        }
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
      temperature: this.newProduct.temperature,
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
      }
    });
  }

  deleteProduct(product: InventoryProduct): void {
    this.inventoryService.deleteProduct(product.id).subscribe({
      next: () => {
        this.loadProducts();
        this.showToastMessage('Product deleted successfully');
      },
      error: () => {
        this.showToastMessage('Error deleting product');
      }
    });
  }

}
