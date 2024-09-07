import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/admin/services/products.service';

@Component({
  selector: 'app-detalis-product',
  templateUrl: './detalis-product.component.html',
  styleUrls: ['./detalis-product.component.css'],
})
export class DetalisProductComponent implements OnInit {
  productDetails: any;
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productsService.get(id).subscribe((res) => {
      this.productDetails = res;
    });
  }
}
