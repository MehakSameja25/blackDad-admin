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
  constructor(private authService: AuthanticationService, public router : Router) {}

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.authService.getDashboard().subscribe((res) => {
      if (res) {
        this.dashboardData = res;
        this.topSellingProducts = res.data?.topSellingProducts;
        this.recentProducts = res.data?.recentOrders;
        this.topManufacturers = res.data?.topManufacturer
      }
    });
  }
}
