import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;

  constructor(private service: ProductService) { }

  ngOnInit(): void {
    this.service.loadProducts();
    this.products$ = this.service.products$;
  }

  delete(id?: number) {
    if (!id) return;
    this.service.deleteProduct(id);
  }

  trackById(index: number, item: Product) {
    return item.id;
  }
}
