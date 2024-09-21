import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root',
})
export class ManufacturersService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  list() {
    return apiCallWrapper(
      this.http.get(`${environment.apiUrl}/get-manufacturer`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Manufecturers',
      }
    );
  }

  get(id: string | number | null) {
    return apiCallWrapper(
      this.http.get(
        `${environment.apiUrl}/get-manufacturerById?manufacturerId=${id}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Fetching Manufecturer Details',
      }
    );
  }

  add(data: any) {
    return apiCallWrapper(
      this.http.post(`${environment.apiUrl}/add-manufacturer`, data),
      {
        notificationsService: this.notifications,
        action: 'Adding Manufecturer',
      }
    );
  }

  delete(id: string | number | null) {
    return apiCallWrapper(
      this.http.delete(
        `${environment.apiUrl}/delete-manufacturer?manufacturerId=${id}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Deleting Manufecturer',
      }
    );
  }

  update(id: string | null, data: any) {
    return apiCallWrapper(
      this.http.put(
        `${environment.apiUrl}/update-manufacturer?manufacturerId=${id}`,
        data
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Manufecturer',
      }
    );
  }

  updateOrder(data: any) {
    return apiCallWrapper(
      this.http.put(`${environment.apiUrl}/update-order`, data),
      {
        notificationsService: this.notifications,
        action: 'Status Updated',
      }
    );
  }
}
