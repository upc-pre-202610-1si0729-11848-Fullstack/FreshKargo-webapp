import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-table.html',
  styleUrl: './inventory-table.css',
})
export class InventoryTable {

  products = [
    {
      name: 'Tomatoes',
      category: 'Vegetables',
      stock: 120,
      status: 'Available',
    },
    {
      name: 'Potatoes',
      category: 'Vegetables',
      stock: 45,
      status: 'Low Stock',
    },
    {
      name: 'Apples',
      category: 'Fruits',
      stock: 210,
      status: 'Available',
    },
    {
      name: 'Milk',
      category: 'Dairy',
      stock: 18,
      status: 'Critical',
    },
  ];

}
