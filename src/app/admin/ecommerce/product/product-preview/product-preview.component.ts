import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.css'],
})
export class ProductPreviewComponent implements OnInit {
  productData: any;
  variants: any;
  colors: any[] = [];
  sizes: any[] = [];
  materials: any[] = [];
  slideConfig = {
    dots: false,
    infinite: false,
    speed: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  images: any;

  ngOnInit(): void {
    const data = localStorage.getItem('productData');
    if (data) {
      this.productData = JSON.parse(data);
      this.variants = JSON.parse(this.productData.variants);
      this.images = JSON.parse(this.productData.product_image);
    }
  }

  populateOptions() {
    this.colors = Array.from(
      new Set(this.variants.map((variant: any) => variant.color))
    );
    this.sizes = Array.from(
      new Set(this.variants.map((variant: any) => variant.size))
    );
    this.materials = Array.from(
      new Set(this.variants.map((variant: any) => variant.material))
    );
    console.log(this.sizes);
  }
}
