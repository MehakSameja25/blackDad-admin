import { Component, OnInit } from '@angular/core';
import { AuthanticationService } from 'src/app/admin/services/authantication.service';

@Component({
  selector: 'app-manufacturer-dashboard',
  templateUrl: './manufacturer-dashboard.component.html',
  styleUrls: ['./manufacturer-dashboard.component.css'],
})
export class ManufacturerDashboardComponent implements OnInit {
  dashboardData: any;
  topSellingProducts: any;
  constructor(private authService: AuthanticationService) {}

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.authService.getDashboard().subscribe((res) => {
      if (res) {
        this.dashboardData = res;
        this.topSellingProducts = res.data?.topSellingProducts;
      }
    });
  }
}
