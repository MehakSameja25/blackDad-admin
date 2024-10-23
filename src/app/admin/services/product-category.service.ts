import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  list() {
    return this.http.get(`${environment.apiUrl}/get-product-category`);
  }

  get(id: string | number | null) {
    return this.http.get(
      `${environment.apiUrl}/get-product-categoryById?productCatgeoryId=${id}`
    );
  }

  add(data: any) {
    return apiCallWrapper(
      this.http.post(`${environment.apiUrl}/add-product-category`, data),
      {
        notificationsService: this.notifications,
        action: 'Adding Product Category',
      }
    );
  }

  delete(id: string | number | null) {
    return apiCallWrapper(
      this.http.delete(
        `${environment.apiUrl}/delete-product-category?productCatgeoryId=${id}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Deleting Product Category',
      }
    );
  }

  update(id: string | null, data: any) {
    return apiCallWrapper(
      this.http.put(
        `${environment.apiUrl}/update-product-category?productCatgeoryId=${id}`,
        data
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Product Category',
      }
    );
  }
}
