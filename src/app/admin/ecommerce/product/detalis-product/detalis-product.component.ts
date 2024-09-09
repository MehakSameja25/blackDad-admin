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

  slides = [
    { img: '../../../../assets/images/BMD-Testimonial-1.png' },
    { img: '../../../../assets/images/BMD-Testimonial-2.png' },
    { img: '../../../../assets/images/BMD-Testimonial-3.png' },
    { img: '../../../../assets/images/Workpac-Testimonial-1.png' },
    { img: '../../../../assets/images/Workpac-Testimonial-2.png' },
    { img: '../../../../assets/images/Workpac-Testimonial-3.png' },
  ];

  slideConfig = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productsService.get(id).subscribe((res: any) => {
      this.productDetails = res.data;
    });
  }

  fetchColor() {
    return this.productDetails.product_colors
      .map((data: any) => data.color)
      .join(',');
  }

  fetchSize() {
    return this.productDetails.product_sizes
      .map((data: any) => data.size)
      .join(',');
  }
}
