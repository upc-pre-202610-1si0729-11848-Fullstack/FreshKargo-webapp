import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { InventoryProduct, ProductStatus } from '../../domain/model/product.entity';

import { FirebaseDataService } from '../../../../shared/firebase/firebase-data.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(
    private http: HttpClient,
    private firebaseDataService: FirebaseDataService,
  ) {}

  getProducts(): Observable<InventoryProduct[]> {
    return this.firebaseDataService.getCollection<InventoryProduct>('products');
  }

  addProduct(product: Omit<InventoryProduct, 'id'>): Observable<InventoryProduct> {
    return this.http.post<InventoryProduct>(this.apiUrl, product);
  }

  updateProduct(id: number, product: InventoryProduct): Observable<InventoryProduct> {
    return this.http.put<InventoryProduct>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generateProductCode(products: InventoryProduct[]): string {
    const nextNumber = products.length + 1;
    return `PRD-${String(nextNumber).padStart(3, '0')}`;
  }

  getProductStatus(stock: number, expiryDate: string): ProductStatus {
    if (stock <= 30) return 'Critical';
    if (stock <= 50) return 'Low Stock';

    if (expiryDate) {
      const today = new Date();
      const expiry = new Date(expiryDate);
      const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 3) return 'Expiring Soon';
    }

    return 'Good';
  }
}
