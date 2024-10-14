import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainNavService } from 'src/app/admin/services/main-nav.service';
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
  userType!: string;
  acceptAccess: boolean = false;
  rejectAccess: boolean = false;
  constructor(
    private orderService: ProductsService,
    private route: ActivatedRoute,
    private manuService: ManufacturersService,
    private navService: MainNavService
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
    this.getMenu();
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

  getMenu() {
    this.navService.getMenu().subscribe((res) => {
      if (res) {
        this.userType = res.data[0]?.role_accesses[0]?.menu_bar?.title;
        this.acceptAccess =
          res.data[0]?.role_accesses[0]?.status.includes('accept');

        this.rejectAccess =
          res.data[0]?.role_accesses[0]?.status.includes('reject');
      }
    });
  }

  getStatus(status: string): string {
    switch (status) {
      case 'pending_from_manufacturer':
        return 'Pending';
      case 'in_process':
        return 'Confirmed';
      case 'on_the_way':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      case 'rejected_from_manufacturer':
        return 'Rejected from manufacturer';
      case 'canceled':
        return 'Canceled from user';
      default:
        return 'Unknown status';
    }
  }
}
