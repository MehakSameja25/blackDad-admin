import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManufacturersService } from 'src/app/admin/services/manufacturers.service';
import { ProductsService } from 'src/app/admin/services/products.service';

@Component({
  selector: 'app-manufacturer-order-vie',
  templateUrl: './manufacturer-order-vie.component.html',
  styleUrls: ['./manufacturer-order-vie.component.css'],
})
export class ManufacturerOrderVieComponent implements OnInit {
  id!: string | null;
  orderDetails: any;
  constructor(
    private orderService: ProductsService,
    private route: ActivatedRoute,
    private manuService: ManufacturersService
  ) {}

  slideConfig = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.orderService.getOrderDetails(this.id).subscribe((res: any) => {
      if (res) {
        this.orderDetails = res.data[0];
      }
    });
  }

  approve() {
    const body = {
      cartItemId: this.id,
      status: 'approved',
    };
    this.manuService.updateOrder(body).subscribe((res) => {
      if (res) {
        this.get();
      }
    });
  }

  rejected() {
    const body = {
      cartItemId: this.id,
      status: 'rejected',
    };
    this.manuService.updateOrder(body).subscribe((res) => {
      if (res) {
        this.get();
      }
    });
  }
}
