import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthanticationService } from 'src/app/admin/services/authantication.service';

@Component({
  selector: 'app-manufacturer-dashboard',
  templateUrl: './manufacturer-dashboard.component.html',
  styleUrls: ['./manufacturer-dashboard.component.css'],
})
export class ManufacturerDashboardComponent implements OnInit {
  dashboardData: any;
  topSellingProducts: any;
  recentProducts: any;
  topManufacturers: any;
  constructor(
    private authService: AuthanticationService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.authService.getDashboard().subscribe((res) => {
      if (res) {
        this.dashboardData = res;
        this.topSellingProducts = res.data?.topSellingProducts;
        this.recentProducts = res.data?.recentOrders;
        this.topManufacturers = res.data?.topManufacturer;
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
