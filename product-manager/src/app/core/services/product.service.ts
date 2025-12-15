import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private API = 'https://fakestoreapi.com/products';

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadProducts() {
    this.http.get<Product[]>(this.API)
      .pipe(catchError(this.handleError))
      .subscribe(data => this.productsSubject.next(data));
  }

  addProduct(product: Product) {
    return this.http.post<Product>(this.API, product)
      .pipe(catchError(this.handleError))
      .subscribe(() => {
        this.productsSubject.next([...this.productsSubject.value, { ...product, id: Date.now() }]);
      });
  }

  updateProduct(id: number, product: Product) {
    return this.http.put(`${this.API}/${id}`, product)
      .pipe(catchError(this.handleError))
      .subscribe(() => {
        const updated = this.productsSubject.value.map(p => p.id === id ? { ...product, id } : p);
        this.productsSubject.next(updated);
      });
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.API}/${id}`)
      .pipe(catchError(this.handleError))
      .subscribe(() => {
        this.productsSubject.next(this.productsSubject.value.filter(p => p.id !== id));
      });
  }

  getProduct(id: number) {
    return this.productsSubject.value.find(p => p.id === id);
  }

  private handleError(error: any) {
    console.error('API Error', error);
    return throwError(() => new Error('Something went wrong. Please try again.'));
  }
}
