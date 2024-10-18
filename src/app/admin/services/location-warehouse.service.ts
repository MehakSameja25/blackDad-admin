import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';

@Injectable({
  providedIn: 'root',
})
export class LocationWarehouseService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  list() {
    return this.http.get(`${environment.apiUrl}/get-warehouse`);
  }

  get(id: string | number | null) {
    return this.http.get(`${environment.apiUrl}/get-warehouseById?id=${id}`);
  }

  add(data: any) {
    return apiCallWrapper(
      this.http.post(`${environment.apiUrl}/add-warehouse`, data),
      {
        notificationsService: this.notifications,
        action: 'Adding Warehouse',
      }
    );
  }

  delete(id: string | number | null) {
    return apiCallWrapper(
      this.http.delete(
        `${environment.apiUrl}/delete-warehouse?warehouseId=${id}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Deleting Warehouse',
      }
    );
  }
}
