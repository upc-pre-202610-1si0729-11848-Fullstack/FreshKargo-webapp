import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface InventoryProduct {
  id: string;
  name: string;
  warehouse: string;
  expiryDate: string;
  category: string;
  stock: number;
  temperature: string;
  status: 'Good' | 'Expiring Soon' | 'Critical' | 'Low Stock';
  batch: string;
  minStock: number;
}

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
    private cdr: ChangeDetectorRef
  ) {}

  isAddModalOpen = false;
  isEditing = false;
  editingIndex: number | null = null;

  searchText = '';
  selectedCategory = 'All categories';
  selectedWarehouse = 'All warehouses';
  selectedStatus = 'Filter by status';

  toastMessage = '';
  showToast = false;

  newProduct = {
    id: '',
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
    {
      name: 'Fruits',
      units: 820,
      percent: 45,
      className: 'fill-fruits',
    },
    {
      name: 'Vegetables',
      units: 610,
      percent: 33,
      className: 'fill-vegetables',
    },
    {
      name: 'Dairy',
      units: 180,
      percent: 10,
      className: 'fill-dairy',
    },
    {
      name: 'Frozen',
      units: 160,
      percent: 9,
      className: 'fill-frozen',
    },
    {
      name: 'Ready-to-ship',
      units: 72,
      percent: 3,
      className: 'fill-ready',
    },
  ];

  expiringItems = [
    {
      name: 'Fresh Milk',
      batch: 'BT-4521',
      units: 180,
      warehouse: 'Lima Central',
      date: 'Apr 24',
    },
    {
      name: 'Organic Lettuce',
      batch: 'BT-4518',
      units: 320,
      warehouse: 'North Hub',
      date: 'Apr 25',
    },
    {
      name: 'Fresh Avocados',
      batch: 'BT-4503',
      units: 42,
      warehouse: 'Lima Central',
      date: 'Apr 26',
    },
  ];

  products: InventoryProduct[] = [];

  ngOnInit() {
    const savedProducts = localStorage.getItem('inventory');

    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
    } else {
      this.products = [
        {
          id: 'PRD-001',
          name: 'Fresh Strawberries',
          warehouse: 'Lima Central',
          expiryDate: '2026-04-28',
          category: 'Fruits',
          stock: 450,
          temperature: '3°C',
          status: 'Good',
          batch: 'BT-4501',
          minStock: 80,
        },
        {
          id: 'PRD-002',
          name: 'Organic Lettuce',
          warehouse: 'North Hub',
          expiryDate: '2026-04-25',
          category: 'Vegetables',
          stock: 320,
          temperature: '5°C',
          status: 'Expiring Soon',
          batch: 'BT-4518',
          minStock: 60,
        },
        {
          id: 'PRD-003',
          name: 'Fresh Milk',
          warehouse: 'Lima Central',
          expiryDate: '2026-04-24',
          category: 'Dairy',
          stock: 180,
          temperature: '4°C',
          status: 'Critical',
          batch: 'BT-4521',
          minStock: 40,
        },
        {
          id: 'PRD-004',
          name: 'Frozen Chicken',
          warehouse: 'South Hub',
          expiryDate: '2026-06-15',
          category: 'Frozen',
          stock: 560,
          temperature: '-18°C',
          status: 'Good',
          batch: 'BT-4498',
          minStock: 120,
        },
        {
          id: 'PRD-005',
          name: 'Fresh Avocados',
          warehouse: 'Lima Central',
          expiryDate: '2026-04-26',
          category: 'Fruits',
          stock: 42,
          temperature: '6°C',
          status: 'Low Stock',
          batch: 'BT-4503',
          minStock: 50,
        },
        {
          id: 'PRD-006',
          name: 'Cherry Tomatoes',
          warehouse: 'North Hub',
          expiryDate: '2026-04-30',
          category: 'Vegetables',
          stock: 290,
          temperature: '8°C',
          status: 'Good',
          batch: 'BT-4511',
          minStock: 70,
        },
      ];

      this.saveProducts();
    }
  }

  saveProducts() {
    localStorage.setItem(
      'inventory',
      JSON.stringify(this.products)
    );
  }

  get filteredProducts() {
    return this.products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
        || product.id.toLowerCase().includes(this.searchText.toLowerCase())
        || product.category.toLowerCase().includes(this.searchText.toLowerCase());

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

  openAddModal() {
    this.isEditing = false;
    this.editingIndex = null;

    this.newProduct = {
      id: this.generateProductId(),
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

  openEditModal(product: InventoryProduct, index: number) {
    this.isEditing = true;
    this.editingIndex = index;

    this.newProduct = {
      id: product.id,
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

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  generateProductId() {
    const nextNumber = this.products.length + 1;

    return `PRD-${String(nextNumber).padStart(3, '0')}`;
  }

  getProductStatus(stock: number, expiryDate: string): InventoryProduct['status'] {
    if (stock <= 30) {
      return 'Critical';
    }

    if (stock <= 50) {
      return 'Low Stock';
    }

    if (expiryDate) {
      const today = new Date();
      const expiry = new Date(expiryDate);
      const difference = expiry.getTime() - today.getTime();
      const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

      if (daysLeft <= 3) {
        return 'Expiring Soon';
      }
    }

    return 'Good';
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;

    this.cdr.detectChanges();

    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 2400);
  }

  saveProduct() {
    const productData: InventoryProduct = {
      id: this.newProduct.id,
      name: this.newProduct.name,
      warehouse: this.newProduct.warehouse,
      expiryDate: this.newProduct.expiryDate,
      category: this.newProduct.category,
      stock: this.newProduct.stock,
      temperature: this.newProduct.temperature,
      batch: this.newProduct.batch,
      minStock: this.newProduct.minStock,
      status: this.getProductStatus(
        this.newProduct.stock,
        this.newProduct.expiryDate
      ),
    };

    if (this.isEditing && this.editingIndex !== null) {
      this.products[this.editingIndex] = productData;

      this.showToastMessage('Product updated successfully');
    } else {
      this.products.unshift(productData);

      this.showToastMessage('Product added successfully');
    }

    this.saveProducts();
    this.closeAddModal();
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);

    this.saveProducts();

    this.showToastMessage('Product deleted successfully');
  }

}
