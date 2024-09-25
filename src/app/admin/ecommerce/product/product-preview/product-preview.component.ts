import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.css'],
})
export class ProductPreviewComponent implements OnInit {
  productData: any;
  colors: any;
  sizes: any;

  ngOnInit(): void {
    const data = localStorage.getItem('productData');
    if (data) {
      this.productData = JSON.parse(data);
      this.colors = JSON.parse(this.productData.color);
      this.sizes = JSON.parse(this.productData.size);
    }
  }
}
