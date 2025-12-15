import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  isEdit = false;
  id!: number;

  productForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    image: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      const product = this.service.getProduct(this.id);
      if (product) this.productForm.patchValue(product);
    }
  }

  submit() {
    if (this.productForm.invalid) {
      this.snack.open('Please fill all fields correctly', 'Close', { duration: 2000 });
      return;
    }

    const product: Product = this.productForm.getRawValue();

    if (this.isEdit) {
      this.service.updateProduct(this.id, product);
      this.snack.open('Product updated successfully', 'Close', { duration: 2000 });
    } else {
      this.service.addProduct(product);
      this.snack.open('Product added successfully', 'Close', { duration: 2000 });
    }

    this.router.navigate(['/products']);
  }
}
